import { useCallback, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import useLoader from '../../utils/useLoader.js';
import { formatDateTime } from '../../utils/date.js';
import { formatPrice } from '../../utils/price.js';
import OrderStatusBadge from '../orders/OrderStatusBadge.jsx';
import { DELIVERY_STEPS, listAllOrders, updateOrder } from '../orders/orderService.js';
import { ORDER_STATUSES } from '../orders/orderStatus.js';
import { listUsers } from './adminUserService.js';
import './AdminPages.css';

// Toutes les commandes de tous les comptes, avec filtre (F24) et mise à jour du statut et de la livraison (F25, F36).
export default function AdminOrdersPage() {
  const load = useCallback(async () => {
    const [orders, directory] = await Promise.all([listAllOrders(), listUsers()]);
    return { orders, users: directory.users };
  }, []);
  const { status, data, reload } = useLoader(load);
  const [filters, setFilters] = useState({ text: '', status: '' });

  function handleFilter(event) {
    setFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  const customerName = (userId) => {
    const user = data.users.find((candidate) => candidate.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : `Compte n° ${userId}`;
  };

  const visible = data?.orders.filter((order) => {
    const text = filters.text.trim().toLowerCase();
    const matchesText = !text || order.reference.toLowerCase().includes(text) || customerName(order.userId).toLowerCase().includes(text);
    return matchesText && (!filters.status || order.status === filters.status);
  });

  return (
    <div>
      <PageHeader title="Commandes" subtitle="Toutes les commandes des professionnels de santé." />

      <div className="admin-filters">
        <Input label="Rechercher (référence ou client)" name="text" value={filters.text} onChange={handleFilter} />
        <div className="field">
          <label htmlFor="orders-status-filter" className="field__label">
            Statut
          </label>
          <select id="orders-status-filter" name="status" className="field__input" value={filters.status} onChange={handleFilter}>
            <option value="">Tous</option>
            {Object.keys(ORDER_STATUSES).map((orderStatus) => (
              <option key={orderStatus} value={orderStatus}>
                {orderStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      <PageState status={status} isEmpty={status === 'success' && visible.length === 0} emptyText="Aucune commande ne correspond." onRetry={reload}>
        {data && (
          <DataTable caption="Commandes de tous les comptes">
            <thead>
              <tr>
                <th scope="col">Référence</th>
                <th scope="col">Client</th>
                <th scope="col">Date</th>
                <th scope="col" className="is-number">
                  Total TTC
                </th>
                <th scope="col">Statut et livraison</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <OrderRow key={`${order.userId}-${order.id}`} order={order} customer={customerName(order.userId)} onSaved={reload} />
              ))}
            </tbody>
          </DataTable>
        )}
      </PageState>
    </div>
  );
}

// Une ligne : le statut et l'étape de livraison se modifient sur place, puis « Enregistrer ».
function OrderRow({ order, customer, onSaved }) {
  const [form, setForm] = useState({ status: order.status, deliveryStep: order.deliveryStep ?? DELIVERY_STEPS[0] });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isLocked = order.status === 'Annulée';

  async function handleSave() {
    setIsSaving(true);
    setMessage('');
    try {
      await updateOrder(order.userId, order.id, form);
      await onSaved();
    } catch (error) {
      setMessage(error.message);
      setIsSaving(false);
    }
  }

  return (
    <tr>
      <td>
        <strong>{order.reference}</strong>
        <details className="admin-lines">
          <summary>{order.lines.length} ligne(s)</summary>
          <ul>
            {order.lines.map((line) => (
              <li key={line.productId}>
                {line.quantity} × {line.name}
              </li>
            ))}
          </ul>
          <p>{order.deliveryAddress}</p>
        </details>
      </td>
      <td>{customer}</td>
      <td>{formatDateTime(order.date)}</td>
      <td className="is-number">{formatPrice(order.totals.ttc)}</td>
      <td>
        <div className="admin-inline">
          <OrderStatusBadge status={order.status} />
          <select
            aria-label={`Statut de la commande ${order.reference}`}
            value={form.status}
            disabled={isLocked}
            onChange={(event) => setForm({ ...form, status: event.target.value })}
          >
            {Object.keys(ORDER_STATUSES).map((orderStatus) => (
              <option key={orderStatus}>{orderStatus}</option>
            ))}
          </select>
          {form.status === 'Validée' && (
            <select
              aria-label={`Livraison de la commande ${order.reference}`}
              value={form.deliveryStep}
              onChange={(event) => setForm({ ...form, deliveryStep: event.target.value })}
            >
              {DELIVERY_STEPS.map((step) => (
                <option key={step}>{step}</option>
              ))}
            </select>
          )}
          <Button variant="secondary" className="btn--small" disabled={isSaving || isLocked} onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
        {message && (
          <p className="admin-error" role="alert">
            {message}
          </p>
        )}
      </td>
    </tr>
  );
}
