import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Layers,
  Fuel,
  Info,
  BadgePercent,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import autoCatalogo from '../data/auto_catalogo.json';
import { Veicolo } from '../types';
import { getCarSlug } from '../utils/slugify';

export default function HeroHome() {
  const catalog: Veicolo[] = autoCatalogo as Veicolo[];

  // Logica deterministica per estrarre l'auto più recente
  // Convertiamo la stringa "MM/AAAA" in un valore numerico per ordinamento cronologico descrescente
  const autoPiuRecente = useMemo(() => {
    if (!catalog || catalog.length === 0) return null;
    
    return [...catalog].sort((a, b) => {
      const parseData = (str: string) => {
        const [mese, anno] = str.split('/').map(Number);
        return (anno * 12) + mese;
      };
      return parseData(b.anno) - parseData(a.anno); // Discendente per ottenere la più recente
    })[0];
  }, [catalog]);

  // Stato per l'immagine attiva della galleria dell'ultimo arrivo
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!autoPiuRecente) return null;

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (autoPiuRecente.foto && autoPiuRecente.foto.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % autoPiuRecente.foto.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (autoPiuRecente.foto && autoPiuRecente.foto.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + autoPiuRecente.foto.length) % autoPiuRecente.foto.length);
    }
  };

  const getHighQualityUrl = (url: string) => {
    if (!url) return '';
    return url.replace('/250x188.webp', '/800x600.webp').replace('/250x188.jpg', '/800x600.jpg');
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* SEZIONE MAIN HERO CON LAYOUT ASIMMETRICO ED ELEVATISSIMO IMPATTO VISIVO */}
      <div 
        id="hero-panel" 
        className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 p-6 md:p-12 shadow-md flex flex-col lg:flex-row-reverse items-stretch gap-10"
      >
        {/* Cerchi di luce di sfondo con intensità calibrata */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
 
        {/* COLONNA: Titolo e due Bottoni (Visualizzati in alto su Mobile e sulla Destra su Desktop) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.08]">
              La tua nuova auto,<br />
              a un <span className="text-amber-500 underline decoration-amber-500/30 decoration-wavy">prezzo onesto</span>.
            </h1>
          </div>
 
          <div className="flex flex-wrap items-center gap-4">
            <Link
              id="cta-browse-showroom"
              to="/catalogo"
              className="py-4 px-8 bg-amber-500 hover:bg-slate-900 hover:text-white text-slate-950 font-sans font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-lg hover:shadow-amber-500/10 transition-all active:scale-95 duration-150 cursor-pointer"
            >
              <span>Sfoglia il Parco Auto</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
 
            <Link
              id="cta-how-we-work"
              to="/chi-siamo"
              className="py-4 px-8 bg-white hover:bg-slate-50 text-slate-800 font-sans font-bold text-sm rounded-xl inline-flex items-center gap-1.5 border border-slate-200 shadow-sm transition-all active:scale-95 duration-150"
            >
              <span>Scopri Chi Siamo</span>
            </Link>
          </div>
        </div>
 
        {/* COLONNA: MONUMENTAL CARD "ULTIMO ARRIVO" (Visualizzata in basso su Mobile e sulla Sinistra su Desktop) */}
        <div className="w-full lg:w-1/2 z-10 flex">
          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl md:rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between relative overflow-hidden">
            
            {/* Badge "Ultimo Arrivo" */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-rose-600 text-white font-display font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
              <BadgePercent className="w-3.5 h-3.5 animate-pulse" />
              <span>Ultimo Arrivo</span>
            </div>
 
            <div className="space-y-4">
               {/* Galleria Fotografica ad alte performance */}
              <div id="hero-carousel-container" className="relative h-64 md:h-72 w-full rounded-2xl overflow-hidden shadow-inner group">
                <img 
                  referrerPolicy="no-referrer"
                  src={getHighQualityUrl(autoPiuRecente.foto[activeImageIndex]) || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200"} 
                  alt={autoPiuRecente.nome} 
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out select-none"
                />
                
                {autoPiuRecente.foto && autoPiuRecente.foto.length > 1 && (
                  <>
                    {/* Frecce di navigazione foto */}
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                      title="Immagine precedente"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                      title="Prossima immagine"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
 
                    {/* Indicatori Punti/Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {autoPiuRecente.foto.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${index === activeImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                          title={`Vai all'immagine ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
 
              {/* Informazioni Principali Auto */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-amber-600 tracking-wider">
                    {autoPiuRecente.nome.split(' ')[0]} {/* Stampa la Marca */}
                  </span>
                </div>
 
                <h3 className="text-xl font-bold font-display text-slate-800 tracking-tight leading-tight">
                  {autoPiuRecente.nome.substring(autoPiuRecente.nome.indexOf(' ') + 1)}
                </h3>
 
                {/* Prezzo Reale e Chilometri */}
                <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/15 p-3 rounded-xl">
                  <span className="text-2.5xl font-black text-amber-600 font-display">
                    {autoPiuRecente.prezzo.toLocaleString('it-IT')} €
                  </span>
                  <span className="text-xs text-slate-600 font-semibold font-sans">
                    {autoPiuRecente.chilometri.toLocaleString('it-IT')} km percorsi
                  </span>
                </div>
              </div>
 
              {/* Griglia Dettagli in Material Card */}
              <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-150 text-xs font-sans text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Anno: <strong>{autoPiuRecente.anno}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Motore: <strong>{autoPiuRecente.alimentazione}</strong></span>
                </div>
 
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="truncate" title={autoPiuRecente.specifiche_extra.cambio}>
                    Cambio: <strong>{autoPiuRecente.specifiche_extra.cambio?.includes('(') ? autoPiuRecente.specifiche_extra.cambio.split('(')[0].trim() : autoPiuRecente.specifiche_extra.cambio}</strong>
                  </span>
                </div>
 
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">
                    Consegnata: <strong>Funzionante</strong>
                  </span>
                </div>
              </div>
            </div>
 
            {/* Pulsante CTA Scheda Dettaglio Interna */}
            <div className="pt-4 mt-2">
              <Link 
                id="hero-featured-auto-url"
                to={`/auto/${getCarSlug(autoPiuRecente.nome, autoPiuRecente.anno)}`}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-sans font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200 group/btn"
              >
                <span>Vedi dettagli e scheda tecnica</span>
                <ChevronRight className="w-4 h-4 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
 
          </div>
        </div>
 
      </div>
    </div>
  );
}
