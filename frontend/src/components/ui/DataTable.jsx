import './DataTable.css';

// Tableau de liste. « caption » décrit le tableau aux lecteurs d'écran (il reste invisible à l'écran).
export default function DataTable({ caption, children }) {
  return (
    <div className="data-table">
      <table>
        <caption className="visually-hidden">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
