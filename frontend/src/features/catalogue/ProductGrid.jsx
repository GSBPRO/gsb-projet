import Button from '../../components/ui/Button.jsx';
import ProductCard from './ProductCard.jsx';
import ProductCardSkeleton from './ProductCardSkeleton.jsx';
import './ProductGrid.css';

const SKELETON_COUNT = 6;

// Grille des produits, avec les trois états demandés : chargement, erreur et aucun résultat.
export default function ProductGrid({ status, products, laboratoriesById, categoriesById, onRetry, onResetFilters }) {
  if (status === 'loading') {
    return (
      <div className="product-grid" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      // role="alert" : le message est lu tout de suite par les lecteurs d'écran.
      <div className="product-grid__message" role="alert">
        <p className="product-grid__message-title">Le catalogue n’a pas pu être chargé.</p>
        <p>Vérifiez votre connexion internet, puis réessayez.</p>
        <Button onClick={onRetry}>Réessayer</Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__message">
        <p className="product-grid__message-title">Aucun produit ne correspond à votre recherche.</p>
        <p>Essayez un autre mot ou retirez un filtre.</p>
        <Button variant="secondary" onClick={onResetFilters}>
          Effacer les filtres
        </Button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          laboratory={laboratoriesById.get(product.laboratoryId)}
          categoryName={categoriesById.get(product.categoryId)?.name}
          index={index}
        />
      ))}
    </div>
  );
}
