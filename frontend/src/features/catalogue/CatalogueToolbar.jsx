import { SORT_OPTIONS } from './useCatalogueFilters.js';
import './CatalogueToolbar.css';

// Titre de la liste, nombre de produits, recherche (F10) et tri.
export default function CatalogueToolbar({ resultCount, isLoading, search, sort, onChange }) {
  return (
    <div className="catalogue-toolbar">
      <div className="catalogue-toolbar__heading">
        <h2 className="catalogue-toolbar__title">Notre catalogue</h2>
        {/* aria-live : les lecteurs d'écran annoncent le nouveau nombre quand on filtre */}
        <p className="catalogue-toolbar__count" aria-live="polite">
          {isLoading ? 'Chargement des produits…' : `${resultCount} produit${resultCount > 1 ? 's' : ''} disponible${resultCount > 1 ? 's' : ''}`}
        </p>
      </div>

      <label className="catalogue-toolbar__search">
        <span className="catalogue-toolbar__label">Rechercher</span>
        <SearchIcon />
        <input
          type="search"
          value={search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Un produit, un laboratoire…"
        />
      </label>

      <label className="catalogue-toolbar__sort">
        <span className="catalogue-toolbar__label">Trier par</span>
        <select value={sort} onChange={(event) => onChange('sort', event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="catalogue-toolbar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
