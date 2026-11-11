import { useCallback } from 'react';
import ButtonLink from '../../components/ui/ButtonLink.jsx';
import DataTable from '../../components/ui/DataTable.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import useLoader from '../../utils/useLoader.js';
import { formatPrice, priceWithTax } from '../../utils/price.js';
import { VALIDATION_TONES } from '../admin/validationTones.js';
import useAuth from '../auth/useAuth.js';
import ProductImage from '../catalogue/ProductImage.jsx';
import { listSupplierProducts } from '../catalogue/productManagementService.js';
import './SupplierPages.css';

// La liste des produits du fournisseur connecté, avec le statut de chaque proposition (F28, F32).
// Elle ne contient JAMAIS les produits d'un autre fournisseur : le filtre se fait sur son propre identifiant.
export default function SupplierProductsPage() {
  const { user } = useAuth();
  const load = useCallback(() => listSupplierProducts(user.supplierId), [user.supplierId]);
  const { status, data, reload } = useLoader(load);

  return (
    <div>
      <PageHeader title="Mes produits" subtitle="Vos produits et l’avancement de leur validation par GSB.">
        <ButtonLink to="/fournisseur/produits/nouveau">Proposer un produit</ButtonLink>
      </PageHeader>

      <PageState
        status={status}
        isEmpty={status === 'success' && data.products.length === 0}
        emptyText="Vous n’avez pas encore de produit. Proposez-en un pour commencer."
        onRetry={reload}
      >
        {data && (
          <DataTable caption="Mes produits">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col" className="is-number">
                  Prix HT
                </th>
                <th scope="col" className="is-number">
                  Prix TTC
                </th>
                <th scope="col" className="is-number">
                  Stock
                </th>
                <th scope="col">Statut</th>
                <th scope="col">
                  <span className="visually-hidden">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="supplier-product">
                      <div className="supplier-product__image">
                        <ProductImage product={product} />
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <br />
                        <span className="muted">{product.format}</span>
                      </div>
                    </div>
                  </td>
                  <td className="is-number">{formatPrice(product.priceHt)}</td>
                  <td className="is-number">{formatPrice(priceWithTax(product.priceHt, product.vatRate))}</td>
                  <td className="is-number">{product.stock}</td>
                  <td>
                    <StatusBadge tone={VALIDATION_TONES[product.validationStatus] ?? 'neutral'}>{product.validationStatus}</StatusBadge>
                    {product.validationStatus === 'Refusé' && product.refusalReason && (
                      // Le motif est du texte : React l'échappe, aucun HTML n'est interprété.
                      <p className="supplier-product__reason">Motif : {product.refusalReason}</p>
                    )}
                  </td>
                  <td>
                    <ButtonLink to={`/fournisseur/produits/${product.id}`} variant="secondary" className="btn--small">
                      Modifier<span className="visually-hidden"> {product.name}</span>
                    </ButtonLink>
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
