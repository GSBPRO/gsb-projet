// Importe le style de ce champ
import './Input.css';

// Un champ de saisie réutilisable, avec son titre (label) au-dessus.
// Il reçoit ses informations (props) :
//   - label : le titre au-dessus du champ
//   - type : "text", "email", "password"...
//   - name : le nom du champ
//   - value : ce qui est écrit dans le champ
//   - onChange : ce qui se passe quand on tape
//   - placeholder : le texte gris d'exemple
//   - erreur : un message d'erreur à afficher en dessous (facultatif)
function Input({ label, type = 'text', name, value, onChange, placeholder, erreur }) {
  return (
    <div className="champ">
      {/* htmlFor relie le titre au champ : cliquer sur le titre sélectionne le champ */}
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {/* Le message d'erreur n'apparaît que s'il y en a un */}
      {erreur && <p className="champ-erreur">{erreur}</p>}
    </div>
  );
}

// Rend le champ utilisable dans les autres fichiers
export default Input;
