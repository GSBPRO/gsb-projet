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

// Fond d'ambiance derrière le produit. Décoratif : alt vide, la photo du produit (avec alt) est posée dessus.
function Backdrop({ src, blur = false }) {
  return <img className={`product-page__backdrop${blur ? ' product-page__backdrop--blur' : ''}`} src={src} alt="" />;
}

// Page détail d'un produit : miniatures à gauche, grande image au centre, infos et achat à droite (F09).
export default function ProductPage() {
  const { productId } = useParams();
  const { status, data, reload } = useCatalogue();
  // null = la première miniature (l'ambiance si le produit en a une, comme la 1re image chez POUCH).
  const [selected, setSelected] = useState(null);
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

  // Miniatures : la photo principale ; pour les produits qui ont un rendu 3D, la vue à 360° et trois angles fixes.
  // Un produit proposé par un fournisseur n'a qu'une photo.
  const frame = (index) => `${product.views360}vue_${String(index).padStart(3, '0')}.webp`;
  // Ambiance en premier, comme la 1re image chez POUCH : le produit posé sur un fond coloré qui remplit le cadre.
  // Le fond = la photo d'ambiance ; à défaut (même règle que la carte), la photo du produit floutée.
  const isBlurred = !product.ambiance && product.blurredAmbiance;
  const ambianceThumb =
    product.ambiance || isBlurred
      ? { key: 'ambiance', src: product.image, label: 'Photo d’ambiance', backdrop: product.ambiance ?? product.image, blur: isBlurred }
      : null;
  // Visuels en plus (avis, comparatif…) : avant la photo du produit, sauf ceux marqués afterMain.
  const extraThumbs = (product.extraImages ?? []).map((extra, index) => ({
    key: `extra-${index}`,
    src: extra.src,
    thumbSrc: extra.thumbSrc,
    label: extra.label,
    afterMain: extra.afterMain,
    replacesMain: extra.replacesMain,
    fill: true,
  }));
  // Un visuel marqué replacesMain prend la place de la photo du produit.
  const mainThumb = extraThumbs.find((thumb) => thumb.replacesMain) ?? {
    key: 'main',
    src: product.image,
    thumbSrc: product.imageThumb,
    label: 'Photo principale',
  };
  const thumbs = [
    ...(ambianceThumb ? [ambianceThumb] : []),
    ...extraThumbs.filter((thumb) => !thumb.afterMain && !thumb.replacesMain),
    mainThumb,
    ...extraThumbs.filter((thumb) => thumb.afterMain),
    ...(product.views360
      ? [
          { key: 'rotate', src: frame(0), label: 'Vue à 360°', badge: '360°' },
          { key: 'a', src: frame(9), label: 'Vue de trois quarts' },
          { key: 'b', src: frame(18), label: 'Vue de dos' },
          { key: 'c', src: frame(27), label: 'Vue de côté' },
        ]
      : []),
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
                className={`product-page__thumb${thumb.key === current.key ? ' is-active' : ''}${thumb.backdrop ? ' product-page__thumb--ambiance' : ''}${thumb.fill ? ' product-page__thumb--fill' : ''}`}
                onClick={() => setSelected(thumb.key)}
                aria-label={thumb.label}
                aria-pressed={thumb.key === current.key}
              >
                {thumb.backdrop && <Backdrop src={thumb.backdrop} blur={thumb.blur} />}
                <img src={thumb.thumbSrc ?? thumb.src} alt="" loading="lazy" decoding="async" />
                {thumb.badge && <span className="product-page__thumb-badge">{thumb.badge}</span>}
              </button>
            </li>
          ))}
        </ul>

        {current.key === 'rotate' ? (
          <Rotation360 product={product} />
        ) : (
          <div
            className={`product-page__stage${current.backdrop ? ' product-page__stage--ambiance' : ''}${current.fill ? ' product-page__stage--fill' : ''}`}
          >
            {current.backdrop && <Backdrop src={current.backdrop} blur={current.blur} />}
            {/* Un visuel en plus (ex. avis client) a son propre alt ; les photos du produit portent son nom. */}
            <img src={current.src} alt={current.fill ? current.label : product.name} />
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

          <p className="product-page__note">Visuels illustratifs (reconstitution pédagogique non officielle).</p>
        </section>
      </div>
    </div>
  );
}
