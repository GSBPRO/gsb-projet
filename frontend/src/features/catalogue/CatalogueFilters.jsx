import { useState } from 'react';
import './CatalogueFilters.css';

// Filtres du catalogue (F11) : laboratoire et disponibilité, plus un bouton pour tout effacer.
// Sur mobile, ils sont repliés derrière un bouton « Filtres » pour laisser voir les produits.
export default function CatalogueFilters({ laboratories, filters, onChange, onReset, hasActiveFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="catalogue-filters" aria-labelledby="filters-title">
      {/* Bouton visible seulement sur mobile ; aria-expanded dit s'il est ouvert ou fermé */}
      <button
        type="button"
        className="catalogue-filters__toggle"
        aria-expanded={isOpen}
        aria-controls="filters-panel"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filtres {hasActiveFilters && <span className="catalogue-filters__dot">actifs</span>}
      </button>

      <div id="filters-panel" className={`catalogue-filters__panel ${isOpen ? 'is-open' : ''}`}>
        <h2 id="filters-title" className="catalogue-filters__title">
          Affiner la sélection
        </h2>

        <label className="catalogue-filters__field">
          <span>Laboratoire</span>
          <select
            value={filters.laboratoryId ?? ''}
            // Une liste déroulante renvoie toujours du texte : on le reconvertit en nombre (ou null pour « tous »).
            onChange={(event) => onChange('laboratoryId', event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">Tous les laboratoires</option>
            {laboratories.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
        </label>

        <label className="catalogue-filters__check">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) => onChange('inStockOnly', event.target.checked)}
          />
          <span>Uniquement les produits en stock</span>
        </label>

        <button type="button" className="catalogue-filters__reset" onClick={onReset} disabled={!hasActiveFilters}>
          Effacer les filtres
        </button>
      </div>
    </aside>
  );
}
