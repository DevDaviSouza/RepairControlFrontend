import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/hooks/useToast';
import { MainLayout } from '@/layouts/MainLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { CustomersList } from '@/pages/Customers/CustomersList';
import { CustomerForm } from '@/pages/Customers/CustomerForm';
import { OrdersList } from '@/pages/Orders/OrdersList';
import { OrderForm } from '@/pages/Orders/OrderForm';
import { OrderDetail } from '@/pages/Orders/OrderDetail';
import { PaymentsList } from '@/pages/Payments/PaymentsList';
import { PaymentForm } from '@/pages/Payments/PaymentForm';
import { SelectOrderForPayment } from '@/pages/Payments/SelectOrderForPayment';
import { EnterprisesList } from '@/pages/Enterprises/EnterprisesList';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CustomersList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CustomerForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/:id/edit"
            element={
              <PrivateRoute>
                <MainLayout>
                  <CustomerForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <MainLayout>
                  <OrdersList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <OrderForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <OrderDetail />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <PrivateRoute>
                <MainLayout>
                  <OrderForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <MainLayout>
                  <PaymentsList />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payments/select-order"
            element={
              <PrivateRoute>
                <MainLayout>
                  <SelectOrderForPayment />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payments/:orderId/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <PaymentForm />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/enterprises"
            element={
              <PrivateRoute>
                <MainLayout>
                  <EnterprisesList />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;

