// Construit les cartes du menu du catalogue à partir des données : une par catégorie, plus « En stock ».
// Chaque carte mène au catalogue déjà filtré, grâce à l'adresse (?categorie=2, ?stock=1).
export function buildCatalogueMenuCards({ products, categories }) {
  // On retient les produits déjà montrés pour que deux cartes n'affichent pas la même photo.
  const usedIds = new Set();

  // La vignette d'une carte = la photo du premier produit concerné (la miniature si elle existe, plus légère).
  function pickImage(candidates) {
    const product = candidates.find((candidate) => candidate.image && !usedIds.has(candidate.id));
    if (!product) return null;
    usedIds.add(product.id);
    return { src: product.imageThumb ?? product.image, alt: product.name };
  }

  const categoryCards = categories.map((category) => {
    const inCategory = products.filter((product) => product.categoryId === category.id);
    return {
      key: `categorie-${category.id}`,
      to: `/catalogue?categorie=${category.id}`,
      title: category.name,
      tagline: category.tagline,
      color: category.color,
      count: inCategory.length,
      image: pickImage(inCategory),
    };
  });

  const inStock = products.filter((product) => product.stock > 0);
  const inStockCard = {
    key: 'en-stock',
    to: '/catalogue?stock=1',
    title: 'En stock',
    tagline: 'Disponibles immédiatement',
    color: '#b9dceb',
    count: inStock.length,
    image: pickImage(inStock),
  };

  return [...categoryCards, inStockCard];
}
