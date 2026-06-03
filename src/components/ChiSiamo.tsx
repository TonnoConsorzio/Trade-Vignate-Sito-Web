import { 
  Users, 
  MapPin, 
  Clock, 
  FileCheck2, 
  Building2, 
  Truck,
  Eye,
  LineChart,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';

export default function ChiSiamo() {
  return (
    <div id="about-us-container" className="space-y-12 animate-fade-in">
      
      {/* 1. SEZIONE INTRODUTTIVA */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500 block">La Nostra Filosofia</span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            La nostra promessa di trasparenza
          </h2>
          
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-sans">
            Benvenuti in <strong>Trade Vignate</strong> di Marco Massarotti. Situati a Vignate (MI), operiamo sul mercato offrendo automobilisti d'occasione selezionati. Costruiamo il nostro rapporto coi clienti sulla totale trasparenza e su condizioni reali.
          </p>
        </div>
      </div>

      {/* 2. CONDIZIONI DI PREPARAZIONE AUTO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Card Condizioni e Preparazione */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-amber-300 border border-white/5 rounded-full text-xs font-semibold font-sans">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Consegna e Funzionamento</span>
            </div>
            
            <h3 className="text-2xl font-bold font-display text-white tracking-tight">
              Preparazione & Stato d'Uso
            </h3>
            
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              <strong>L'auto viene consegnata funzionante e, se possibile, rimessa a nuovo.</strong> Dedichiamo la massima cura nel verificare ogni componente tecnico affinché siate pronti a viaggiare fin dal primo giorno in totale serenità.
            </p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
              La diagnosi elettronica ed i test di prova su strada sono sempre inclusi nel prezzo di vendita per assicurarne il perfetto stato operativo meccanico ed elettrico prima della consegna.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-8 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>✓ Test di prova su strada incluso</span>
            <span>✓ Pronta per l'uso immediato</span>
          </div>
        </div>

        {/* Card Dettagli Consegna e Limitazioni */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full text-xs font-semibold font-sans">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Condizioni di Trasparenza</span>
            </div>
            
            <h3 className="text-2xl font-bold font-display text-slate-800 tracking-tight">
              Dettagli d'acquisto chiari ed onesti.
            </h3>
            
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
              I nostri clienti scelgono Trade Vignate perché evitiamo giri di parole. Ecco esattamente le nostre condizioni reali:
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-2.5 text-xs text-slate-600 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Diagnostica e Collaudo inclusi:</strong> Effettuiamo una diagnosi elettronica completa con appositi strumenti informatici prima del ritiro.
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-600 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Ritiro in Conto:</strong> L'auto viene ritirata in conto vendita da canali selezionati, garantendo un canale trasparente tra venditore ed acquirente.
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-600 font-sans">
                <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Pulizia ed Igienizzazione interni:</strong> Il lavaggio e l'igienizzazione approfonditi interni non sono inclusi nel prezzo dell'auto e rimangono a carico del cliente interessato.
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* 3. COME RAGGIUNGERCI */}
      <div id="come-raggiungerci" className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
        <h3 className="text-xl md:text-2xl font-bold font-display text-slate-900 tracking-tight">Come Raggiungerci</h3>
        <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
          Ci trovate in <strong>Via del Lavoro 50, Vignate (Milano) - 20052</strong>. Al fine di potervi servire al meglio e dedicare ad ognuno il giusto tempo, è gradito un contatto telefonico per concordare un appuntamento e visionare la vettura.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">In Treno:</span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Linea S5 del passante ferroviario di Trenord (tratta Varese - Treviglio), scendendo alla Fermata <strong>Vignate</strong>. Siamo facilmente raggiungibili a piedi.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">In Auto:</span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Dall'autostrada BRE.BE.MI prendete l'Uscita <strong>Pozzuolo Martesana</strong>. Oppure tramite la s.p. Cassanese o s.p. Rivoltana, prendendo l'uscita <strong>Vignate</strong>.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">In Aereo / Stazioni Centrali:</span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              Ci troviamo a pochi chilometri dall'Aeroporto di <strong>Linate</strong> e a breve distanza dalla stazione ferroviaria FS di <strong>Rogoredo (Milano)</strong>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
