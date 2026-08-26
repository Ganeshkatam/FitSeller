import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import { Spinner } from "./components/ui/States";

const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

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

function Suspended({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/** Blocks app routes for unauthenticated visitors */
function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}

/** Redirects authenticated users away from guest-only auth pages
 *  (reset-password and verify-email must stay reachable mid-session) */
function GuestOnly({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const location = useLocation();
  const allowWithSession = ["/auth/reset-password", "/auth/verify-email"].includes(
    location.pathname
  );
  if (session && !allowWithSession) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Loading FitSeller…" />
      </div>
    );
  }

  return (
    <Routes>
      {/* ---- Auth routes (interactive background layout) ---- */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/sign-in" element={<GuestOnly><Suspended><SignIn /></Suspended></GuestOnly>} />
        <Route path="/auth/sign-up" element={<GuestOnly><Suspended><SignUp /></Suspended></GuestOnly>} />
        <Route path="/auth/forgot-password" element={<GuestOnly><Suspended><ForgotPassword /></Suspended></GuestOnly>} />
        <Route path="/auth/reset-password" element={<Suspended><ResetPassword /></Suspended>} />
        <Route path="/auth/verify-email" element={<Suspended><VerifyEmail /></Suspended>} />
      </Route>

      {/* ---- App routes (authenticated only) ---- */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Suspended><Dashboard /></Suspended>} />
        <Route path="/products" element={<Suspended><Products /></Suspended>} />
        <Route path="/orders" element={<Suspended><Orders /></Suspended>} />
        <Route path="/returns" element={<Suspended><Returns /></Suspended>} />
        <Route path="/payouts" element={<Suspended><Payouts /></Suspended>} />
        <Route path="/analytics" element={<Suspended><Analytics /></Suspended>} />
        <Route path="/settings" element={<Suspended><Settings /></Suspended>} />
      </Route>

      <Route
        path="*"
        element={<RootRedirect />}
      />
    </Routes>
  );
}

function RootRedirect() {
  const { session } = useAuth();
  return <Navigate to={session ? "/" : "/auth/sign-in"} replace />;
}
