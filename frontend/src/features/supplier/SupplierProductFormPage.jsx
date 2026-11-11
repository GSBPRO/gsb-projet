import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import useLoader from '../../utils/useLoader.js';
import useAuth from '../auth/useAuth.js';
import ProductForm from '../catalogue/ProductForm.jsx';
import { createProduct, listSupplierProducts, updateProduct } from '../catalogue/productManagementService.js';
import './SupplierPages.css';

// Proposition d'un produit (/fournisseur/produits/nouveau, F29) et modification d'un de SES produits (F30).
// Le produit est cherché parmi les produits de CE fournisseur : l'identifiant d'un produit d'un autre donne « introuvable ».
export default function SupplierProductFormPage() {
  const { productId } = useParams();
  const isNew = !productId;
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    const { products, categories } = await listSupplierProducts(user.supplierId);
    return { categories, product: isNew ? {} : (products.find((candidate) => candidate.id === Number(productId)) ?? null) };
  }, [isNew, productId, user.supplierId]);
  const { status, data, reload } = useLoader(load);

  async function handleSubmit(values) {
    if (isNew) await createProduct(values, user);
    else await updateProduct(productId, values, user);
    navigate('/fournisseur/produits');
  }

  return (
    <div>
      <PageHeader title={isNew ? 'Proposer un produit' : 'Modifier mon produit'} />
      {isNew ? (
        <p className="muted supplier-note">Votre proposition sera examinée par un administrateur GSB avant d’apparaître au catalogue.</p>
      ) : (
        <p className="muted supplier-note">
          Une modification du nom, de la description, du prix, de la catégorie ou de l’image remet le produit en attente de validation.
        </p>
      )}
      <PageState status={status} isEmpty={status === 'success' && !data.product} emptyText="Produit introuvable." onRetry={reload}>
        {data?.product && (
          <ProductForm
            initial={data.product}
            categories={data.categories}
            showStock={isNew}
            requireImage={isNew}
            onSubmit={handleSubmit}
            cancelTo="/fournisseur/produits"
            submitLabel={isNew ? 'Envoyer la proposition' : 'Enregistrer'}
          />
        )}
      </PageState>
    </div>
  );
}
