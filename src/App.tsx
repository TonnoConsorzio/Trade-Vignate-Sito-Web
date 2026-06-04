import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  Award, 
  Star,
  ChevronRight,
  DollarSign,
  Mail,
  Menu,
  X
} from 'lucide-react';
import Catalogo from './components/Catalogo';
import Topbar from './components/Topbar';
import HeroHome from './components/HeroHome';
import ChiSiamo from './components/ChiSiamo';
import DettaglioAuto from './components/DettaglioAuto';

function AppContent() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orarioAttuale, setOrarioAttuale] = useState('');
  const location = useLocation();
  const currentPath = location.pathname;

  // Effetto per calcolare in tempo reale se la concessionaria a Vignate è Aperta o Chiusa
  useEffect(() => {
    const calcolaApertura = () => {
      // Imposta fuso orario di Roma/Europa
      const dataRoma = new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" });
      const oraRoma = new Date(dataRoma);
      const giorno = oraRoma.getDay(); // 0 = Domenica, 6 = Sabato
      const ora = oraRoma.getHours();
      const minuti = oraRoma.getMinutes();
      const tempoInMinuti = ora * 60 + minuti;

      // Orari concessionaria: 
      // Lun-Ven: 09:00-12:30 e 14:30-19:00
      // Sab: 09:00-12:30 (pomeriggio chiuso)
      // Dom: Chiuso
      const mattinoInizio = 9 * 60;   // 09:00
      const mattinoFine = 12 * 60 + 30; // 12:30
      const pomeriggioInizio = 14 * 60 + 30; // 14:30
      const pomeriggioFine = 19 * 60; // 19:00

      let aperto = false;

      if (giorno >= 1 && giorno <= 5) {
        // Lun-Ven
        if ((tempoInMinuti >= mattinoInizio && tempoInMinuti <= mattinoFine) || 
            (tempoInMinuti >= pomeriggioInizio && tempoInMinuti <= pomeriggioFine)) {
          aperto = true;
        }
      } else if (giorno === 6) {
        // Sabato solo mattina
        if (tempoInMinuti >= mattinoInizio && tempoInMinuti <= mattinoFine) {
          aperto = true;
        }
      }

      setIsOpen(aperto);

      // Formatta ore per display
      const oreStr = String(ora).padStart(2, '0');
      const minStr = String(minuti).padStart(2, '0');
      setOrarioAttuale(`${oreStr}:${minStr}`);
    };

    calcolaApertura();
    const interval = setInterval(calcolaApertura, 30000); // Aggiorna ogni 30 secondi
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F5F7] text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 antiderivative">
      
      {/* Dynamic Announcement Topbar */}
      <Topbar />

      {/* 1. HEADER DI NAVIGAZIONE FLOATING */}
      <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2">
        <div className="max-w-7xl mx-auto glass-effect rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center">
            <img src={`${import.meta.env.BASE_URL}Trade_Vignate_Logo.png`} alt="Trade Vignate Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" />
          </Link>

          {/* Menu di Navigazione Material Design - Nascosto su Mobile, visibile su lg */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/40">
            <Link
              to="/"
              className={`py-1.5 px-3 md:px-4 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalogo"
              className={`py-1.5 px-3 md:px-4 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/catalogo' || currentPath.startsWith('/auto')
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vetrina Auto
            </Link>
            <Link
              to="/chi-siamo"
              className={`py-1.5 px-3 md:px-4 rounded-lg text-xs font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/chi-siamo'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chi Siamo
            </Link>
          </nav>

          {/* CTA Azione Rapida Header */}
          <div className="flex items-center gap-2 md:gap-3">
            <a
              id="header-tap-to-call"
              href="tel:+393922841305"
              aria-label="Chiama ora Trade Vignate"
              className="py-2 px-2.5 sm:px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-500 sm:animate-bounce" />
              <span className="hidden sm:inline">Chiamaci ora</span>
            </a>
            
            <a
              id="header-contact-anchor"
              href="mailto:tradevignate@libero.it"
              aria-label="Invia un'email a Trade Vignate"
              className="py-2 px-2.5 sm:px-4 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-sans font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <span className="hidden leading-none sm:inline">Invia un'Email</span>
              <Mail className="w-4 h-4 sm:hidden" />
            </a>

            {/* Menu Hamburger Mobile */}
            <button
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Apri menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/'
                  ? 'bg-amber-500/10 text-amber-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/catalogo' || currentPath.startsWith('/auto')
                  ? 'bg-amber-500/10 text-amber-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Vetrina Auto
            </Link>
            <Link
              to="/chi-siamo"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                currentPath === '/chi-siamo'
                  ? 'bg-amber-500/10 text-amber-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Chi Siamo
            </Link>
          </div>
        )}
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
        <Routes>
          <Route path="/" element={
            <>
              {/* Real-time HeroHome carrying brand intro & latest vehicle drop */}
              <HeroHome />
              {/* Value Proposition / Transparency Pillars & Timeline */}
              <section id="value-proposition" className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">Perché scegliere Trade Vignate</h2>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="space-y-3.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="h-12 w-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-805 font-display">Consegna Rapida</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Prepariamo la tua nuova auto in tempi rapidi lavorando con trasparenza in ogni fase della vendita.
                    </p>
                  </div>
 
                  <div className="space-y-3.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="h-12 w-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-805 font-display">Diagnostica Inclusa</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      L'auto viene consegnata funzionante e, se possibile, rimessa a nuovo. La diagnosi elettronica ed i test di prova su strada sono inclusi nel prezzo.
                    </p>
                  </div>
 
                  <div className="space-y-3.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-805 font-display">Ritiro in Conto</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      L'auto viene ritirata in conto vendita da privati o partner commerciali fidati. Valutiamo permute veloci ed effettuiamo ritiri d'usato con voltura immediata.
                    </p>
                  </div>

                </div>

                {/* TIMELINE */}
                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 font-sans text-center">Il nostro processo di ritiro</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
                    
                    <div className="space-y-2 relative">
                      <span className="mx-auto h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">1</span>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">Inoltro Dati Vettura</h4>
                      <p className="text-[11px] text-slate-400">Mandaci i dettagli della tua auto via WhatsApp o per mail prima di venire.</p>
                    </div>

                    <div className="space-y-2 relative">
                      <span className="mx-auto h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">2</span>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">Valutazione di Mercato</h4>
                      <p className="text-[11px] text-slate-400">Ti facciamo una proposta basata sul reale valore commerciale ed usura.</p>
                    </div>

                    <div className="space-y-2 relative">
                      <span className="mx-auto h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">3</span>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">Accordo e Scalo Prezzo</h4>
                      <p className="text-[11px] text-slate-405">Scaliamo l'importo valutato direttamente dal prezzo della vettura scelta.</p>
                    </div>

                    <div className="space-y-2 relative">
                      <span className="mx-auto h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold">4</span>
                      <h4 className="text-xs font-bold text-slate-800 font-sans">Consegna e Voltura</h4>
                      <p className="text-[11px] text-slate-400">Espletiamo le pratiche di passaggio. Te ne vai con la tua nuova auto.</p>
                    </div>

                  </div>
                </div>
              </section>
            </>
          } />

          <Route path="/catalogo" element={
            <div id="showroom-section" className="py-2 space-y-6">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 tracking-tight">Le Nostre Occasioni</h2>
                </div>
                <p className="text-xs text-slate-400">Prezzi trasparenti e reali, aggiornati quotidianamente.</p>
              </div>
              <Catalogo />
            </div>
          } />

          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/auto/:slug" element={<DettaglioAuto />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 font-display">404</h1>
              <h2 className="text-xl font-bold text-slate-800">Pagina non trovata</h2>
              <p className="text-slate-500 font-sans text-sm">La pagina che stai cercando non esiste o è stata rimossa.</p>
              <Link to="/" className="mt-4 py-2 px-4 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-sm hover:bg-amber-400 transition-colors">Torna alla Home</Link>
            </div>
          } />
        </Routes>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* Informazioni legali reali */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={`${import.meta.env.BASE_URL}Trade_Vignate_Logo.png`} alt="Trade Vignate Logo" className="h-10 sm:h-12 md:h-16 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
              Trade Vignate di Marco Massarotti<br />
              Via del Lavoro 50, Vignate (MI) - C.A.P. 20052<br />
              P.IVA 07521220967<br />
              Reg. Imprese di Milano - Marco Massarotti
            </p>
          </div>

          {/* Quick links & contatti */}
          <div className="space-y-3 font-sans text-xs">
            <h4 className="text-white font-bold font-display uppercase tracking-wider text-xs">Contatti & Supporto</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="block text-[10px] text-slate-500 font-mono">Telefono Diretto:</span>
                <a href="tel:+393922841305" className="hover:text-amber-400 font-bold text-slate-300 font-mono">+39 392 2841305 (Marco Massarotti)</a>
              </li>
              <li>
                <span className="block text-[10px] text-slate-500 font-mono">E-mail:</span>
                <a href="mailto:tradevignate@libero.it" className="hover:text-amber-400 font-mono font-bold">tradevignate@libero.it</a>
              </li>
            </ul>
          </div>

          {/* Come Raggiungerci Card Footer */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl space-y-3.5">
            <h4 className="text-amber-400 font-bold font-display uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Come Raggiungerci & Appuntamenti
            </h4>
            <div className="space-y-2.5 text-[11px] leading-relaxed font-sans text-slate-305">
              <p className="text-slate-300">📍 <strong>Via del Lavoro 50, Vignate (MI)</strong> — Appuntamento telefonico consigliato prima della visita.</p>
              <div className="border-t border-slate-800 my-1 pt-2">
                <p className="text-[10px] text-amber-400 font-mono">🚆 In Treno:</p>
                <p className="text-slate-400">Passante ferroviario <strong>Linea S5</strong>, stazione di <strong>Vignate</strong> (raggiungibile a piedi).</p>
              </div>
              <div className="border-t border-slate-800 my-1 pt-2">
                <p className="text-[10px] text-amber-400 font-mono">🚗 In Auto:</p>
                <p className="text-slate-400">Autostrada <strong>BRE.BE.MI</strong>, Uscita <strong>Pozzuolo Martesana</strong>, oppure S.P. Cassanese/Rivoltana.</p>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <span>&copy; {new Date().getFullYear()} Trade Vignate. Tutti i diritti riservati.</span>
          <span>Si riceve su appuntamento - Via del Lavoro 50, Vignate (MI)</span>
          <span>
            Made with ❤️ &amp; 🍕 by{' '}
            <a 
              href="https://alessiobellan.it" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors underline decoration-amber-500/30"
            >
              Alessio Bellan
            </a>
          </span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}
