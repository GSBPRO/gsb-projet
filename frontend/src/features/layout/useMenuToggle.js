import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Gère l'ouverture d'un menu de l'en-tête (ex. : le menu du catalogue).
// Le menu se ferme tout seul quand on change de page (par exemple après un clic sur une catégorie).
export default function useMenuToggle() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOpenMenuId(null);
  }, [location.pathname, location.search]);

  // Un clic sur l'onglet ouvre son menu, un deuxième clic le referme.
  const toggleMenu = useCallback((menuId) => {
    setOpenMenuId((current) => (current === menuId ? null : menuId));
  }, []);

  // Fermeture au clavier (Échap) : on rend le focus à l'onglet qui avait ouvert le menu,
  // pour que l'utilisateur au clavier ne se retrouve pas « perdu » en haut de la page.
  const closeMenu = useCallback(() => {
    if (openMenuId) document.querySelector(`[aria-controls="${openMenuId}"]`)?.focus();
    setOpenMenuId(null);
  }, [openMenuId]);

  return { openMenuId, toggleMenu, closeMenu };
}
