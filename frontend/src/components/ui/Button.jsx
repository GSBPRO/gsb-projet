// Importe le style de ce bouton
import './Button.css';

// Un bouton réutilisable. Il reçoit ses informations (props) :
//   - children : le texte écrit dans le bouton
//   - variante : "principal" (turquoise) ou "secondaire" (blanc)
//   - type : "button" ou "submit" (pour envoyer un formulaire)
//   - onClick : ce qui se passe quand on clique
//   - disabled : true = bouton grisé, impossible de cliquer
function Button({ children, variante = 'principal', type = 'button', onClick, disabled }) {
  return (
    <button
      className={`bouton bouton-${variante}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Rend le bouton utilisable dans les autres fichiers
export default Button;
