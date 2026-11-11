import { useCallback } from 'react';
import useLoader from '../../utils/useLoader.js';
import useAuth from '../auth/useAuth.js';
import { getOrder, listOrders } from './orderService.js';

// La liste des commandes de l'utilisateur connecté (la plus récente en premier).
export default function useOrders() {
  const { user } = useAuth();
  const load = useCallback(() => listOrders(user.id), [user.id]);
  return useLoader(load);
}

// Une commande de l'utilisateur connecté. data vaut null si elle n'existe pas ou n'est pas à lui.
export function useOrder(orderId) {
  const { user } = useAuth();
  const load = useCallback(() => getOrder(user.id, orderId), [user.id, orderId]);
  return useLoader(load);
}
