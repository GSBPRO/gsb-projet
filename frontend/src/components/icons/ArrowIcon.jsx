// Flèche vers la droite. Décorative : le texte du bouton suffit à comprendre (aria-hidden).
export default function ArrowIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}
