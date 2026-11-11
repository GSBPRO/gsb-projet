import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { getStatusInfo } from './orderStatus.js';

// Pastille du statut d'une commande (En attente, Validée, Annulée).
export default function OrderStatusBadge({ status }) {
  const { label, tone } = getStatusInfo(status);
  return <StatusBadge tone={tone}>{label}</StatusBadge>;
}
