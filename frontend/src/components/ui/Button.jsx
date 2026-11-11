import './Button.css';

// Un seul composant bouton pour tout le site : les variantes gardent un style cohérent.
export default function Button({ children, variant = 'primary', fullWidth = false, type = 'button', className = '', ...rest }) {
  const classes = ['btn', `btn--${variant}`, fullWidth ? 'btn--full' : '', className].join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
