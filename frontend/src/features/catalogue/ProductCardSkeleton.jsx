import './ProductCardSkeleton.css';

// Carte « fantôme » affichée pendant le chargement : la page garde sa forme et ne saute pas à l'arrivée des produits.
export default function ProductCardSkeleton() {
  return (
    <div className="product-skeleton" aria-hidden="true">
      <span className="product-skeleton__image" />
      <span className="product-skeleton__line product-skeleton__line--short" />
      <span className="product-skeleton__line" />
      <span className="product-skeleton__line product-skeleton__line--medium" />
      <span className="product-skeleton__button" />
    </div>
  );
}
