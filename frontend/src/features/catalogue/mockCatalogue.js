// Données fictives du catalogue, en attendant l'API Express.
// Les champs reprennent ceux de la base (schema.sql) : prix HT, taux de TVA, stock,
// statut de validation et produit actif ou non.
// ATTENTION : noms, prix, stocks et laboratoires sont inventés pour la maquette.

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

// Une ligne par produit : [dossier des images, nom, format, description, catégorie, laboratoire, prix HT, TVA %, stock].
// Les images sont dans public/produits/<dossier>/ : principal.webp et 360/vue_000.webp à vue_035.webp.
const rows = [
  // Produits pharmaceutiques (catégorie 3)
  ['p01-paracetamol-500-mg', 'Paracétamol 500 mg', 'Boîte de 16 comprimés', 'Antalgique et antipyrétique pour les douleurs légères à modérées et la fièvre. Ne pas dépasser 3 g par jour.', 3, 1, 1.9, 10, 120],
  ['p02-ibuprofene-400-mg', 'Ibuprofène 400 mg', 'Boîte de 20 comprimés', 'Anti-inflammatoire non stéroïdien contre la douleur, la fièvre et les états inflammatoires.', 3, 2, 2.8, 10, 84],
  ['p03-aspirine-500-mg', 'Aspirine 500 mg', 'Boîte de 20 comprimés', 'Acide acétylsalicylique pour soulager les maux de tête, les douleurs dentaires et les états grippaux.', 3, 3, 2.4, 10, 63],
  ['p04-sels-de-rehydratation', 'Sels de réhydratation', 'Boîte de 10 sachets', "Solution de réhydratation orale pour compenser les pertes d'eau et de sels minéraux lors de diarrhées.", 3, 1, 4.9, 10, 45],
  ['p05-antiacide', 'Antiacide', 'Flacon de 250 ml', "Suspension buvable contre les brûlures d'estomac et les remontées acides.", 3, 2, 5.2, 10, 38],
  ['p06-pastilles-pour-la-gorge', 'Pastilles pour la gorge', 'Boîte de 24 pastilles', 'Pastilles à sucer pour apaiser les maux de gorge et les irritations de la bouche.', 3, 3, 3.6, 10, 90],
  ['p07-sirop-contre-la-toux', 'Sirop contre la toux', 'Flacon de 125 ml', 'Sirop adoucissant pour calmer la toux sèche et irritative.', 3, 1, 4.7, 10, 52],
  ['p08-solution-saline-nasale', 'Solution saline nasale', 'Flacon de 100 ml', 'Solution isotonique pour nettoyer et hydrater les fosses nasales.', 3, 2, 3.9, 10, 77],
  ['p09-spray-nasal-decongestionnant', 'Spray nasal décongestionnant', 'Flacon de 15 ml', 'Spray pour dégager rapidement le nez en cas de rhume. Utilisation limitée à 5 jours.', 3, 3, 5.8, 10, 8],
  ['p10-antihistaminique', 'Antihistaminique', 'Boîte de 15 comprimés', "Soulage les symptômes de l'allergie : rhinite, éternuements, larmoiement, démangeaisons.", 3, 1, 6.4, 10, 41],
  ['p11-antiseptique-cutane', 'Antiseptique cutané', 'Flacon de 100 ml', 'Solution pour désinfecter les plaies superficielles, les coupures et la peau avant un soin.', 3, 2, 4.1, 10, 66],
  ['p12-bain-de-bouche', 'Bain de bouche', 'Flacon de 300 ml', "Solution antiseptique pour l'hygiène bucco-dentaire et les soins de la gencive.", 3, 3, 4.5, 20, 58],
  ['p13-vitamine-c', 'Vitamine C', 'Boîte de 30 comprimés', 'Complément alimentaire pour soutenir les défenses naturelles et réduire la fatigue.', 3, 1, 7.9, 10, 72],
  ['p14-vitamine-d', 'Vitamine D', 'Flacon de 20 ml', "Complément alimentaire en gouttes, utile lorsque l'exposition au soleil est faible.", 3, 2, 8.4, 10, 49],
  ['p15-magnesium-b6', 'Magnésium B6', 'Boîte de 60 comprimés', 'Association de magnésium et de vitamine B6 pour lutter contre la fatigue et le stress passager.', 3, 3, 9.2, 10, 0],
  ['p16-serum-physiologique', 'Sérum physiologique', 'Boîte de 40 unidoses', 'Unidoses stériles de chlorure de sodium pour le lavage du nez et des yeux.', 3, 1, 3.7, 10, 150],
  ['p17-larmes-artificielles', 'Larmes artificielles', 'Boîte de 30 unidoses', "Collyre lubrifiant pour soulager la sécheresse oculaire et l'inconfort des yeux irrités.", 3, 2, 8.9, 10, 33],

  // Soins & hygiène (catégorie 1)
  ['p18-creme-hydratante', 'Crème hydratante', 'Tube de 200 ml', 'Crème pour le visage et le corps qui hydrate durablement les peaux normales à sèches.', 1, 3, 9.5, 20, 64],
  ['p19-creme-reparatrice', 'Crème réparatrice', 'Tube de 100 ml', 'Soin riche pour apaiser et réparer les peaux irritées, rougies ou très sèches.', 1, 1, 11.9, 20, 47],
  ['p20-gel-nettoyant-visage', 'Gel nettoyant visage', 'Flacon de 200 ml', 'Gel doux sans savon pour nettoyer le visage sans agresser la barrière cutanée.', 1, 2, 7.4, 20, 82],
  ['p21-creme-solaire-spf-50', 'Crème solaire SPF 50', 'Tube de 50 ml', "Protection très haute contre les UVA et UVB, résistante à l'eau, pour peaux sensibles.", 1, 3, 12.5, 20, 29],
  ['p22-baume-a-levres', 'Baume à lèvres', 'Stick de 4 g', 'Baume nourrissant qui protège et répare les lèvres gercées.', 1, 1, 2.6, 20, 200],
  ['p23-gel-hydroalcoolique', 'Gel hydroalcoolique', 'Flacon de 300 ml', "Gel désinfectant pour les mains, efficace sans eau ni savon.", 1, 2, 3.8, 20, 140],
  ['p24-savon-dermatologique', 'Savon dermatologique', 'Pain de 100 g', 'Savon surgras sans parfum pour la toilette quotidienne des peaux sensibles.', 1, 3, 3.2, 20, 95],
  ['p25-shampooing-antipelliculaire', 'Shampooing antipelliculaire', 'Flacon de 250 ml', 'Shampooing traitant qui élimine les pellicules et apaise les démangeaisons du cuir chevelu.', 1, 1, 6.9, 20, 6],
  ['p26-dentifrice-fluore', 'Dentifrice fluoré', 'Tube de 75 ml', "Dentifrice au fluor pour renforcer l'émail et prévenir les caries.", 1, 2, 2.9, 20, 180],
  ['p27-brosse-a-dents', 'Brosse à dents', 'Lot de 2', 'Brosses à dents souples à tête compacte pour un nettoyage doux des dents et des gencives.', 1, 3, 3.4, 20, 110],
  ['p28-fil-dentaire', 'Fil dentaire', 'Bobine de 50 m', 'Fil dentaire ciré pour nettoyer les espaces entre les dents.', 1, 1, 2.2, 20, 130],

  // Dispositifs médicaux (catégorie 2)
  ['p29-compresses-steriles', 'Compresses stériles', 'Boîte de 50 sachets', 'Compresses de gaze stériles, en sachets individuels, pour le nettoyage et la protection des plaies.', 2, 2, 5.6, 20, 100],
  ['p30-pansements-adhesifs', 'Pansements adhésifs', 'Boîte de 100', "Pansements résistants à l'eau, en plusieurs tailles, pour les petites coupures et écorchures.", 2, 3, 4.3, 20, 160],
  ['p31-bandage-extensible', 'Bandage extensible', 'Rouleau de 4 m x 7 cm', 'Bande élastique de contention légère pour maintenir un pansement ou soutenir une articulation.', 2, 1, 3.9, 20, 75],
  ['p32-sparadrap-medical', 'Sparadrap médical', 'Rouleau de 5 m x 2,5 cm', 'Sparadrap hypoallergénique, facile à déchirer à la main, pour fixer les pansements.', 2, 2, 2.7, 20, 120],
  ['p33-thermometre-numerique', 'Thermomètre numérique', 'Unité', 'Thermomètre électronique à lecture rapide, avec alarme de fièvre et mémoire de la dernière mesure.', 2, 3, 8.9, 20, 55],
  ['p34-poche-de-froid-instantanee', 'Poche de froid instantanée', 'Lot de 4', 'Poches à usage unique qui refroidissent instantanément après une pression, pour les contusions et les chocs.', 2, 1, 6.5, 20, 9],
  ['p35-bouillotte', 'Bouillotte', 'Unité de 2 L', 'Bouillotte à eau chaude avec housse douce, pour soulager les douleurs musculaires et les tensions.', 2, 2, 10.9, 20, 36],
  ['p36-masques-chirurgicaux', 'Masques chirurgicaux', 'Boîte de 50', 'Masques de type IIR, trois couches, avec barre nasale et élastiques, pour la protection en soin.', 2, 3, 7.9, 20, 210],
  ['p37-gants-medicaux', 'Gants médicaux', 'Boîte de 100', "Gants d'examen en nitrile, non poudrés, ambidextres, pour les soins et la manipulation.", 2, 1, 9.9, 20, 175],
  ['p38-pince-a-epiler', 'Pince à épiler', 'Unité', 'Pince à épiler de précision en acier inoxydable, utile pour retirer échardes et corps étrangers.', 2, 2, 3.5, 20, 88],
  ['p39-tire-tique', 'Tire-tique', 'Lot de 2', 'Crochet pour retirer proprement les tiques sans écraser leur corps ni laisser la tête dans la peau.', 2, 3, 4.2, 20, 0],
  ['p40-boite-de-rangement-pour-medicaments', 'Boîte de rangement pour médicaments', 'Unité', 'Boîte compartimentée pour ranger et organiser les médicaments de la semaine.', 2, 1, 12.9, 20, 42],
];

export const products = rows.map(
  ([folder, name, format, description, categoryId, laboratoryId, priceHt, vatRate, stock], index) => ({
    id: index + 1,
    name,
    format,
    description,
    categoryId,
    laboratoryId,
    priceHt,
    vatRate,
    stock,
    validationStatus: 'Accepté',
    active: true,
    image: `/produits/${folder}/principal.webp`,
    views360: `/produits/${folder}/360/`,
  }),
);
