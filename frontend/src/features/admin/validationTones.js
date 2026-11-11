// Couleur de la pastille selon le statut de validation d'un produit (même liste que l'ENUM de schema.sql).
// Utilisé par l'administrateur et par le fournisseur (features/supplier).
export const VALIDATION_TONES = {
  'En attente': 'pending',
  Accepté: 'success',
  Refusé: 'error',
};
