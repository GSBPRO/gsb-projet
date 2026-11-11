import { Link } from 'react-router-dom';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import { formatPrice } from '../../utils/price.js';
import { formatDateTime } from '../../utils/date.js';
import OrderStatusBadge from './OrderStatusBadge.jsx';
import useOrders from './useOrders.js';

// Historique : la liste de ses propres commandes, la plus récente en premier (F20).
export default function OrdersPage() {
  const { status, data: orders, reload } = useOrders();

  return (
    <div>
      <PageHeader title="Mes commandes" subtitle="L’historique de vos commandes et leur avancement.">
        <ButtonLink to="/catalogue" variant="secondary">
          Retour au catalogue
        </ButtonLink>
      </PageHeader>

      <PageState
        status={status}
        isEmpty={status === 'success' && orders.length === 0}
        emptyText="Vous n’avez pas encore passé de commande."
        onRetry={reload}
      >
        {orders && (
          <DataTable caption="Mes commandes">
            <thead>
              <tr>
                <th scope="col">Référence</th>
                <th scope="col">Date</th>
                <th scope="col">Statut</th>
                <th scope="col" className="is-number">
                  Total TTC
                </th>
                <th scope="col">
                  <span className="visually-hidden">Détail</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.reference}</strong>
                  </td>
                  <td>{formatDateTime(order.date)}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="is-number">{formatPrice(order.totals.ttc)}</td>
                  <td>
                    <Link to={`/commandes/${order.id}`}>
                      Voir<span className="visually-hidden"> la commande {order.reference}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </PageState>
    </div>
  );
}
