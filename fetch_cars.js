/**
 * fetch_cars.js
 * Automated Node.js scraper for Trade Vignate dealer stock on AutoScout24.
 * Integrates error handling and cache protection to preserve existing local stock on failures.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.join(__dirname, 'src', 'data', 'auto_catalogo.json');
const URL_DEALER = 'https://www.autoscout24.it/concessionari/trade-di-marco-massarotti';

// Helper to generate a clean, SEO-friendly slug
function getCarSlug(nome, anno) {
  const annoParts = anno.split('/');
  const year = annoParts[annoParts.length - 1];
  return `${nome} ${year}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Function to perform HTTPS request
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };

    https.get(url, options, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        return reject(new Error(`La richiesta è fallita con codice di stato: ${statusCode}`));
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        resolve(rawData);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('--- AVVIO SINCRONIZZAZIONE CATALOGO TRADE VIGNATE ---');
  console.log(`Richiesta pagina concessionario: ${URL_DEALER}`);

  try {
    const htmlContents = await fetchHtml(URL_DEALER);
    
    // Tenta di localizzare il tag __NEXT_DATA__
    const match = htmlContents.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    
    if (!match) {
      throw new Error("Impossibile trovare il tag <script id='__NEXT_DATA__'> nella pagina AutoScout24.");
    }

    const nextData = JSON.parse(match[1]);
    
    // Navigazione attenta del JSON restituito da NextJS
    // Nella tipica struttura AutoScout24, gli annunci si trovano dentro:
    // nextData.props.pageProps.listings oppure in contesti analoghi dell'initialState
    const props = nextData.props || {};
    const pageProps = props.pageProps || {};
    const rawListings = pageProps.listings || pageProps.stockList || [];

    console.log(`Trovati ${rawListings.length} veicoli grezzi riscontrati nel payload.`);

    if (!Array.isArray(rawListings) || rawListings.length === 0) {
      throw new Error("Il payload restituito contiene 0 veicoli o non è della forma prevista. Protezione Cache ATTIVA.");
    }

    // Mappatura e pulizia dei dati
    const veicoliMappati = rawListings.map((car, idx) => {
      const id = car.id || `as24-${idx}`;
      
      // Estraiamo in modo sicuro marca e modello per ripulire il titolo
      const brand = car.vehicle?.make || '';
      const versionInput = car.vehicle?.modelVersionInput || car.vehicle?.model || '';
      
      // Pulizia titolo: formattiamo come "[Marca] [Allestimento/Modello]"
      let nomePulito = '';
      if (brand && versionInput) {
        if (versionInput.toLowerCase().startsWith(brand.toLowerCase())) {
          nomePulito = versionInput;
        } else {
          nomePulito = `${brand} ${versionInput}`;
        }
      } else {
        nomePulito = brand || 'Auto in Stock';
      }

      // Prezzo
      const prezzo = car.prices?.public?.priceRaw || car.prices?.dealer?.priceRaw || 0;

      // Anno di immatricolazione (formato MM/AAAA)
      const anno = car.vehicle?.firstRegistrationDate?.formatted || '01/2020';

      // Chilometri
      const chilometri = car.vehicle?.mileageInKm?.raw || 0;

      // Targa (non disponibile ed esclusa per prevenire falsi positivi)
      const targa = null;

      // Alimentazione
      const alimentazione = car.vehicle?.fuelCategory?.formatted || 'Benzina';

      // Motore - Potenza
      const motore = car.vehicle?.powerInHp?.formatted || car.vehicle?.powerInKw?.formatted || 'Dati in sintesi';

      // Foto reali (se presenti)
      let foto = [];
      if (Array.isArray(car.images)) {
        foto = car.images.slice(0, 10);
      } else if (car.image) {
        foto = [car.image];
      }
      if (foto.length === 0) {
        foto = [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200"
        ];
      }

      // Link AutoScout per tracciamento opzionale (nascosto nel frontend)
      const link_autoscout = car.url ? `https://www.autoscout24.it${car.url}` : URL_DEALER;

      // Specifiche extra bento (garanzia rimossa in conformità per evitare falsi positivi)
      const specifiche_extra = {
        cambio: car.vehicle?.transmissionType?.formatted || 'Manuale',
        colore_esterno: car.vehicle?.bodyType?.formatted || 'Varia',
        interni: 'Tessuto',
        porte: '5',
        classe_emissioni: 'Euro 6',
        proprietari: car.vehicle?.noOfPreviousOwners?.formatted && car.vehicle?.noOfPreviousOwners?.formatted !== '- (Proprietari)' ? car.vehicle?.noOfPreviousOwners?.formatted : '1',
        trazione: 'Anteriore'
      };

      return {
        id,
        nome: nomePulito,
        prezzo,
        anno,
        chilometri,
        targa,
        alimentazione,
        motore,
        foto,
        link_autoscout,
        specifiche_extra
      };
    });

    // Validazione profonda finale prima della scrittura
    if (veicoliMappati.length === 0) {
      throw new Error("La mappatura ha prodotto un array vuoto. Abortito per prevenire sovrascrittura.");
    }

    // Scrittura file protetta
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(veicoliMappati, null, 2), 'utf8');
    console.log(`Sincronizzazione completata con successo! Scritto ${veicoliMappati.length} veicoli nel file.`);
    process.exit(0);

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR DURANTE IL FETCH DEL CATALOGO:');
    console.error('\x1b[31m%s\x1b[0m', error.message);
    if (fs.existsSync(CATALOG_PATH)) {
      console.log('--- PROTEZIONE CACHE ATTIVA: Il catalogo preesistente è stato preservato. Costruzione consentita. ---');
      process.exit(0);
    } else {
      console.error('\x1b[31m%s\x1b[0m', 'ERRORE SCHEMA: Nessun catalogo preesistente trovato. Il build fallirà.');
      process.exit(1);
    }
  }
}

run();
