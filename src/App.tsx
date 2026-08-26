import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Spinner } from "./components/ui/States";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Returns from "./pages/Returns";
import Payouts from "./pages/Payouts";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Loading FitSeller…" />
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
