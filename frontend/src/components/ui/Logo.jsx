import './Logo.css';

// variant="light" : logo blanc pour les fonds bleu profond
export default function Logo({ subtitle = 'Espace professionnel', variant = 'dark' }) {
  return (
    <span className={`logo logo--${variant}`}>
      <span className="logo__mark" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" />
        </svg>
      </span>
      <span className="logo__text">
        GSB
        <span className="logo__subtitle">{subtitle}</span>
      </span>
    </span>
  );
}
