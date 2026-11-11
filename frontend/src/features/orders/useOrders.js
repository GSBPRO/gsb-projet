import { useCallback, useEffect, useState } from 'react';
import useAuth from '../auth/useAuth.js';
import { getOrder, listOrders } from './orderService.js';

// Charge une donnée et suit son état : « loading » (chargement), « error » (échec) ou « success ».
function useLoader(load) {
  const [state, setState] = useState({ status: 'loading', data: null });

  const run = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      setState({ status: 'success', data: await load() });
    } catch {
      // Message clair pour l'utilisateur ; le détail technique ne lui sert à rien.
      setState({ status: 'error', data: null });
    }
  }, [load]);

  useEffect(() => {
    run();
  }, [run]);

  return { status: state.status, data: state.data, reload: run };
}

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
