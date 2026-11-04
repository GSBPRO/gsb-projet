import { useCallback, useEffect, useState } from 'react';
import { getCatalogue } from './productService.js';

// Charge le catalogue et suit son état : « loading » (chargement), « error » (échec) ou « success ».
export default function useCatalogue() {
  const [state, setState] = useState({ status: 'loading', data: null });

  const load = useCallback(async () => {
    setState({ status: 'loading', data: null });
    try {
      const data = await getCatalogue();
      setState({ status: 'success', data });
    } catch {
      // Message clair pour l'utilisateur ; le détail technique ne lui sert à rien.
      setState({ status: 'error', data: null });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // reload : utilisé par le bouton « Réessayer » en cas d'erreur.
  return { status: state.status, data: state.data, reload: load };
}
