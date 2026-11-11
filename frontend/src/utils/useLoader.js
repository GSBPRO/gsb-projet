import { useCallback, useEffect, useState } from 'react';

// Charge une donnée et suit son état : « loading » (chargement), « error » (échec) ou « success ».
// load : fonction asynchrone stable (useCallback) qui renvoie la donnée.
// reload : pour le bouton « Réessayer » et pour rafraîchir après une modification.
export default function useLoader(load) {
  const [state, setState] = useState({ status: 'loading', data: null });

  const run = useCallback(async () => {
    setState((previous) => (previous.status === 'success' ? previous : { status: 'loading', data: null }));
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
