import { useCallback, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import useLoader from '../../utils/useLoader.js';
import { formatPrice, priceWithTax } from '../../utils/price.js';
import StockBadge from '../catalogue/StockBadge.jsx';
import { listAllProducts } from '../catalogue/productManagementService.js';
import { deleteProduct, setProductActive } from './adminCatalogueService.js';
import { VALIDATION_TONES } from './validationTones.js';
import './AdminPages.css';

// Tous les produits, avec le stock de chacun (F33), activation / désactivation (F23) et suppression sans historique (F27).
export default function AdminProductsPage() {
  const { status, data, reload } = useLoader(listAllProducts);
  const [filters, setFilters] = useState({ text: '', categoryId: '' });
  const [message, setMessage] = useState('');
  // Suppression en deux temps : le premier clic demande confirmation (pas de fenêtre du navigateur).
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function handleFilter(event) {
    setFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  const run = useCallback(
    async (action) => {
      setMessage('');
      try {
        await action();
        setPendingDeleteId(null);
        await reload();
      } catch (error) {
        setPendingDeleteId(null);
        setMessage(error.message);
      }
    },
    [reload],
  );

  const visible = data?.products.filter((product) => {
    const text = filters.text.trim().toLowerCase();
    return (!text || product.name.toLowerCase().includes(text)) && (!filters.categoryId || product.categoryId === Number(filters.categoryId));
  });
  const nameOf = (list, id) => list.find((item) => item.id === id)?.name ?? '—';

  return (
    <div>
      <PageHeader title="Produits" subtitle="Le catalogue complet, y compris les produits désactivés ou en attente.">
        <ButtonLink to="/admin/produits/nouveau">Ajouter un produit</ButtonLink>
      </PageHeader>

      <div className="admin-filters">
        <Input label="Rechercher un produit" name="text" value={filters.text} onChange={handleFilter} />
        <div className="field">
          <label htmlFor="products-category-filter" className="field__label">
            Catégorie
          </label>
          <select id="products-category-filter" name="categoryId" className="field__input" value={filters.categoryId} onChange={handleFilter}>
            <option value="">Toutes</option>
            {data?.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <p className="admin-error" role="alert">
          {message}
        </p>
      )}

      <PageState status={status} isEmpty={status === 'success' && visible.length === 0} emptyText="Aucun produit ne correspond." onRetry={reload}>
        {data && (
          <DataTable caption="Tous les produits">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Fournisseur</th>
                <th scope="col" className="is-number">
                  Prix TTC
                </th>
                <th scope="col">Stock</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <span className="muted">{product.format}</span>
                  </td>
                  <td>{nameOf(data.categories, product.categoryId)}</td>
                  <td>{nameOf(data.laboratories, product.laboratoryId)}</td>
                  <td className="is-number">{formatPrice(priceWithTax(product.priceHt, product.vatRate))}</td>
                  <td>
                    {product.stock} <StockBadge stock={product.stock} />
                  </td>
                  <td>
                    <StatusBadge tone={VALIDATION_TONES[product.validationStatus] ?? 'neutral'}>{product.validationStatus}</StatusBadge>{' '}
                    {!product.active && <StatusBadge tone="neutral">Désactivé</StatusBadge>}
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <ButtonLink to={`/admin/produits/${product.id}`} variant="secondary" className="btn--small">
                        Modifier<span className="visually-hidden"> {product.name}</span>
                      </ButtonLink>
                      <Button variant="secondary" className="btn--small" onClick={() => run(() => setProductActive(product.id, !product.active))}>
                        {product.active ? 'Désactiver' : 'Activer'}
                        <span className="visually-hidden"> {product.name}</span>
                      </Button>
                      {pendingDeleteId === product.id ? (
                        <>
                          <Button variant="danger" className="btn--small" onClick={() => run(() => deleteProduct(product.id))}>
                            Confirmer<span className="visually-hidden"> la suppression de {product.name}</span>
                          </Button>
                          <Button variant="secondary" className="btn--small" onClick={() => setPendingDeleteId(null)}>
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <Button variant="danger" className="btn--small" onClick={() => setPendingDeleteId(product.id)}>
                          Supprimer<span className="visually-hidden"> {product.name}</span>
                        </Button>
                      )}
                    </div>
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
