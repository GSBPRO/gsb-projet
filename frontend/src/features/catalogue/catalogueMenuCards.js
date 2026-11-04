// Construit les cartes du menu du catalogue à partir des données : une par catégorie, plus « En stock ».
// Chaque carte mène au catalogue déjà filtré, grâce à l'adresse (?categorie=2, ?stock=1).
export function buildCatalogueMenuCards({ products, categories }) {
  const categoryCards = categories.map((category) => ({
    key: `categorie-${category.id}`,
    to: `/catalogue?categorie=${category.id}`,
    title: category.name,
    tagline: category.tagline,
    color: category.color,
    count: products.filter((product) => product.categoryId === category.id).length,
  }));

  const inStockCard = {
    key: 'en-stock',
    to: '/catalogue?stock=1',
    title: 'En stock',
    tagline: 'Disponibles immédiatement',
    color: '#b9dceb',
    count: products.filter((product) => product.stock > 0).length,
  };

  return [...categoryCards, inStockCard];
}
