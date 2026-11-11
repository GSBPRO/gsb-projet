import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from './features/account/AccountPage.jsx';
import AdminAccountsPage from './features/admin/AdminAccountsPage.jsx';
import AdminCategoriesPage from './features/admin/AdminCategoriesPage.jsx';
import AdminOrdersPage from './features/admin/AdminOrdersPage.jsx';
import AdminProductFormPage from './features/admin/AdminProductFormPage.jsx';
import AdminProductsPage from './features/admin/AdminProductsPage.jsx';
import AdminValidationPage from './features/admin/AdminValidationPage.jsx';
import AppLayout from './features/layout/AppLayout.jsx';
import CartPage from './features/cart/CartPage.jsx';
import CataloguePage from './features/catalogue/CataloguePage.jsx';
import ChangePasswordPage from './features/auth/ChangePasswordPage.jsx';
import CheckoutPage from './features/orders/CheckoutPage.jsx';
import ConfirmationPage from './features/orders/ConfirmationPage.jsx';
import HomePage from './features/home/HomePage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import OrderDetailPage from './features/orders/OrderDetailPage.jsx';
import OrdersPage from './features/orders/OrdersPage.jsx';
import ProductPage from './features/catalogue/ProductPage.jsx';
import ProtectedRoute from './features/auth/ProtectedRoute.jsx';
import SupplierProductFormPage from './features/supplier/SupplierProductFormPage.jsx';
import SupplierProductsPage from './features/supplier/SupplierProductsPage.jsx';
import { ROLES } from './features/auth/roles.js';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/connexion" replace />} />
      <Route path="/connexion" element={<LoginPage />} />
      {/* Première connexion : hors de la protection, sinon elle renverrait vers elle-même (F04, RG04). */}
      <Route path="/mot-de-passe" element={<ChangePasswordPage />} />

      {/* Toutes les pages ci-dessous demandent d'être connecté et partagent l'en-tête. */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Commune aux trois profils. */}
        <Route path="/compte" element={<AccountPage />} />

        {/* Professionnel de santé */}
        <Route element={<ProtectedRoute roles={[ROLES.professional]} />}>
          <Route path="/accueil" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/catalogue/:productId" element={<ProductPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
          <Route path="/commande/confirmation/:orderId" element={<ConfirmationPage />} />
          <Route path="/commandes" element={<OrdersPage />} />
          <Route path="/commandes/:orderId" element={<OrderDetailPage />} />
        </Route>

        {/* Administrateur */}
        <Route element={<ProtectedRoute roles={[ROLES.admin]} />}>
          <Route path="/admin" element={<Navigate to="/admin/commandes" replace />} />
          <Route path="/admin/commandes" element={<AdminOrdersPage />} />
          <Route path="/admin/produits" element={<AdminProductsPage />} />
          <Route path="/admin/produits/nouveau" element={<AdminProductFormPage />} />
          <Route path="/admin/produits/:productId" element={<AdminProductFormPage />} />
          <Route path="/admin/validation" element={<AdminValidationPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/comptes" element={<AdminAccountsPage />} />
        </Route>

        {/* Fournisseur */}
        <Route element={<ProtectedRoute roles={[ROLES.supplier]} />}>
          <Route path="/fournisseur" element={<Navigate to="/fournisseur/produits" replace />} />
          <Route path="/fournisseur/produits" element={<SupplierProductsPage />} />
          <Route path="/fournisseur/produits/nouveau" element={<SupplierProductFormPage />} />
          <Route path="/fournisseur/produits/:productId" element={<SupplierProductFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
