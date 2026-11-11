// Les statuts d'une commande (même liste que l'ENUM de la base, schema.sql).
// `tone` choisit la couleur dans le CSS ; le libellé écrit en toutes lettres porte l'information,
// la couleur seule ne suffit pas (accessibilité).
export const ORDER_STATUSES = {
  'En attente': { label: 'En attente', tone: 'pending' },
  Validée: { label: 'Validée', tone: 'success' },
  Annulée: { label: 'Annulée', tone: 'error' },
};

// Statut inconnu (donnée corrompue) : on l'affiche tel quel, sans couleur particulière.
export function getStatusInfo(status) {
  return ORDER_STATUSES[status] ?? { label: String(status), tone: 'neutral' };
}
