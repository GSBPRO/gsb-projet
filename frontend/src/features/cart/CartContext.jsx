import { createContext, useEffect, useState } from 'react';
import useAuth from '../auth/useAuth.js';
import { loadCart, MAX_QUANTITY, saveCart } from './cartService.js';

export const CartContext = createContext(null);

// Garde le panier de l'utilisateur connecté pour toute l'application.
// Doit être placé DANS <AuthProvider> : le panier dépend de qui est connecté.
export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState(() => (userId ? loadCart(userId) : []));

  // Quand on change de compte (connexion, déconnexion), on recharge le panier du bon utilisateur.
  // À la déconnexion il disparaît de la mémoire de l'appli, mais reste dans le navigateur pour la prochaine connexion.
  useEffect(() => {
    setItems(userId ? loadCart(userId) : []);
  }, [userId]);

  // On enregistre à chaque action (et non dans un effet) : un effet pourrait écrire l'ancien panier
  // sous le compte suivant pendant un changement d'utilisateur.
  function update(nextItems) {
    if (!userId) return;
    saveCart(userId, nextItems);
    setItems(nextItems);
  }

  function addItem(productId, quantity = 1) {
    const existing = items.find((item) => item.productId === productId);
    if (!existing) {
      update([...items, { productId, quantity: Math.min(quantity, MAX_QUANTITY) }]);
      return;
    }
    update(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY) } : item,
      ),
    );
  }

  function setQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    update(items.map((item) => (item.productId === productId ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) } : item)));
  }

  function removeItem(productId) {
    update(items.filter((item) => item.productId !== productId));
  }

  function clear() {
    update([]);
  }

  // Nombre total d'articles (somme des quantités) : affiché sur l'icône du panier.
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, addItem, setQuantity, removeItem, clear, replaceItems: update }}>
      {children}
    </CartContext.Provider>
  );
}
