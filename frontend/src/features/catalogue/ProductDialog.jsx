import { useEffect, useRef } from 'react';
import Button from '../../components/ui/Button.jsx';
import { formatPrice, formatVatRate, priceWithTax } from '../../utils/price.js';
import StockBadge from './StockBadge.jsx';
import useRotation360 from './useRotation360.js';
import './ProductDialog.css';

// Fiche d'un produit : sa vue à 360° (glisser ou flèches), sa description et ses prix.
// <dialog> natif : le focus reste dans la fenêtre et Échap la ferme, sans code en plus.
export default function ProductDialog({ product, laboratory, onClose }) {
  const dialogRef = useRef(null);
  const { src, rotateBy, handlers } = useRotation360(product.views360);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className="product-dialog" onClose={onClose} aria-label={product.name}>
      <div className="product-dialog__viewer">
        <div
          className="product-dialog__stage"
          tabIndex={0}
          role="group"
          aria-label={`Vue à 360° de ${product.name} : glissez ou utilisez les flèches gauche et droite`}
          {...handlers}
        >
          <img src={src} alt={product.name} draggable="false" />
        </div>
        <div className="product-dialog__controls">
          <Button variant="secondary" onClick={() => rotateBy(-1)} aria-label="Tourner vers la gauche">
            ←
          </Button>
          <span>Glissez pour tourner à 360°</span>
          <Button variant="secondary" onClick={() => rotateBy(1)} aria-label="Tourner vers la droite">
            →
          </Button>
        </div>
      </div>

      <div className="product-dialog__info">
        <p className="product-dialog__lab">{laboratory?.name}</p>
        <h2>{product.name}</h2>
        <p className="product-dialog__format">{product.format}</p>
        <p className="product-dialog__description">{product.description}</p>

        <p className="product-dialog__price">
          {formatPrice(product.priceHt)} <span>HT</span>
        </p>
        <p className="product-dialog__ttc">
          {formatPrice(priceWithTax(product.priceHt, product.vatRate))} TTC · TVA {formatVatRate(product.vatRate)}
        </p>
        <StockBadge stock={product.stock} />

        <p className="product-dialog__note">
          Rendu 3D illustratif (reconstitution pédagogique non officielle).
        </p>
        <Button onClick={() => dialogRef.current?.close()}>Fermer</Button>
      </div>
    </dialog>
  );
}
