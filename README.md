# Trade Vignate — Automobili d'occasione 🚗✨

Sito web istituzionale e catalogo interattivo di **Trade Vignate**, concessionaria di auto d'occasione di riferimento situata a Vignate (Milano). L'applicazione presenta un catalogo aggiornato in tempo reale con le ultime disponibilità di vetture usate selezionate, con dettagliate schede informative e gallerie immagini ad alta risoluzione.

---

## 🎨 Caratteristiche Chiave del Portale

- **Catalogo Dinamico & Ricerca Avanzata**: Filtri interattivi per marca, alimentazione, budget e chilometraggio massimo.
- **Schede Veicolo Dettagliate**: Gallerie multimediali, specifiche tecniche profonde, equipaggiamenti, e pulsanti di chiamata all'azione (WhatsApp, Telefono, Email) per prenotare un test drive.
- **Trasparenza Garantita**: Tutte le auto includono la diagnosi elettronica approfondita e il test di prova su strada eseguiti prima della consegna.
- **Accessibilità & Navigazione**: Layout reattivo ottimizzato per dispositivi mobili e desktop, con una mappa e indicazioni dettagliate per raggiungere la sede (anche tramite mezzi pubblici come il Passante Ferroviario Linea S5).
- **Automazione & Sincronizzazione**: Integrazione diretta delle ultime vetture disponibili tramite scraper automatizzato.

---

## ⚙️ Architettura Tecnica

Il progetto è strutturato come una **Single Page Application (SPA)** moderna, performante e completamente automatizzata:

* **Frontend**: React 18+ accoppiato con **Vite** e **TypeScript** per garantire massima velocità di compilazione e tipizzazione robusta.
* **Stile**: **Tailwind CSS** per una veste grafica premium, moderna e minimalista, con un look-and-feel ad alto contrasto.
* **Animazioni**: **Framer Motion** per transizioni fluide tra le schede veicolo e animazioni d'ingresso.
* **Gestione Icone**: **Lucide React** per un'iconografia vettoriale coerente.

---

## 🔄 Sincronizzazione Automatica dello Stock (Scraper)

Per mantenere il catalogo costantemente allineato con le disponibilità reali, l'applicazione utilizza un flusso di lavoro serverless automatizzato:

1. **Scraper Node.js (`fetch_cars.js`)**: Recupera in tempo reale le informazioni e le immagini dei veicoli associati direttamente da AutoScout24.
2. **Aggiornamento Database Locale**: Salva l'output strutturato all'interno di `src/data/auto_catalogo.json`.
3. **Automazione GitHub Actions (`.github/workflows/sync_catalogo.yml`)**:
   - Esegue lo scraper **3 volte al giorno**.
   - Per aggirare le code di esecuzione di GitHub Actions, lo script è schedulato ad orari non canonici (offset al minuto `23`):
     - **08:23 CEST** (Italiano) / `06:23 UTC`
     - **14:23 CEST** (Italiano) / `12:23 UTC`
     - **20:37 CEST** (Italiano) / `18:37 UTC`
   - Se vengono rilevate modifiche nello stock, viene eseguito automaticamente il commit e il push dei dati aggiornati in produzione senza interrompere il servizio (Zero-Downtime).

---

## 🚀 Sviluppo Locale ed Avvio

### Prerequisiti
Assicurati di avere installato sul tuo computer **Node.js** (versione 18 o superiore) ed **npm**.

### 1. Installazione delle dipendenze
```bash
npm install
```

### 2. Avvio del server di sviluppo
```bash
npm run dev
```
Il sito sarà accessibile all'indirizzo locale: `http://localhost:3000`

### 3. Compilazione per la Produzione
Per generare la build statica ottimizzata e pronta per il deployment:
```bash
npm run build
```
I file compilati verranno generati all'interno della cartella `/dist`.

### 4. Avvio manuale dello Scraper di Sincronizzazione
Se si desidera forzare l'aggiornamento immediato delle vetture in archivio locale:
```bash
node fetch_cars.js
```

---

## 📍 Informazioni e Contatti Reali
* **Sede Operativa**: Via del Lavoro 50, Vignate (MI)
* **Come Arrivare**: 
  * 🚆 In treno: Passante ferroviario **Linea S5**, Stazione di **Vignate** (raggiungibile comodamente a piedi).
  * 🚗 In auto: Autostrada **Bre.Be.Mi** (Uscita Pozzuolo Martesana), oppure S.P. Cassanese/Rivoltana.
* **Orari**: Si riceve preferibilmente su appuntamento telefonico.

---

*Made with ❤️ & 🍕 by [Alessio Bellan](https://alessiobellan.it)*
