import { Link } from 'react-router-dom';
import './Button.css';

// Un lien qui a l'apparence d'un bouton. On garde un vrai lien (et pas un <button>)
// car il mène à une autre page : clic molette, « ouvrir dans un onglet », etc. fonctionnent.
export default function ButtonLink({ children, to, variant = 'primary', className = '', ...rest }) {
  return (
    <Link to={to} className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
