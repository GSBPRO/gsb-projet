import './StockBadge.css';

// En dessous de ce seuil, on prévient que le stock est faible.
const LOW_STOCK = 10;

// Indique la disponibilité d'un produit. Le texte porte l'information (pas seulement la couleur).
export default function StockBadge({ stock }) {
  if (stock === 0) {
    return <span className="stock-badge stock-badge--out">Rupture de stock</span>;
  }
  if (stock <= LOW_STOCK) {
    return <span className="stock-badge stock-badge--low">Plus que {stock} en stock</span>;
  }
  return <span className="stock-badge stock-badge--in">En stock</span>;
}
