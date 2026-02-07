// ... imports
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/LoginPage';
import { DashboardSidebar } from '@/app/components/DashboardSidebar';
import { DashboardHeader } from '@/app/components/DashboardHeader';
import { DashboardView } from '@/app/components/DashboardView';
import { ProductsView } from '@/app/components/ProductsView';
import { OrdersView } from '@/app/components/OrdersView';
import { CustomersView } from '@/app/components/CustomersView';
import { SubscriptionsView } from '@/app/components/SubscriptionsView';
import DeactivateUser from '../pages/DeactivateUser';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import { Toaster } from 'sonner';
import { SidebarProvider, SidebarInset } from '@/app/components/ui/sidebar';

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <div className="size-full flex overflow-hidden">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Route wrapper for public pages that should show sidebar if logged in
const OptionalSidebarLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <SidebarProvider>
        <div className="size-full flex overflow-hidden">
          <DashboardSidebar />
          <SidebarInset className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <div className="size-full">
        <Toaster
          position="bottom-right"
          richColors
          theme="light"
          toastOptions={{
            className: 'sonner-toast-custom',
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/products" element={<ProductsView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/subscriptions" element={<SubscriptionsView />} />
          </Route>

          {/* Public routes with optional sidebar */}
          <Route element={<OptionalSidebarLayout />}>
            <Route path="/deactivate-user" element={<DeactivateUser />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}