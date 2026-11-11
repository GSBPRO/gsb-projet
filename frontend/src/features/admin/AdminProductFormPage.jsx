import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import useLoader from '../../utils/useLoader.js';
import useAuth from '../auth/useAuth.js';
import ProductForm from '../catalogue/ProductForm.jsx';
import { createProduct, getProductForEdit, listAllProducts, updateProduct } from '../catalogue/productManagementService.js';
import StockPanel from './StockPanel.jsx';

// Création (/admin/produits/nouveau) et modification (/admin/produits/:productId) d'un produit (F23).
// En modification, le stock ne se change pas dans le formulaire : on passe par un ajustement motivé (F26).
export default function AdminProductFormPage() {
  const { productId } = useParams();
  const isNew = !productId;
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const { categories, laboratories } = await listAllProducts();
    const product = isNew ? {} : await getProductForEdit(productId);
    return { categories, laboratories, product };
  }, [isNew, productId]);
  const { status, data, reload } = useLoader(load);

  async function handleSubmit(values) {
    if (isNew) {
      await createProduct(values, user);
    } else {
      await updateProduct(productId, values, user);
    }
    navigate('/admin/produits');
  }

  return (
    <div>
      <PageHeader title={isNew ? 'Ajouter un produit' : 'Modifier le produit'} />
      <PageState status={status} isEmpty={status === 'success' && !data.product} emptyText="Produit introuvable." onRetry={reload}>
        {data?.product && (
          <>
            <ProductForm
              initial={data.product}
              categories={data.categories}
              laboratories={data.laboratories}
              showStock={isNew}
              onSubmit={handleSubmit}
              cancelTo="/admin/produits"
              submitLabel={isNew ? 'Créer le produit' : 'Enregistrer'}
            />
            {!isNew && <StockPanel product={data.product} onChanged={reload} />}
          </>
        )}
      </PageState>
    </div>
  );
}
