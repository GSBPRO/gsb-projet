import { useRef } from 'react';
import Button from '../../components/ui/Button.jsx';
import { formatPrice, formatVatRate, priceWithTax } from '../../utils/price.js';
import ProductImage from './ProductImage.jsx';
import StockBadge from './StockBadge.jsx';
import useTilt from './useTilt.js';
import './ProductCard.css';

// Carte d'un produit du catalogue : image, laboratoire, nom, prix HT et TTC, stock et bouton.
// index : position dans la grille, pour faire apparaître les cartes les unes après les autres.
export default function ProductCard({ product, laboratory, index }) {
  const cardRef = useRef(null);
  useTilt(cardRef);
  const isOutOfStock = product.stock === 0;

  return (
    <article ref={cardRef} className="product-card" style={{ '--card-index': Math.min(index, 12) }}>
      <ProductImage product={product} laboratoryColor={laboratory?.color} />

      <div className="product-card__body">
        <p className="product-card__lab">{laboratory?.name}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__format">{product.format}</p>

        <div className="product-card__prices">
          <p className="product-card__price-ht">
            {formatPrice(product.priceHt)} <span>HT</span>
          </p>
          <p className="product-card__price-ttc">
            {formatPrice(priceWithTax(product.priceHt, product.vatRate))} TTC · TVA {formatVatRate(product.vatRate)}
          </p>
        </div>

        <StockBadge stock={product.stock} />

        {/* L'ajout au panier sera branché à l'étape « panier » (features/cart). */}
        <Button variant="secondary" fullWidth disabled={isOutOfStock}>
          {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
        </Button>
      </div>
    </article>
  );
}
