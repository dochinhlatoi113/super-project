import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import DepartmentsPage from './pages/DepartmentsPage';
import CustomersPage from './pages/CustomersPage';
import CustomerGroupsPage from './pages/CustomerGroupsPage';
import CustomerReviewsPage from './pages/CustomerReviewsPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import OrdersPage from './pages/OrdersPage';
import WarehousePage from './pages/WarehousePage';
import PostsPage from './pages/PostsPage';
import MarketingPage from './pages/MarketingPage';
import PromotionsPage from './pages/PromotionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';
import WarrantyPage from './pages/WarrantyPage';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes with MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customer-groups" element={<CustomerGroupsPage />} />
              <Route path="/customer-reviews" element={<CustomerReviewsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/warehouse" element={<WarehousePage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/marketing" element={<MarketingPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App
