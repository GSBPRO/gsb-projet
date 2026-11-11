// Dates affichées à la française : « 11 nov. 2026, 14:32 ». Le navigateur fait le formatage (Intl).
const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });

export function formatDateTime(isoDate) {
  return dateTimeFormatter.format(new Date(isoDate));
}

export function formatDate(isoDate) {
  return dateFormatter.format(new Date(isoDate));
}
