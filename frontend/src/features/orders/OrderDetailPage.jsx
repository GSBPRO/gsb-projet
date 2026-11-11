import { Link, useParams } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import { formatPrice, formatVatRate, lineAmounts } from '../../utils/price.js';
import { formatDateTime } from '../../utils/date.js';
import DeliveryTracking from './DeliveryTracking.jsx';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import { useOrder } from './useOrders.js';
import './OrderDetailPage.css';

// Détail d'une commande : lignes, totaux, adresse, statut et suivi de livraison.
// Une commande d'un autre compte donne « introuvable », comme un numéro qui n'existe pas (F20).
export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { status, data: order, reload } = useOrder(orderId);

  return (
    <div className="order-detail">
      <PageState status={status} isEmpty={status === 'success' && !order} emptyText="Commande introuvable." onRetry={reload}>
        {order && (
          <>
            <PageHeader title={`Commande ${order.reference}`} subtitle={`Passée le ${formatDateTime(order.date)}`}>
              <OrderStatusBadge status={order.status} />
            </PageHeader>

            <section className="order-detail__card" aria-labelledby="tracking-title">
              <h2 id="tracking-title">Suivi</h2>
              <DeliveryTracking order={order} />
            </section>

            <DataTable caption="Articles de la commande">
              <thead>
                <tr>
                  <th scope="col">Produit</th>
                  <th scope="col" className="is-number">
                    Prix HT
                  </th>
                  <th scope="col" className="is-number">
                    TVA
                  </th>
                  <th scope="col" className="is-number">
                    Qté
                  </th>
                  <th scope="col" className="is-number">
                    Total TTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.productId}>
                    <td>
                      <strong>{line.name}</strong>
                      <br />
                      <span className="muted">{line.format}</span>
                    </td>
                    <td className="is-number">{formatPrice(line.priceHt)}</td>
                    <td className="is-number">{formatVatRate(line.vatRate)}</td>
                    <td className="is-number">{line.quantity}</td>
                    <td className="is-number">{formatPrice(lineAmounts(line.priceHt, line.vatRate, line.quantity).ttc)}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>

            <div className="order-detail__bottom">
              <section className="order-detail__card" aria-labelledby="address-title">
                <h2 id="address-title">Adresse de livraison</h2>
                {/* white-space: pre-line (CSS) garde les retours à la ligne ; le texte reste du texte, jamais du HTML. */}
                <p className="order-detail__address">{order.deliveryAddress}</p>
              </section>
              <section className="order-detail__card" aria-labelledby="totals-title">
                <h2 id="totals-title">Totaux</h2>
                <dl>
                  <div>
                    <dt>Total HT</dt>
                    <dd>{formatPrice(order.totals.ht)}</dd>
                  </div>
                  {order.totals.vatByRate.map((vat) => (
                    <div key={vat.rate}>
                      <dt>TVA {formatVatRate(vat.rate)}</dt>
                      <dd>{formatPrice(vat.amount)}</dd>
                    </div>
                  ))}
                  <div className="order-detail__grand-total">
                    <dt>Total TTC</dt>
                    <dd>{formatPrice(order.totals.ttc)}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </>
        )}
      </PageState>
      <p>
        <Link to="/commandes">← Retour à mes commandes</Link>
      </p>
    </div>
  );
}
