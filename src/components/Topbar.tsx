import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import autoCatalogo from '../data/auto_catalogo.json';
import { Veicolo } from '../types';
import { getCarSlug } from '../utils/slugify';

export default function Topbar() {
  const [veicoloInEvidenza, setVeicoloInEvidenza] = useState<Veicolo | null>(null);

  useEffect(() => {
    // Caricamento del catalogo deterministico e selezione casuale stabile sul singolo caricamento
    const catalog: Veicolo[] = autoCatalogo as Veicolo[];
    if (catalog && catalog.length > 0) {
      const randomIndex = Math.floor(Math.random() * catalog.length);
      setVeicoloInEvidenza(catalog[randomIndex]);
    }
  }, []);

  if (!veicoloInEvidenza) return null;

  // Estrazione intelligente di Marca e Modello, gestendo marchi composti (es. Alfa Romeo, Land Rover)
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

  const { marca, modello } = getMarcaModello(veicoloInEvidenza.nome);
  const prezzoFormattato = veicoloInEvidenza.prezzo.toLocaleString('it-IT');
  
  // CTA string as mandated
  const testoCta = `Disponibile ${marca} ${modello} Anno ${veicoloInEvidenza.anno} a ${prezzoFormattato}€ — Scopri i dettagli`;

  return (
    <div 
      id="top-bar-announcement" 
      className="bg-slate-900 border-b border-amber-950/20 text-white py-2 px-3 text-center font-sans relative z-50 w-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-yellow-950/40 to-amber-950/40 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-1 relative z-10">
        <span className="hidden sm:inline-flex items-center gap-1 bg-amber-500/25 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-amber-300 animate-pulse">
          <Sparkles className="w-3 h-3 text-amber-400" />
          In Evidenza
        </span>
        
        <Link 
          id="top-bar-cta-link"
          to={`/auto/${getCarSlug(veicoloInEvidenza.nome, veicoloInEvidenza.anno)}`}
          className="hover:underline flex items-center justify-center text-slate-100 hover:text-amber-400 transition-colors duration-150 py-0.5 text-[10px] sm:text-xs tracking-tight leading-normal text-center max-w-full break-words px-2"
        >
          <span className="font-semibold block text-center max-w-full break-words">{testoCta}</span>
        </Link>
      </div>
    </div>
  );
}
