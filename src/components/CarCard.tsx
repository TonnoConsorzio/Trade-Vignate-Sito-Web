import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Gauge, 
  Zap, 
  Fuel, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  CheckCircle,
  Sparkles,
  Car
} from 'lucide-react';
import { Veicolo } from '../types';
import { getCarSlug } from '../utils/slugify';

export interface CarCardProps {
  veicolo: Veicolo;
  key?: string;
}

export default function CarCard({ veicolo }: CarCardProps) {
  const [currentFotoIdx, setCurrentFotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Gestione navigazione carosello immagini interna
  const handlePrevFoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previene il click sull'intero link dell'annuncio
    setCurrentFotoIdx((prev) => (prev === 0 ? veicolo.foto.length - 1 : prev - 1));
  };

  const handleNextFoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFotoIdx((prev) => (prev === veicolo.foto.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentFotoIdx(index);
  };

  // Funzione per formattare la valuta (Prezzo) in formato italiano (es. € 29.800)
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  };

  // Funzione per formattare i chilometri (es: 45.000 km)
  const formatKm = (val: number) => {
    return new Intl.NumberFormat('it-IT').format(val) + ' km';
  };  const getHighQualityUrl = (url: string) => {
    if (!url) return '';
    return url.replace('/250x188.webp', '/800x600.webp').replace('/250x188.jpg', '/800x600.jpg');
  };

  return (
    <div
      id={`card-${veicolo.id}`}
      className="group relative flex flex-col justify-between h-full bg-white rounded-3xl overflow-hidden transition-all duration-300 ease-out border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* SEZIONE GALLERIA IMMAGINI */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden select-none">
        {veicolo.foto && veicolo.foto.length > 0 ? (
          <img
            id={`img-${veicolo.id}`}
            src={getHighQualityUrl(veicolo.foto[currentFotoIdx])}
            alt={`${veicolo.nome} - Dettaglio ${currentFotoIdx + 1}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 bg-slate-800">
            <Car className="w-12 h-12 stroke-[1]" />
            <span className="ml-2 text-sm font-sans">Foto non disponibile</span>
          </div>
        )}

        {/* Gradiente nero sottostante per legibilità scritte in testata foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25 pointer-events-none" />

        {/* Overlay Badges foto */}
        <div className="absolute top-4 left-4 right-4 flex justify-end items-start pointer-events-none">
          <span className="text-[10px] font-sans font-bold tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-full flex items-center gap-1 pointer-events-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline" />
            Consegnata Funzionante
          </span>
        </div>

        {/* CONTROLLI CAROSELLO (Frecce visibili su Hover) */}
        {veicolo.foto && veicolo.foto.length > 1 && (
          <div className={`absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              id={`prev-btn-${veicolo.id}`}
              onClick={handlePrevFoto}
              className="p-2 rounded-full glass-effect text-slate-800 hover:bg-white hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer"
              aria-label="Immagine precedente"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              id={`next-btn-${veicolo.id}`}
              onClick={handleNextFoto}
              className="p-2 rounded-full glass-effect text-slate-800 hover:bg-white hover:scale-110 active:scale-95 shadow-md transition-all cursor-pointer"
              aria-label="Immagine successiva"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* CONTATORI DOTS GALLERIA (Se ci sono più foto) */}
        {veicolo.foto && veicolo.foto.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {veicolo.foto.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                id={`dot-${veicolo.id}-${idx}`}
                onClick={(e) => handleDotClick(e, idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentFotoIdx === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Vai alla foto ${idx + 1}`}
              />
            ))}
            {veicolo.foto.length > 5 && (
              <span className="text-[9px] text-white/90 font-mono self-center bg-black/40 px-1 py-0.2 rounded">
                +{veicolo.foto.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* DETTAGLI AUTO & CARATTERISTICHE */}
      <div className="flex-grow p-6 flex flex-col justify-between">
        {/* Intestazione: Nome e Prezzo */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 font-sans">
            {veicolo.nome.split(' ')[0]} {/* Stampa la Marca */}
          </p>
          <h3 className="text-lg font-bold font-display text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {veicolo.nome.substring(veicolo.nome.indexOf(' ') + 1)} {/* Modello ed Allestimento */}
          </h3>
          <div className="flex items-center justify-between mt-3 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-2xl w-full">
            <span className="text-2xl font-black font-display text-amber-600 tracking-tight">
              {formatPrice(veicolo.prezzo)}
            </span>
            <span className="text-[10px] font-mono font-bold uppercase text-amber-800 bg-amber-500/20 px-2 py-0.5 rounded-md">
              Pronto All'Uso
            </span>
          </div>
        </div>

        {/* GRIGLIA SPECIFICHE SPECIFICATES: MATERIAL-STYLE */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          
          {/* 1. BLOCCO IMMATRICOLAZIONE (ANNO) */}
          <div className="bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-sans uppercase tracking-[0.05em]">Anno</span>
              <span className="text-[13px] font-bold text-slate-700 font-mono">{veicolo.anno}</span>
            </div>
          </div>

          {/* 2. BLOCCO ALIMENTAZIONE (CARBURANTE) */}
          <div className="bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-yellow-50 text-amber-650">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-sans uppercase tracking-[0.05em]">Reg</span>
              <span className="text-[13px] font-bold text-slate-700 font-sans truncate block max-w-[85px]">
                {veicolo.alimentazione}
              </span>
            </div>
          </div>

          {/* 3. BLOCCO CHILOMETRI */}
          <div className="group/km-block relative bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 overflow-hidden transition-colors flex items-center gap-2.5 select-none">
            
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-200/50 pointer-events-none overflow-hidden rounded-full">
              <div className="w-[10px] h-[3px] bg-amber-500/80 rounded-full animate-pulse mx-auto opacity-0 group-hover/km-block:opacity-100 transition-opacity"></div>
            </div>

            <div className="absolute top-2.5 right-2 opacity-0 group-hover/km-block:opacity-100 pointer-events-none transition-all duration-300">
              <Car className="w-5 h-5 text-amber-400/40 animate-car-glide" />
            </div>

            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 transition-transform duration-300 group-hover/km-block:scale-95">
              <Gauge className="w-4 h-4" />
            </div>
            <div className="z-10">
              <span className="block text-[10px] text-slate-400 font-sans uppercase tracking-[0.05em] transition-colors group-hover/km-block:text-amber-700">Percorso</span>
              <span className="text-[13px] font-bold text-slate-700 font-mono whitespace-nowrap">
                {formatKm(veicolo.chilometri)}
              </span>
            </div>
          </div>

          {/* 4. BLOCCO MOTORE */}
          <div className="group/engine-block bg-slate-50/70 hover:bg-slate-50 p-2.5 rounded-xl border border-slate-100 transition-colors flex items-center gap-2.5 select-none">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 transition-all duration-300 group-hover/engine-block:bg-amber-100">
              <Zap className="w-4 h-4 group-hover/engine-block:animate-engine-vibe" />
            </div>
            <div className="truncate">
              <span className="block text-[10px] text-slate-400 font-sans uppercase tracking-[0.05em] group-hover/engine-block:text-amber-700">Dettagli</span>
              <span className="text-[13px] font-bold text-slate-700 font-sans block truncate max-w-[95px]" title={veicolo.motore}>
                {veicolo.motore.includes("(") ? veicolo.motore.split('(')[0].trim() : veicolo.motore}
              </span>
            </div>
          </div>
          
        </div>

        {/* DETTAGLI EXTRA CHIAVE-VALORE */}
        {veicolo.specifiche_extra.cambio && (
          <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50/40 rounded-xl text-xs text-slate-600 font-sans mb-4 border border-slate-50">
            <span className="text-slate-400">Trasmissione / Cambio</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {veicolo.specifiche_extra.cambio}
            </span>
          </div>
        )}

        {/* PULSANTE DI SCHEDA DETTAGLIO INTERNA */}
        <Link
          id={`link-detail-${veicolo.id}`}
          to={`/auto/${getCarSlug(veicolo.nome, veicolo.anno)}`}
          className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-sans font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-amber-500/15 group-hover:scale-[1.01]"
        >
          <span>Scopri Dettagli</span>
          <ChevronRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
