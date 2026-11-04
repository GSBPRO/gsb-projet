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

// image : null tant que les vraies photos ne sont pas fournies (une image provisoire s'affiche).
export const products = [
  { id: 1, name: 'Solution de soin Aster', format: 'Flacon · 250 ml', description: 'Solution nettoyante douce pour les soins de la peau.', categoryId: 1, laboratoryId: 1, priceHt: 12.5, vatRate: 20, stock: 120, validationStatus: 'Accepté', active: true, image: null },
  { id: 2, name: 'Coffret de soins Nova', format: 'Coffret · 12 unités', description: 'Assortiment de soins pour cabinet médical.', categoryId: 1, laboratoryId: 2, priceHt: 24.8, vatRate: 20, stock: 40, validationStatus: 'Accepté', active: true, image: null },
  { id: 3, name: 'Dispositif Solis', format: 'Boîte · 20 unités', description: 'Dispositif à usage unique pour les soins courants.', categoryId: 2, laboratoryId: 3, priceHt: 18.9, vatRate: 20, stock: 0, validationStatus: 'Accepté', active: true, image: null },
  { id: 4, name: 'Gel hydroalcoolique Aster', format: 'Flacon · 500 ml', description: 'Gel pour l’hygiène des mains, sans rinçage.', categoryId: 1, laboratoryId: 1, priceHt: 6.9, vatRate: 20, stock: 300, validationStatus: 'Accepté', active: true, image: null },
  { id: 5, name: 'Tensiomètre poignet Nova', format: 'Appareil · 1 unité', description: 'Tensiomètre électronique pour la mesure au poignet.', categoryId: 2, laboratoryId: 2, priceHt: 39, vatRate: 20, stock: 15, validationStatus: 'Accepté', active: true, image: null },
  { id: 6, name: 'Paracétamol 500 mg Solis', format: 'Boîte · 16 comprimés', description: 'Antalgique et antipyrétique.', categoryId: 3, laboratoryId: 3, priceHt: 1.8, vatRate: 2.1, stock: 500, validationStatus: 'Accepté', active: true, image: null },
  { id: 7, name: 'Ibuprofène 200 mg Aster', format: 'Boîte · 20 comprimés', description: 'Anti-inflammatoire non stéroïdien.', categoryId: 3, laboratoryId: 1, priceHt: 2.4, vatRate: 2.1, stock: 8, validationStatus: 'Accepté', active: true, image: null },
  { id: 8, name: 'Sérum physiologique Nova', format: 'Boîte · 30 unidoses', description: 'Solution de chlorure de sodium pour le lavage.', categoryId: 3, laboratoryId: 2, priceHt: 3.2, vatRate: 5.5, stock: 200, validationStatus: 'Accepté', active: true, image: null },
  { id: 9, name: 'Pansements stériles Solis', format: 'Boîte · 50 unités', description: 'Pansements adhésifs stériles, tailles assorties.', categoryId: 2, laboratoryId: 3, priceHt: 7.5, vatRate: 20, stock: 90, validationStatus: 'Accepté', active: true, image: null },
  { id: 10, name: 'Thermomètre digital Aster', format: 'Appareil · 1 unité', description: 'Thermomètre électronique à affichage rapide.', categoryId: 2, laboratoryId: 1, priceHt: 9.9, vatRate: 20, stock: 60, validationStatus: 'Accepté', active: true, image: null },
  { id: 11, name: 'Crème réparatrice Nova', format: 'Tube · 50 ml', description: 'Crème pour peaux sèches et irritées.', categoryId: 1, laboratoryId: 2, priceHt: 8.4, vatRate: 20, stock: 25, validationStatus: 'Accepté', active: true, image: null },
  { id: 12, name: 'Vitamine D3 Solis', format: 'Flacon · 20 ml', description: 'Complément en gouttes buvables.', categoryId: 3, laboratoryId: 3, priceHt: 5.6, vatRate: 5.5, stock: 140, validationStatus: 'Accepté', active: true, image: null },
  // Ces deux produits ne doivent PAS apparaître dans le catalogue (F12) : ils servent à le vérifier.
  { id: 13, name: 'Spray nasal Aster', format: 'Flacon · 15 ml', description: 'Proposé par le laboratoire, en attente de validation.', categoryId: 3, laboratoryId: 1, priceHt: 4.2, vatRate: 10, stock: 50, validationStatus: 'En attente', active: true, image: null },
  { id: 14, name: 'Masques chirurgicaux Nova', format: 'Boîte · 50 unités', description: 'Produit désactivé par l’administrateur.', categoryId: 2, laboratoryId: 2, priceHt: 5, vatRate: 20, stock: 400, validationStatus: 'Accepté', active: false, image: null },
];
