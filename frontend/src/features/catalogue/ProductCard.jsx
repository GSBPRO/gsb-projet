import { useState } from 'react';
import { formatPrice, priceWithTax } from '../../utils/price.js';
import ProductDialog from './ProductDialog.jsx';
import ProductImage from './ProductImage.jsx';
import './ProductCard.css';

// Carte d'un produit, style « vitrine » : grande image sur fond blanc, pastille de catégorie,
// nom et format, puis une légende (laboratoire, prix). Toute la carte ouvre la fiche à 360°.
// index : position dans la grille, pour faire apparaître les cartes les unes après les autres.
export default function ProductCard({ product, laboratory, categoryName, index }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card" style={{ '--card-index': Math.min(index, 12) }}>
      {/* Un vrai bouton : atteignable au clavier, il porte le nom du produit pour les lecteurs d'écran. */}
      <button
        type="button"
        className="product-card__button"
        onClick={() => setIsDialogOpen(true)}
        aria-label={`${product.name} : voir la fiche`}
      >
        <span className="product-card__tag">{categoryName}</span>
        {isOutOfStock && <span className="product-card__soldout">Rupture</span>}

        <span className="product-card__visual">
          <ProductImage product={product} laboratoryColor={laboratory?.color} />
        </span>

        <span className="product-card__row">
          <span className="product-card__name">{product.name}</span>
          <span className="product-card__format">{product.format}</span>
        </span>
        <span className="product-card__caption">
          {laboratory?.name} · {formatPrice(priceWithTax(product.priceHt, product.vatRate))} TTC
        </span>
      </button>

      {isDialogOpen && (
        <ProductDialog product={product} laboratory={laboratory} onClose={() => setIsDialogOpen(false)} />
      )}
    </article>
  );
}
