import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Calendar, 
  Gauge, 
  Fuel, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  Info,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone
} from 'lucide-react';
import autoCatalogoRaw from '../data/auto_catalogo.json';
import { Veicolo } from '../types';
import { getCarSlug } from '../utils/slugify';

const autoCatalogo = autoCatalogoRaw as Veicolo[];

export default function DettaglioAuto() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Tenta di abbinare lo slug con uno dei veicoli del catalogo
  const veicolo = autoCatalogo.find((car) => {
    const carSlug = getCarSlug(car.nome, car.anno);
    return carSlug === slug;
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!veicolo) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-4 bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-amber-600 mb-6 animate-bounce">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-800 mb-2">Vettura non trovata</h2>
        <p className="text-sm text-slate-500 mb-8">
          Siamo spiacenti, ma la vettura richiesta non sembra essere più disponibile nel nostro showroom o l'indirizzo inserito è errato.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3.5 px-6 bg-amber-500 hover:bg-slate-900 hover:text-white text-slate-950 font-sans font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna al Catalogo
        </Link>
      </div>
    );
  }

  // Estrazione intelligente di Marca e Modello
  const getMarcaModello = (nomecompleto: string) => {
    const marchiComposti = ["Alfa Romeo", "Aston Martin", "Land Rover", "Mercedes-Benz", "Mercedes Benz"];
    for (const brand of marchiComposti) {
      if (nomecompleto.startsWith(brand)) {
        return {
          marca: brand,
          modello: nomecompleto.substring(brand.length).trim()
        };
      }
    }
    const primoSpazio = nomecompleto.indexOf(' ');
    if (primoSpazio === -1) {
      return { marca: nomecompleto, modello: '' };
    }
    return {
      marca: nomecompleto.substring(0, primoSpazio),
      modello: nomecompleto.substring(primoSpazio + 1)
    };
  };

  const { marca, modello } = getMarcaModello(veicolo.nome);
  const prezzoFormattato = veicolo.prezzo.toLocaleString('it-IT');
  const kmFormattato = veicolo.chilometri.toLocaleString('it-IT');

  // Configurazione mailto dinamica per box conversione
  const emailDestinatario = "tradevignate@libero.it";
  const oggettoEmail = `Richiesta informazioni per ${marca} ${modello} - ${veicolo.anno}`;
  const corpoEmail = `Salve Trade Vignate, vorrei maggiori informazioni sulla vettura ${marca} ${modello} dell'anno ${veicolo.anno} al prezzo di ${prezzoFormattato}€. Desidero essere ricontattato.`;
  
  const mailtoHref = `mailto:${emailDestinatario}?subject=${encodeURIComponent(oggettoEmail)}&body=${encodeURIComponent(corpoEmail)}`;

  const getHighQualityUrl = (url: string) => {
    if (!url) return '';
    // Converte gli URL AutoScout thumbnail a immagini ad alta risoluzione
    return url.replace('/250x188.webp', '/1200x900.webp').replace('/250x188.jpg', '/1200x900.jpg');
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % veicolo.foto.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + veicolo.foto.length) % veicolo.foto.length);
  };

  return (
    <div id="dettaglio-veicolo" className="space-y-8 animate-fade-in">
      
      {/* 1. PULSANTE INDIETRO / BREADCRUMB */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 font-sans font-semibold text-xs rounded-xl border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 text-amber-500" />
          <span>Torna al Parco Auto</span>
        </Link>
        <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
          Scheda Tecnica #ID {veicolo.id}
        </span>
      </div>

      {/* 2. INTESTAZIONE MONUMENTALE */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-955 font-bold rounded text-[10px] uppercase font-mono">
            {marca}
          </span>
          <span className="font-sans text-[10px] bg-emerald-50 border border-emerald-150 rounded px-2.5 py-1 text-emerald-800 font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            L'auto viene consegnata funzionante
          </span>
        </div>
        <h1 className="text-2.5xl md:text-3.5xl font-black font-display text-slate-900 tracking-tight leading-none">
          {veicolo.nome}
        </h1>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          L'auto viene consegnata funzionante e, se possibile, rimessa a nuovo. La diagnosi elettronica ed i test su strada sono inclusi nel prezzo.
        </p>
      </div>

      {/* 3. CONTENUTO PRINCIPALE A DUE COLONNE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLONNA SINISTRA: GALLERIA E DETTAGLI SPECIFICICI (LARGHEZZA 7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sezione Material Card Galleria Immagini */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-4">
            
            <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                <img 
                  referrerPolicy="no-referrer"
                  src={getHighQualityUrl(veicolo.foto[activeImageIndex]) || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200"} 
                  alt={`${veicolo.nome} - Vista ${activeImageIndex + 1}`} 
                  className="w-full h-full object-cover transition-all duration-300 select-none"
                />
              
              {veicolo.foto && veicolo.foto.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer shadow-md"
                    title="Immagine precedente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer shadow-md"
                    title="Prossima immagine"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Miniature Gallerie Mini-Slider */}
            {veicolo.foto && veicolo.foto.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full justify-start items-center">
                {veicolo.foto.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer border-2 ${
                      index === activeImageIndex 
                        ? 'border-amber-500 scale-95 shadow-sm' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      referrerPolicy="no-referrer"
                      src={getHighQualityUrl(img)} 
                      alt={`Miniatura ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* Note di Affidabilità e Preparazione Realistica */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-display">Condizioni di Consegna</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 leading-relaxed">
                  <strong>Consegnata Funzionante:</strong> L'auto viene consegnata funzionante e, se possibile, rimessa a nuovo.
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 leading-relaxed">
                  <strong>Ritiro in Conto:</strong> L'auto viene ritirata in conto vendita da privati o partner qualificati.
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 leading-relaxed">
                  <strong>Diagnostica Inclusa:</strong> La diagnosi elettronica ed i test su strada sono inclusi per la massima tranquillità.
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-600 leading-relaxed">
                  <strong>Lavaggio Interno:</strong> Il lavaggio e la sanificazione interni non sono inclusi.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* COLONNA DESTRA: SPECIFICHE TECNICHE E CONVERSION BOX (LARGHEZZA 5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Box Specifiche Tecniche Monumentali */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Sezione Prezzo Monumentale con Evidenziazione */}
            <div className="pb-5 border-b border-slate-100 bg-amber-500/10 border-l-4 border-l-amber-500 p-4 rounded-xl">
              <span className="text-[10px] tracking-wider uppercase font-mono text-amber-850 block mb-1">Prezzo dell'auto</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-display text-amber-600 tracking-tight leading-none">
                  {prezzoFormattato} €
                </span>
                <span className="text-xs text-amber-800 font-semibold">(Passaggio Escluso)</span>
              </div>
              <span className="block text-[10px] text-amber-700 font-sans mt-1">✓ Prezzo chiaro ed onesto, senza vincoli di finanziamento</span>
            </div>

            {/* Griglia KPI Tecnici */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Immatricolazione</span>
                  <span className="text-sm font-bold text-slate-800 font-mono">{veicolo.anno}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Chilometraggio</span>
                  <span className="text-sm font-bold text-slate-800 font-mono whitespace-nowrap">{kmFormattato} km</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-50 text-amber-650 flex-shrink-0">
                  <Fuel className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Carburante</span>
                  <span className="text-sm font-bold text-slate-800 font-sans">{veicolo.alimentazione}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Propulsione</span>
                  <span className="text-xs font-bold text-slate-800 font-sans block truncate" title={veicolo.motore}>
                    {veicolo.motore.includes("(") ? veicolo.motore.split('(')[0].trim() : veicolo.motore}
                  </span>
                </div>
              </div>

            </div>

            {/* Dettagli Tecnici Addizionali */}
            <div className="space-y-3 pt-2">
              <span className="block text-[10px] tracking-wider uppercase font-mono text-slate-400">Ulteriori Specifiche</span>
              
              <div className="space-y-2 text-xs font-sans">
                {veicolo.specifiche_extra.cambio && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Cambio / Trasmissione</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.cambio}</strong>
                  </div>
                )}
                {veicolo.specifiche_extra.colore_esterno && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Colore Esterno</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.colore_esterno}</strong>
                  </div>
                )}
                {veicolo.specifiche_extra.interni && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Rivestimento Interno</span>
                    <strong className="text-slate-850 font-semibold truncate max-w-[200px]" title={veicolo.specifiche_extra.interni}>
                      {veicolo.specifiche_extra.interni}
                    </strong>
                  </div>
                )}
                {veicolo.specifiche_extra.porte && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Porte / Posti</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.porte}</strong>
                  </div>
                )}
                {veicolo.specifiche_extra.classe_emissioni && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Classe Emissioni</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.classe_emissioni}</strong>
                  </div>
                )}
                {veicolo.specifiche_extra.proprietari && (
                  <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                    <span className="text-slate-400">Proprietari storici</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.proprietari}</strong>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-slate-50 text-slate-600">
                  <span className="text-slate-400">Stato Vettura</span>
                  <strong className="text-emerald-700 font-semibold">Consegnata funzionante ed esaminata</strong>
                </div>
                {veicolo.specifiche_extra.trazione && (
                  <div className="flex justify-between py-2 text-slate-600 border-b border-slate-50">
                    <span className="text-slate-400">Trazione</span>
                    <strong className="text-slate-850 font-semibold">{veicolo.specifiche_extra.trazione}</strong>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* BOX DI CONVERSIONE (MAILTO LINK PRECOMPILATO) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-lg relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] tracking-wider uppercase font-mono text-amber-400 font-bold block flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Richiesta Sicura e Trasparente
              </span>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">Sei interessato? Contattaci</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Ti forniamo risposte rapide in giornata. Cliccando sotto aprirai l'e-mail precompilata con targa e parametri della vettura per una risposta immediata e senza impegno.
              </p>
            </div>

            <div className="space-y-3 z-10 relative">
              
              {/* Mailto link principale d'azione */}
              <a
                id="mailto-contact-button"
                href={mailtoHref}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-slate-950 font-sans font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 duration-250 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Richiedi Informazioni (E-mail)</span>
              </a>

              {/* Contatto rapido sussidiario */}
              <a
                id="phone-contact-button"
                href="tel:+393922841305"
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-slate-100 font-sans font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/5 transition-all text-center"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Chiama subito: +39 392 2841305 (Marco Massarotti)</span>
              </a>

            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Sede: Chiusi (Ora locale: 22:19)</span>
              <span>In risposta rapida</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
