import { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  RefreshCcw, 
  HelpCircle, 
  Info,
  DollarSign,
  TrendingUp,
  MapPin,
  Flame,
  X
} from 'lucide-react';
import autoCatalogoRaw from '../data/auto_catalogo.json';
import { Veicolo } from '../types';
import CarCard from './CarCard';

// Cast dei dati grezzi dal JSON secondo l'interfaccia definita
const autoCatalogo = autoCatalogoRaw as Veicolo[];

export default function Catalogo() {
  // Stati di filtraggio
  const [ricerca, setRicerca] = useState('');
  const [alimentazioneSelezionata, setAlimentazioneSelezionata] = useState('Tutte');
  const [cambioSelezionato, setCambioSelezionato] = useState('Tutti');
  const [prezzoMassimo, setPrezzoMassimo] = useState<number>(50000);
  const [kmMassimi, setKmMassimi] = useState<number>(250000);
  const [ordinamento, setOrdinamento] = useState('prezzo-asc');

  // Calcola i valori limite reali presenti nel catalogo per calibrare i controlli
  const marginiCatalogo = useMemo(() => {
    if (autoCatalogo.length === 0) {
      return { maxPrezzo: 40000, maxKm: 120000 };
    }
    const prezzi = autoCatalogo.map(c => c.prezzo);
    const kms = autoCatalogo.map(c => c.chilometri);
    return {
      maxPrezzo: Math.max(...prezzi, 35000),
      maxKm: Math.max(...kms, 100000)
    };
  }, []);

  // Alimenta l'array dei tipi di carburante unici presenti
  const alimentazioniDisponibili = useMemo(() => {
    const tipi = new Set<string>();
    tipi.add('Tutte');
    autoCatalogo.forEach(car => {
      if (car.alimentazione) tipi.add(car.alimentazione);
    });
    return Array.from(tipi);
  }, []);

  // Reset completo dei filtri
  const resetFiltri = () => {
    setRicerca('');
    setAlimentazioneSelezionata('Tutte');
    setCambioSelezionato('Tutti');
    setPrezzoMassimo(marginiCatalogo.maxPrezzo);
    setKmMassimi(marginiCatalogo.maxKm);
    setOrdinamento('prezzo-asc');
  };

  // Logica principale di filtraggio ed ordinamento in memoria (istantanea)
  const veicoliFiltrati = useMemo(() => {
    let ris = [...autoCatalogo];

    // 1. Ricerca testuale (Marca, Modello, Allestimento, Targa o dettagli motore)
    if (ricerca.trim()) {
      const query = ricerca.toLowerCase().trim();
      ris = ris.filter(car => 
        car.nome.toLowerCase().includes(query) ||
        car.alimentazione.toLowerCase().includes(query) ||
        car.motore.toLowerCase().includes(query) ||
        (car.targa && car.targa.toLowerCase().includes(query)) ||
        (car.specifiche_extra?.cambio && car.specifiche_extra.cambio.toLowerCase().includes(query)) ||
        (car.specifiche_extra?.colore_esterno && car.specifiche_extra.colore_esterno.toLowerCase().includes(query))
      );
    }

    // 2. Filtro alimentazione
    if (alimentazioneSelezionata !== 'Tutte') {
      ris = ris.filter(car => car.alimentazione === alimentazioneSelezionata);
    }

    // 3. Filtro Tipo Cambio (Automatico / Manuale)
    if (cambioSelezionato !== 'Tutti') {
      ris = ris.filter(car => {
        const cambioStr = (car.specifiche_extra?.cambio || '').toLowerCase();
        if (cambioSelezionato === 'Automatico') {
          return cambioStr.includes('auto') || cambioStr.includes('tct') || cambioStr.includes('tronic') || cambioStr.includes('steptronic');
        } else if (cambioSelezionato === 'Manuale') {
          return cambioStr.includes('manu');
        }
        return true;
      });
    }

    // 4. Limite prezzo
    ris = ris.filter(car => car.prezzo <= prezzoMassimo);

    // 5. Limite chilometrico
    ris = ris.filter(car => car.chilometri <= kmMassimi);

    // 6. Ordinamento logico
    ris.sort((a, b) => {
      if (ordinamento === 'prezzo-asc') {
        return a.prezzo - b.prezzo;
      }
      if (ordinamento === 'prezzo-desc') {
        return b.prezzo - a.prezzo;
      }
      if (ordinamento === 'km-asc') {
        return a.chilometri - b.chilometri;
      }
      if (ordinamento === 'anno-desc') {
        // Formato MM/AAAA -> estrae anno e mese per ordinare descendentemente
        const getVal = (str: string) => {
          const parti = str.split('/');
          if (parti.length === 2) {
            return Number(parti[1]) * 12 + Number(parti[0]);
          }
          return 0;
        };
        return getVal(b.anno) - getVal(a.anno);
      }
      return 0;
    });

    return ris;
  }, [ricerca, alimentazioneSelezionata, cambioSelezionato, prezzoMassimo, kmMassimi, ordinamento]);

  // Calcolo statistiche veloci dell'inventario filtrato per bento-grid superiore
  const statsFiltrate = useMemo(() => {
    if (veicoliFiltrati.length === 0) {
      return { count: 0, prezzoMedio: 0, kmMedio: 0 };
    }
    const totPrezzo = veicoliFiltrati.reduce((sum, c) => sum + c.prezzo, 0);
    const totKm = veicoliFiltrati.reduce((sum, c) => sum + c.chilometri, 0);
    return {
      count: veicoliFiltrati.length,
      prezzoMedio: Math.round(totPrezzo / veicoliFiltrati.length),
      kmMedio: Math.round(totKm / veicoliFiltrati.length)
    };
  }, [veicoliFiltrati]);

  return (
    <div id="showroom-section" className="space-y-10 animate-fade-in">
      
      {/* 1. SEZIONE RICERCA & FILTRI (Bento-Panel Material Design) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Background Accent decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 z-10 relative">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold font-display text-slate-800">Filtra l'Inventario</h2>
            </div>
          </div>
          
          {/* Bottone di reset rapido */}
          <button
            id="reset-filters-btn"
            onClick={resetFiltri}
            className="self-start lg:self-center py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-850 bg-slate-50 hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer border border-slate-200"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Azzera Filtri
          </button>
        </div>

        {/* INPUTBAR DI RICERCA GLOBALE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-6 z-10 relative">
          
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              id="search-input"
              type="text"
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca per marca, modello, allestimento, targa, cambio..."
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-250/70 focus:border-amber-500 focus:bg-white rounded-2xl text-slate-705 placeholder-slate-400 text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
            />
            {ricerca && (
              <button
                onClick={() => setRicerca('')}
                className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-slate-650"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* ORDINAMENTO */}
          <div className="md:col-span-3">
            <select
              id="sort-select"
              value={ordinamento}
              onChange={(e) => setOrdinamento(e.target.value)}
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-250/70 focus:border-amber-500 focus:bg-white rounded-2xl text-slate-700 text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all cursor-pointer"
            >
              <option value="prezzo-asc">Prezzo: dal più basso</option>
              <option value="prezzo-desc">Prezzo: dal più alto</option>
              <option value="km-asc">Chilometri: meno percorsi</option>
              <option value="anno-desc">Immatricolazione: più recente</option>
            </select>
          </div>

          {/* RANGE DEL CAMBIO */}
          <div className="md:col-span-3">
            <select
              id="change-select"
              value={cambioSelezionato}
              onChange={(e) => setCambioSelezionato(e.target.value)}
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-250/70 focus:border-amber-500 focus:bg-white rounded-2xl text-slate-700 text-sm focus:ring-4 focus:ring-amber-500/10 outline-none transition-all cursor-pointer"
            >
              <option value="Tutti">Cambio: Tutti</option>
              <option value="Automatico">Cambio: Automatico</option>
              <option value="Manuale">Cambio: Manuale</option>
            </select>
          </div>

        </div>

        {/* SLIDERS E CHIP FILTRI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pt-6 mt-4 border-t border-slate-50 z-10 relative">
          
          {/* Slider Prezzo Massimo */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-sans">
              <span className="font-semibold text-slate-600">Budget Massimo</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                EUR {new Intl.NumberFormat('it-IT').format(prezzoMassimo)}
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min="1000"
              max={marginiCatalogo.maxPrezzo}
              step="500"
              value={prezzoMassimo}
              onChange={(e) => setPrezzoMassimo(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.000 €</span>
              <span>{new Intl.NumberFormat('it-IT').format(marginiCatalogo.maxPrezzo)} €</span>
            </div>
          </div>

          {/* Slider Chilometri Massimi */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-sans">
              <span className="font-semibold text-slate-600">Percorrenza Massima</span>
              <span className="font-bold text-slate-900 font-mono text-sm">
                {new Intl.NumberFormat('it-IT').format(kmMassimi)} km
              </span>
            </div>
            <input
              id="km-range"
              type="range"
              min="5000"
              max={marginiCatalogo.maxKm}
              step="1000"
              value={kmMassimi}
              onChange={(e) => setKmMassimi(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5.000 km</span>
              <span>{new Intl.NumberFormat('it-IT').format(marginiCatalogo.maxKm)} km</span>
            </div>
          </div>

          {/* Chip Alimentazione per selezione svelta */}
          <div className="lg:col-span-4 space-y-2.5">
            <label className="block text-xs font-semibold text-slate-600 font-sans">Carburante / Motore</label>
            <div className="flex flex-wrap gap-1.5">
              {alimentazioniDisponibili.map((tipo) => (
                <button
                  key={tipo}
                  id={`chip-fuel-${tipo}`}
                  onClick={() => setAlimentazioneSelezionata(tipo)}
                  className={`py-1.5 px-3 rounded-full text-xs font-medium font-sans cursor-pointer transition-all duration-200 ${
                    alimentazioneSelezionata === tipo
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 2. DYNAMIC WIDGET PERFORMANCE STATS */}
      {veicoliFiltrati.length > 0 && (
        <div id="stat-bar" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider opacity-60">Auto Disponibili</span>
              <span className="text-xl font-bold font-display">{statsFiltrate.count} {statsFiltrate.count === 1 ? 'vettura' : 'vetture'}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Prezzo Medio</span>
              <span className="text-xl font-bold font-display text-slate-850">
                {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(statsFiltrate.prezzoMedio)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Km Medi per vettura</span>
              <span className="text-xl font-bold font-display text-slate-850">
                {new Intl.NumberFormat('it-IT').format(statsFiltrate.kmMedio)} km
              </span>
            </div>
          </div>

        </div>
      )}

      {/* 3. GRIGLIA VEICOLI */}
      {veicoliFiltrati.length > 0 ? (
        <div id="cars-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {veicoliFiltrati.map(veicolo => (
            <CarCard key={veicolo.id} veicolo={veicolo} />
          ))}
        </div>
      ) : (
        /* Nessun veicolo corrisponde */
        <div id="no-cars-match" className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="p-4 bg-amber-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-amber-600 mb-4 animate-bounce">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-slate-800 mb-2">Nessun veicolo trovato</h3>
          <p className="text-sm text-slate-500 mb-6">
            Nessuna delle vetture corrisponde ai criteri impostati. Prova a reimpostare i parametri o allarga i parametri di spesa o chilometri.
          </p>
          <button
            id="error-reset-filters-btn"
            onClick={resetFiltri}
            className="py-3 px-6 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-sans font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Azzera tutti i filtri
          </button>
        </div>
      )}

      {/* BANNER ASSISTENZA TRADUZIONE */}
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/15 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-extrabold text-amber-850 tracking-wider uppercase font-sans flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600 inline" />
            Finanziamenti & Permute
          </p>
          <h4 className="text-lg font-bold text-slate-800 font-display">Ti interessa permutare la tua vecchia auto?</h4>
          <p className="text-xs text-slate-500 font-sans max-w-2xl">
            Valutiamo il tuo usato sul momento. Puoi scalare il valore stimato direttamente dall'acquisto di uno dei veicoli in stock sopra descritti. Portaci il libretto e la targa per una stima immediata.
          </p>
        </div>
        <a
          id="cta-direct-contact"
          href="https://wa.me/393270000000?text=Gentile%20Trade%20Vignate%2C%20vorrei%20informazioni%20per%20una%20valutazione%20usato"
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-center py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all whitespace-nowrap cursor-pointer hover:shadow-emerald-700/15"
        >
          Richiedi Valutazione WhatsApp
        </a>
      </div>

    </div>
  );
}
