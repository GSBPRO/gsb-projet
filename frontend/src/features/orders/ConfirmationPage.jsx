import { useParams } from 'react-router-dom';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import PageState from '../../components/ui/PageState.jsx';
import { formatPrice } from '../../utils/price.js';
import { formatDateTime } from '../../utils/date.js';
import { useOrder } from './useOrders.js';
import './ConfirmationPage.css';

// Page affichée juste après le paiement : la référence de la commande est la même que dans l'historique (F18).
export default function ConfirmationPage() {
  const { orderId } = useParams();
  const { status, data: order, reload } = useOrder(orderId);

  return (
    <div className="confirmation-page">
      <PageState status={status} isEmpty={status === 'success' && !order} emptyText="Commande introuvable." onRetry={reload}>
        {order && (
          <section className="confirmation-page__card" aria-labelledby="confirmation-title">
            <p className="eyebrow">Merci pour votre commande</p>
            <h1 id="confirmation-title">Commande confirmée</h1>
            <dl>
              <div>
                <dt>Référence</dt>
                <dd className="confirmation-page__reference">{order.reference}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{formatDateTime(order.date)}</dd>
              </div>
              <div>
                <dt>Total TTC</dt>
                <dd>{formatPrice(order.totals.ttc)}</dd>
              </div>
            </dl>
            <p className="muted">Elle sera traitée par notre équipe : suivez son avancement dans « Mes commandes ».</p>
            <div className="confirmation-page__actions">
              <ButtonLink to={`/commandes/${order.id}`}>Voir ma commande</ButtonLink>
              <ButtonLink to="/catalogue" variant="secondary">
                Continuer mes achats
              </ButtonLink>
            </div>
          </section>
        )}
      </PageState>
    </div>
  );
}
