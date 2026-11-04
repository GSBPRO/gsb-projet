// Flèche en diagonale (« aller vers »). Décorative : le texte du lien suffit à comprendre (aria-hidden).
export default function ArrowUpRightIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
