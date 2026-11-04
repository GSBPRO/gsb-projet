import './Reveal.css';

// Fait apparaître son contenu quand un parent reçoit la classe « is-revealed ».
// delay : retard en secondes (pour faire apparaître les éléments les uns après les autres).
// variant : « fade-up » (monte en apparaissant), « zoom » (grossit), « line » (ligne de titre qui sort d'une découpe).
// as : la balise HTML à utiliser (div par défaut, span dans un titre).
export default function Reveal({ children, delay = 0, variant = 'fade-up', as: Tag = 'div' }) {
  const content = (
    <Tag className={`reveal reveal--${variant}`} style={{ '--reveal-delay': `${delay}s` }}>
      {children}
    </Tag>
  );

  // Pour une ligne de titre, on l'entoure d'une « fenêtre » qui cache ce qui dépasse :
  // la ligne part de sous la fenêtre et remonte, comme si elle sortait d'une fente.
  if (variant === 'line') {
    return <span className="reveal-mask">{content}</span>;
  }
  return content;
}
