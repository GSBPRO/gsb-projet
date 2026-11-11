import './PageHeader.css';

// Titre d'une page, avec à droite ses actions (boutons) s'il y en a.
export default function PageHeader({ title, subtitle = '', children }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </header>
  );
}
