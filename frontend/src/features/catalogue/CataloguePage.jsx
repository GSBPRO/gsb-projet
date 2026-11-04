import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CatalogueBanner from './CatalogueBanner.jsx';
import CatalogueFilters from './CatalogueFilters.jsx';
import CatalogueToolbar from './CatalogueToolbar.jsx';
import CategoryChips from './CategoryChips.jsx';
import ProductGrid from './ProductGrid.jsx';
import useCatalogue from './useCatalogue.js';
import useCatalogueFilters from './useCatalogueFilters.js';
import './CataloguePage.css';

// Tableaux vides créés une seule fois : sinon un nouveau tableau à chaque rendu
// relancerait inutilement le calcul des filtres (useMemo compare les références).
const NO_ITEMS = [];

// Page catalogue : charge les données, applique recherche / filtres / tri, et assemble les morceaux.
export default function CataloguePage() {
  const { status, data, reload } = useCatalogue();
  const products = data?.products ?? NO_ITEMS;
  const categories = data?.categories ?? NO_ITEMS;
  const laboratories = data?.laboratories ?? NO_ITEMS;

  const { filters, setFilter, resetFilters, hasActiveFilters, visibleProducts } = useCatalogueFilters(
    products,
    laboratories,
  );

  // Filtres reçus dans l'adresse, depuis le menu du catalogue : /catalogue?categorie=2 ou ?stock=1.
  // On ne fait pas confiance à l'adresse : une valeur invalide est simplement ignorée.
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const categoryId = Number(searchParams.get('categorie'));
    setFilter('categoryId', Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null);
    setFilter('inStockOnly', searchParams.get('stock') === '1');
  }, [searchParams, setFilter]);

  // Accès rapide à un laboratoire par son numéro (pour afficher son nom sur chaque carte).
  const laboratoriesById = useMemo(() => new Map(laboratories.map((lab) => [lab.id, lab])), [laboratories]);

  const categoriesById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);

  return (
    <div className="catalogue-page">
      <CatalogueBanner videoSrc="/videos/catalogue.mp4" />

      <div className="catalogue-page__layout">
        <CatalogueFilters
          laboratories={laboratories}
          filters={filters}
          onChange={setFilter}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="catalogue-page__main">
          <CatalogueToolbar
            resultCount={visibleProducts.length}
            isLoading={status === 'loading'}
            search={filters.search}
            sort={filters.sort}
            onChange={setFilter}
          />
          <CategoryChips
            categories={categories}
            selectedId={filters.categoryId}
            onSelect={(id) => setFilter('categoryId', id)}
          />
          <ProductGrid
            status={status}
            products={visibleProducts}
            laboratoriesById={laboratoriesById}
            categoriesById={categoriesById}
            onRetry={reload}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
}
