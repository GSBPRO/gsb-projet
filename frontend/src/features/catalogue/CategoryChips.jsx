import './CategoryChips.css';

// Les catégories en pastilles cliquables (F08). « Tout le catalogue » enlève le filtre.
// selectedId : null quand aucune catégorie n'est choisie.
export default function CategoryChips({ categories, selectedId, onSelect }) {
  const chips = [{ id: null, name: 'Tout le catalogue' }, ...categories];

  return (
    <div className="category-chips" role="group" aria-label="Catégories">
      {chips.map((category) => (
        <button
          key={category.id ?? 'all'}
          type="button"
          className="category-chips__chip"
          // aria-pressed : annonce aux lecteurs d'écran quelle pastille est sélectionnée.
          aria-pressed={selectedId === category.id}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
