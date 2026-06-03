/**
 * slugify.ts
 * Genera lo slug SEO-friendly per le auto di Trade Vignate.
 */

export function getCarSlug(nome: string, anno: string): string {
  // Estrae l'anno (es. da MM/AAAA o AAAA)
  const annoParts = anno.split('/');
  const year = annoParts[annoParts.length - 1];

  return `${nome} ${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Rimuove accenti/diacritici
    .replace(/[^a-z0-9\s-]/g, "") // Rimuove caratteri speciali tranne spazi ed ipotetici trattini
    .trim()
    .replace(/\s+/g, "-") // Sostituisce spazi con trattino singolo
    .replace(/-+/g, "-"); // Collassa più trattini in uno solo
}
