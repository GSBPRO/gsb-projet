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
  // useParams lit l'id dans l'adresse (/admin/produits/12). Pas d'id (page « nouveau ») = création.
  const { productId } = useParams();
  const isNew = !productId;
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const { categories, laboratories } = await listAllProducts();
    // Création : un produit vide ({}). Modification : on charge le produit existant pour pré-remplir le formulaire.
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
    navigate('/admin/produits'); // retour à la liste une fois enregistré (si une erreur est lancée avant, on reste ici)
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
              showStock={isNew} // le stock se saisit à la création ; ensuite on passe par StockPanel (ajustement motivé)
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
