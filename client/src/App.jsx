import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import "./App.css";

const PlaceholderPage = ({ title, description }) => {
  return (
    <main className="page">
      <section className="section-header">
        <p className="eyebrow">Coming next</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </section>
    </main>
  );
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="Shopping cart"
                description="Stage 8 will display cart items, quantity controls, remove buttons, and checkout."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PlaceholderPage
                title="Order history"
                description="Stage 8 will show the current user's previous orders."
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <PlaceholderPage
                title="Admin dashboard"
                description="Stage 9 will add admin product, user, and order management."
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;