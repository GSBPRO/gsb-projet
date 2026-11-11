import { DELIVERY_STEPS } from './orderService.js';
import './DeliveryTracking.css';

// Suivi de livraison fictif (F36, F37) : En préparation, Expédiée, Livrée.
// Le texte écrit porte l'information ; la couleur et le trait ne font que l'appuyer.
export default function DeliveryTracking({ order }) {
  if (order.status === 'En attente') {
    return <p className="muted">La livraison commencera dès que votre commande sera validée.</p>;
  }
  if (order.status === 'Annulée') {
    return <p className="muted">Commande annulée : aucune livraison.</p>;
  }

  const currentIndex = Math.max(0, DELIVERY_STEPS.indexOf(order.deliveryStep));

  return (
    <ol className="delivery-tracking" aria-label="Suivi de livraison">
      {DELIVERY_STEPS.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo';
        return (
          <li
            key={step}
            className={`delivery-tracking__step delivery-tracking__step--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {step}
          </li>
        );
      })}
    </ol>
  );
}
