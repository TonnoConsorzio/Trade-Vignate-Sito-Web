/**
 * types.ts
 * Definizione dell'interfaccia dati per il catalogo Trade Vignate.
 */

export interface SpecificheExtra {
  cambio?: string;
  colore_esterno?: string;
  interni?: string;
  porte?: string | number;
  classe_emissioni?: string;
  proprietari?: string | number;
  garanzia?: string;
  trazione?: string;
  [key: string]: string | number | undefined; // Permette proprietà addizionali
}

export interface Veicolo {
  id: string;
  nome: string;
  prezzo: number;
  anno: string; // MM/AAAA
  chilometri: number;
  targa: string | null;
  alimentazione: string; // Diesel, Benzina, Ibrida, Elettrica, GPL, Metano
  motore: string; // Cilindrata + Cavalli
  foto: string[];
  link_autoscout: string;
  specifiche_extra: SpecificheExtra;
}
