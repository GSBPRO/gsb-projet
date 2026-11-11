import { useContext } from 'react';
import { CartContext } from './CartContext.jsx';

// Raccourci pour lire le panier et ses actions (addItem, setQuantity, removeItem, clear).
export default function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error('useCart doit être utilisé à l’intérieur de <CartProvider>.');
  }
  return cart;
}
