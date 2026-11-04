// Données fictives du catalogue, en attendant l'API Express.
// Les champs reprennent ceux de la base (schema.sql) : prix HT, taux de TVA, stock,
// statut de validation et produit actif ou non.

// tagline : la courte description affichée dans le menu du catalogue ; color : la teinte de son image.
export const categories = [
  { id: 1, name: 'Soins & hygiène', tagline: 'Hygiène et soins du quotidien', color: '#5fb0de' },
  { id: 2, name: 'Dispositifs médicaux', tagline: 'Matériel et appareils de soin', color: '#31516b' },
  { id: 3, name: 'Produits pharmaceutiques', tagline: 'Médicaments et compléments', color: '#9fc9dd' },
];

// color : la teinte de l'image provisoire de chaque laboratoire.
export const laboratories = [
  { id: 1, name: 'Laboratoire Aster', color: '#5fb0de' },
  { id: 2, name: 'Laboratoire Nova', color: '#7c8fd4' },
  { id: 3, name: 'Laboratoire Solis', color: '#d9a066' },
];

// Aucun produit pour l'instant : on travaille d'abord l'esthétique du site.
// Les 40 rendus Blender sont gardés dans public/produits/ pour plus tard.
// Forme d'un produit : { id, name, format, description, categoryId, laboratoryId, priceHt, vatRate, stock,
//   validationStatus: 'Accepté', active: true, image, views360 }
export const products = [];
