import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Spinner } from "./components/ui/States";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Orders = lazy(() => import("./pages/Orders"));
const Returns = lazy(() => import("./pages/Returns"));
const Payouts = lazy(() => import("./pages/Payouts"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}

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
    return (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<PageLoader />}>
              <Products />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={<PageLoader />}>
              <Orders />
            </Suspense>
          }
        />
        <Route
          path="/returns"
          element={
            <Suspense fallback={<PageLoader />}>
              <Returns />
            </Suspense>
          }
        />
        <Route
          path="/payouts"
          element={
            <Suspense fallback={<PageLoader />}>
              <Payouts />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<PageLoader />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
