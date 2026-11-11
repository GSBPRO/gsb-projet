import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import QuantityStepper from '../../components/ui/QuantityStepper.jsx';
import { formatPrice, formatVatRate, priceWithTax } from '../../utils/price.js';
import useCart from '../cart/useCart.js';
import StockBadge from './StockBadge.jsx';
import useCatalogue from './useCatalogue.js';
import useRotation360 from './useRotation360.js';
import './ProductPage.css';

const MAX_QUANTITY = 99;

// Vue à 360° : glisser (souris ou doigt) ou flèches du clavier. Montée seulement quand on la choisit,
// pour ne télécharger les 36 vues qu'à la demande.
function Rotation360({ product }) {
  const { src, rotateBy, handlers } = useRotation360(product.views360);
  return (
    <div
      className="product-page__stage product-page__stage--360"
      tabIndex={0}
      role="group"
      aria-label={`Vue à 360° de ${product.name} : glissez ou utilisez les flèches gauche et droite`}
      {...handlers}
    >
      <img src={src} alt={product.name} draggable="false" />
      <div className="product-page__rotate-hint">
        <button type="button" onClick={() => rotateBy(-1)} aria-label="Tourner vers la gauche">
          ←
        </button>
        <span>Glissez pour tourner</span>
        <button type="button" onClick={() => rotateBy(1)} aria-label="Tourner vers la droite">
          →
        </button>
      </div>
    </div>
  );
}

// Page détail d'un produit : miniatures à gauche, grande image au centre, infos et achat à droite (F09).
export default function ProductPage() {
  const { productId } = useParams();
  const { status, data, reload } = useCatalogue();
  const [selected, setSelected] = useState('main');
  const [quantity, setQuantity] = useState(1);
  const [confirmation, setConfirmation] = useState('');
  const { items, addItem } = useCart();

  if (status === 'loading') {
    return (
      <div className="product-page" aria-busy="true">
        <p className="product-page__message">Chargement du produit…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="product-page">
        <div className="product-page__message" role="alert">
          <p>Le produit n’a pas pu être chargé.</p>
          <Button onClick={reload}>Réessayer</Button>
        </div>
      </div>
    );
  }

  const product = data.products.find((candidate) => String(candidate.id) === productId);
  if (!product) {
    return (
      <div className="product-page">
        <div className="product-page__message">
          <p>Ce produit n’existe pas ou n’est plus proposé.</p>
          <Link to="/catalogue">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const category = data.categories.find((item) => item.id === product.categoryId);
  const laboratory = data.laboratories.find((item) => item.id === product.laboratoryId);
  const unitTtc = priceWithTax(product.priceHt, product.vatRate);
  const isOutOfStock = product.stock === 0;
  // On ne peut pas ajouter plus que le stock, en comptant ce qui est déjà dans le panier.
  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const remaining = Math.max(0, Math.min(MAX_QUANTITY, product.stock) - inCart);
  const maxQuantity = remaining;
  const cannotAdd = isOutOfStock || remaining === 0;

  // Miniatures : la photo principale, la vue à 360°, puis trois angles fixes.
  const frame = (index) => `${product.views360}vue_${String(index).padStart(3, '0')}.webp`;
  const thumbs = [
    { key: 'main', src: product.image, label: 'Photo principale' },
    { key: 'rotate', src: frame(0), label: 'Vue à 360°', badge: '360°' },
    { key: 'a', src: frame(9), label: 'Vue de trois quarts' },
    { key: 'b', src: frame(18), label: 'Vue de dos' },
    { key: 'c', src: frame(27), label: 'Vue de côté' },
  ];
  const current = thumbs.find((thumb) => thumb.key === selected) ?? thumbs[0];

  function changeQuantity(value) {
    setConfirmation('');
    setQuantity(Math.min(Math.max(1, value), Math.max(1, maxQuantity)));
  }

  function handleAddToCart() {
    const added = Math.min(quantity, remaining);
    addItem(product.id, added);
    setQuantity(1);
    setConfirmation(`${added} × ${product.name} ajouté${added > 1 ? 's' : ''} au panier.`);
  }

  return (
    <div className="product-page">
      <nav className="product-page__crumbs" aria-label="Fil d’Ariane">
        <Link to="/catalogue">01 / Catalogue</Link>
        {category && <Link to={`/catalogue?categorie=${category.id}`}>{category.name}</Link>}
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-page__layout">
        <ul className="product-page__thumbs" aria-label="Images du produit">
          {thumbs.map((thumb) => (
            <li key={thumb.key}>
              <button
                type="button"
                className={`product-page__thumb${thumb.key === current.key ? ' is-active' : ''}`}
                onClick={() => setSelected(thumb.key)}
                aria-label={thumb.label}
                aria-pressed={thumb.key === current.key}
              >
                <img src={thumb.src} alt="" loading="lazy" decoding="async" />
                {thumb.badge && <span className="product-page__thumb-badge">{thumb.badge}</span>}
              </button>
            </li>
          ))}
        </ul>

        {current.key === 'rotate' ? (
          <Rotation360 product={product} />
        ) : (
          <div className="product-page__stage">
            <img src={current.src} alt={product.name} />
          </div>
        )}

        <section className="product-page__info" aria-labelledby="product-title">
          <div className="product-page__meta">
            <span className="product-page__tag">{category?.name}</span>
            <span className="product-page__format">{product.format}</span>
          </div>

          <h1 id="product-title" className="product-page__title">
            {product.name}
          </h1>
          <p className="product-page__lab">{laboratory?.name}</p>
          <p className="product-page__description">{product.description}</p>

          <div className="product-page__buy">
            <div className="product-page__price-row">
              <span className="product-page__price-label">Prix unitaire</span>
              <span className="product-page__price">{formatPrice(unitTtc)} TTC</span>
            </div>
            <p className="product-page__price-detail">
              {formatPrice(product.priceHt)} HT · TVA {formatVatRate(product.vatRate)}
            </p>
            <StockBadge stock={product.stock} />

            <div className="product-page__actions">
              <QuantityStepper
                value={cannotAdd ? 0 : Math.min(quantity, remaining)}
                max={maxQuantity}
                onChange={changeQuantity}
                disabled={cannotAdd}
              />
              <Button onClick={handleAddToCart} disabled={cannotAdd}>
                {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
              </Button>
            </div>
            {!cannotAdd && <p className="product-page__total">Total : {formatPrice(unitTtc * Math.min(quantity, remaining))} TTC</p>}
            {!isOutOfStock && remaining === 0 && (
              <p className="product-page__total">Tout le stock disponible est déjà dans votre panier.</p>
            )}
            {/* role="status" : le message est lu par les lecteurs d'écran sans déplacer le focus. */}
            <p className="product-page__confirmation" role="status">
              {confirmation}
              {confirmation && <Link to="/panier"> Voir le panier</Link>}
            </p>
          </div>

          <p className="product-page__note">Rendu 3D illustratif (reconstitution pédagogique non officielle).</p>
        </section>
      </div>
    </div>
  );
}
