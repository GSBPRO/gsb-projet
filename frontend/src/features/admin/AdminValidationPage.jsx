import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import PageState from '../../components/ui/PageState.jsx';
import useLoader from '../../utils/useLoader.js';
import { formatPrice, formatVatRate } from '../../utils/price.js';
import ProductImage from '../catalogue/ProductImage.jsx';
import { listAllProducts } from '../catalogue/productManagementService.js';
import { reviewProduct } from './adminCatalogueService.js';
import './AdminPages.css';

// Les produits proposés par les fournisseurs, en attente de décision : accepter ou refuser avec un motif (F31).
export default function AdminValidationPage() {
  const { status, data, reload } = useLoader(listAllProducts);
  const pending = data?.products.filter((product) => product.validationStatus === 'En attente');

  return (
    <div>
      <PageHeader title="Validation des produits" subtitle="Les propositions des fournisseurs, à accepter ou refuser." />
      <PageState status={status} isEmpty={status === 'success' && pending.length === 0} emptyText="Aucun produit en attente de validation." onRetry={reload}>
        {pending?.map((product) => (
          <ReviewCard
            key={product.id}
            product={product}
            categoryName={data.categories.find((category) => category.id === product.categoryId)?.name}
            laboratory={data.laboratories.find((laboratory) => laboratory.id === product.laboratoryId)}
            onDone={reload}
          />
        ))}
      </PageState>
    </div>
  );
}

function ReviewCard({ product, categoryName, laboratory, onDone }) {
  const [isRefusing, setIsRefusing] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function decide(decision) {
    if (isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      await reviewProduct(product.id, decision, reason);
      await onDone();
    } catch (reviewError) {
      setError(reviewError.message);
      setIsSaving(false);
    }
  }

  return (
    <article className="admin-card" aria-labelledby={`review-${product.id}`}>
      <div className="admin-inline">
        <div className="admin-product-thumb">
          <ProductImage product={product} laboratoryColor={laboratory?.color} />
        </div>
        <div>
          <h2 id={`review-${product.id}`}>{product.name}</h2>
          <p className="muted">
            {laboratory?.name} · {categoryName} · {product.format}
          </p>
        </div>
      </div>
      <p>{product.description}</p>
      <p>
        <strong>{formatPrice(product.priceHt)} HT</strong> · TVA {formatVatRate(product.vatRate)} · stock proposé : {product.stock}
      </p>

      {isRefusing && (
        <Input
          multiline
          rows={3}
          label="Motif du refus"
          name="reason"
          required
          maxLength={200}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-inline">
        {!isRefusing ? (
          <>
            <Button disabled={isSaving} onClick={() => decide('accept')}>
              Accepter
            </Button>
            <Button variant="danger" onClick={() => setIsRefusing(true)}>
              Refuser…
            </Button>
          </>
        ) : (
          <>
            <Button variant="danger" disabled={isSaving} onClick={() => decide('refuse')}>
              Confirmer le refus
            </Button>
            <Button variant="secondary" onClick={() => setIsRefusing(false)}>
              Annuler
            </Button>
          </>
        )}
      </div>
    </article>
  );
}
