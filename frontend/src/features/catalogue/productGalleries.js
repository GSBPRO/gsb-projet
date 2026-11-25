import { galleryData } from './productGalleryData.js';

// Les sept premières galeries restent définies dans mockCatalogue.js.
// Les autres sont ajoutées au fur et à mesure de la livraison des cinq visuels.
export function withProductGallery(product) {
  const gallery = galleryData[product.id];
  if (!gallery) return product;

  return {
    ...product,
    ...gallery,
    ambiance: null,
    // Pas encore de vraie photo d'ambiance : comme pour p02 à p07, la photo du produit,
    // très floutée, sert de fond coloré (au survol de la carte et en 1re image de la fiche).
    blurredAmbiance: true,
    // Les anciennes rotations montrent un autre emballage : on conserve les fichiers,
    // mais on ne les mélange pas avec les cinq nouveaux visuels.
    views360: null,
  };
}
