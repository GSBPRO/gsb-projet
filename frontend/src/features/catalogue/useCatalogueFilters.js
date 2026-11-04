import { useCallback, useMemo, useState } from 'react';

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom (A à Z)' },
];

const INITIAL_FILTERS = { search: '', categoryId: null, laboratoryId: null, inStockOnly: false, sort: 'relevance' };

// « Éphélide » et « ephelide » doivent se trouver : on retire les accents et les majuscules.
function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

// Recherche, filtres et tri du catalogue. Ne change jamais les données : calcule la liste à afficher.
export default function useCatalogueFilters(products, laboratories) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Change un seul critère sans toucher aux autres.
  // useCallback : la fonction garde la même identité, on peut donc l'utiliser dans un useEffect.
  const setFilter = useCallback((name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // useMemo : la liste n'est recalculée que si les produits ou les filtres changent.
  const visibleProducts = useMemo(() => {
    const labNames = new Map(laboratories.map((lab) => [lab.id, lab.name]));
    const words = normalize(filters.search).split(/\s+/).filter(Boolean);

    const filtered = products.filter((product) => {
      if (filters.categoryId !== null && product.categoryId !== filters.categoryId) return false;
      if (filters.laboratoryId !== null && product.laboratoryId !== filters.laboratoryId) return false;
      if (filters.inStockOnly && product.stock === 0) return false;
      // Recherche par nom ou partie du nom, et par laboratoire (F10) : tous les mots doivent être trouvés.
      const searchable = normalize(`${product.name} ${labNames.get(product.laboratoryId) ?? ''}`);
      return words.every((word) => searchable.includes(word));
    });

    // [...filtered] : on trie une copie, sort() modifierait sinon la liste d'origine.
    const sorted = [...filtered];
    if (filters.sort === 'price-asc') sorted.sort((a, b) => a.priceHt - b.priceHt);
    if (filters.sort === 'price-desc') sorted.sort((a, b) => b.priceHt - a.priceHt);
    if (filters.sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return sorted;
  }, [products, laboratories, filters]);

  const hasActiveFilters =
    filters.search !== '' || filters.categoryId !== null || filters.laboratoryId !== null || filters.inStockOnly;

  return { filters, setFilter, resetFilters, hasActiveFilters, visibleProducts };
}
