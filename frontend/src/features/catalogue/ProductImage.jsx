import './ProductImage.css';

// Image d'un produit. Tant qu'il n'y a pas de vraie photo, on affiche une image provisoire :
// une gélule aux couleurs du laboratoire et les initiales du produit.
export default function ProductImage({ product, laboratoryColor }) {
  if (product.image) {
    // loading="lazy" : l'image n'est téléchargée que lorsqu'elle approche de l'écran.
    return <img className="product-image" src={product.image} alt={product.name} loading="lazy" decoding="async" />;
  }

  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    // Image provisoire décorative : le nom du produit est déjà écrit sur la carte.
    <div className="product-image product-image--placeholder" style={{ '--lab-color': laboratoryColor }} aria-hidden="true">
      <span className="product-image__capsule" />
      <span className="product-image__initials">{initials}</span>
    </div>
  );
}
