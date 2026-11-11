import { useCallback, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Input from '../../components/ui/Input.jsx';
import useLoader from '../../utils/useLoader.js';
import { formatDateTime } from '../../utils/date.js';
import useAuth from '../auth/useAuth.js';
import { adjustStock, listStockMovements, REASON_MAX } from './adminCatalogueService.js';
import './AdminPages.css';

// Ajustement du stock avec motif obligatoire (F26) et historique des mouvements (F27).
// product : le produit à jour ; onChanged : recharge la page après un ajustement.
export default function StockPanel({ product, onChanged }) {
  const { user } = useAuth();
  const [values, setValues] = useState({ delta: '', reason: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(() => listStockMovements(product.id), [product.id, product.stock]);
  const { data: movements } = useLoader(load);

  function handleChange(event) {
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await adjustStock(product.id, values.delta, values.reason, user.id);
      setValues({ delta: '', reason: '' });
      setMessage({ type: 'success', text: 'Stock mis à jour.' });
      await onChanged();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    setIsSaving(false);
  }

  return (
    <section className="admin-card" aria-labelledby="stock-title">
      <h2 id="stock-title">Stock : {product.stock} en stock</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Input label="Quantité à ajouter (ou à retirer, avec un signe −)" name="delta" type="number" step="1" required value={values.delta} onChange={handleChange} />
        <Input label="Motif" name="reason" required maxLength={REASON_MAX} placeholder="Réception fournisseur, casse, inventaire…" value={values.reason} onChange={handleChange} />
        {message.text && (
          <p className={message.type === 'error' ? 'admin-error' : 'admin-success'} role={message.type === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}
        <Button type="submit" disabled={isSaving}>
          Ajuster le stock
        </Button>
      </form>

      {movements?.length > 0 && (
        <DataTable caption="Historique des ajustements de stock">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col" className="is-number">
                Variation
              </th>
              <th scope="col" className="is-number">
                Stock après
              </th>
              <th scope="col">Motif</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{formatDateTime(movement.date)}</td>
                <td className="is-number">{movement.delta > 0 ? `+${movement.delta}` : movement.delta}</td>
                <td className="is-number">{movement.stockAfter}</td>
                <td>{movement.reason}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </section>
  );
}
