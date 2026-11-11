import { Navigate, Route, Routes } from 'react-router-dom';
import CataloguePage from './features/catalogue/CataloguePage.jsx';
import CartPage from './features/cart/CartPage.jsx';
import CheckoutPage from './features/orders/CheckoutPage.jsx';
import ProductPage from './features/catalogue/ProductPage.jsx';
import ProLayout from './features/layout/ProLayout.jsx';
import ComingSoonPage from './pages/ComingSoonPage.jsx';
import HomePage from './features/home/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './features/auth/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/connexion" replace />} />
      <Route path="/connexion" element={<LoginPage />} />

      {/* Toutes les pages ci-dessous demandent d'être connecté et partagent l'en-tête. */}
      <Route
        element={
          <ProtectedRoute>
            <ProLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/accueil" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/catalogue/:productId" element={<ProductPage />} />
        <Route path="/panier" element={<CartPage />} />
        <Route path="/commande" element={<CheckoutPage />} />
        <Route path="/commande/confirmation/:orderId" element={<ComingSoonPage title="Commande confirmée" />} />
        <Route path="/commandes" element={<ComingSoonPage title="Mes commandes" />} />
        <Route path="/compte" element={<ComingSoonPage title="Mon compte" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
