import './StatusBadge.css';

// Pastille de statut. Le texte porte l'information ; la couleur (tone) ne fait que l'appuyer (accessibilité).
// tone : 'pending' | 'success' | 'error' | 'info' | 'neutral'
export default function StatusBadge({ tone = 'neutral', children }) {
  return <span className={`status-badge status-badge--${tone}`}>{children}</span>;
}
