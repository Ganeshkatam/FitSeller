import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Spinner } from "./components/ui/States";

const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const GlobalError = lazy(() => import("./pages/GlobalError"));
const SellerLanding = lazy(() => import("./pages/SellerLanding"));

const OnboardingLayout = lazy(() =>
  import("./components/onboarding/OnboardingLayout").then((m) => ({
    default: m.OnboardingLayout,
  }))
);
const Step1AccountPage = lazy(() => import("./pages/onboarding/Step1AccountPage"));
const Step2GstPage = lazy(() => import("./pages/onboarding/Step2GstPage"));
const Step3BusinessPage = lazy(() => import("./pages/onboarding/Step3BusinessPage"));
const Step4ShippingPage = lazy(() => import("./pages/onboarding/Step4ShippingPage"));
const Step5PickupAddressPage = lazy(() => import("./pages/onboarding/Step5PickupAddressPage"));
const Step6BankPage = lazy(() => import("./pages/onboarding/Step6BankPage"));

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

/** Blocks app routes for visitors without an active user session AND valid seller record */
function RequireAuth({ children }: { children: ReactNode }) {
  const { session, seller, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // 1. Must be an authenticated, valid user first
  if (!session || !session.user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />;
  }

  // 2. Must be a valid user with an active seller profile
  // If user is authenticated but hasn't created a seller profile yet, direct to onboarding
  if (!seller) {
    return <Navigate to="/onboarding/step-1" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

/** Redirects authenticated sellers away from guest-only auth pages
 *  (reset-password and verify-email must stay reachable mid-session) */
function GuestOnly({ children }: { children: ReactNode }) {
  const { session, seller } = useAuth();
  const location = useLocation();
  const allowWithSession = [
    "/auth/reset-password",
    "/auth/verify-email",
  ].includes(location.pathname);
  if (session && seller && !allowWithSession) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function RootEntry() {
  const { session, seller, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (session && seller) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Suspended><SellerLanding /></Suspended>;
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
      {/* ---- Standalone Global Error Route (accessible by any use case) ---- */}
      <Route path="/error" element={<Suspended><GlobalError /></Suspended>} />

      {/* ---- Public Seller Landing Page ---- */}
      <Route path="/" element={<RootEntry />} />
      <Route path="/landing" element={<Suspended><SellerLanding /></Suspended>} />
      <Route path="/welcome" element={<Suspended><SellerLanding /></Suspended>} />

      {/* ---- Auth & Onboarding routes ---- */}
      <Route path="/auth/sign-in" element={<GuestOnly><Suspended><SignIn /></Suspended></GuestOnly>} />
      <Route path="/auth/sign-up" element={<GuestOnly><Suspended><SignUp /></Suspended></GuestOnly>} />
      <Route path="/auth/forgot-password" element={<GuestOnly><Suspended><ForgotPassword /></Suspended></GuestOnly>} />
      <Route path="/auth/reset-password" element={<Suspended><ResetPassword /></Suspended>} />
      <Route path="/auth/verify-email" element={<Suspended><VerifyEmail /></Suspended>} />
      {/* ---- Individual Onboarding Routes ---- */}
      <Route
        path="/onboarding"
        element={
          <Suspended>
            <OnboardingLayout />
          </Suspended>
        }
      >
        <Route index element={<Navigate to="/onboarding/step-1" replace />} />
        <Route
          path="step-1"
          element={
            <Suspended>
              <Step1AccountPage />
            </Suspended>
          }
        />
        <Route
          path="step-2"
          element={
            <Suspended>
              <Step2GstPage />
            </Suspended>
          }
        />
        <Route
          path="step-3"
          element={
            <Suspended>
              <Step3BusinessPage />
            </Suspended>
          }
        />
        <Route
          path="step-4"
          element={
            <Suspended>
              <Step4ShippingPage />
            </Suspended>
          }
        />
        <Route
          path="step-5"
          element={
            <Suspended>
              <Step5PickupAddressPage />
            </Suspended>
          }
        />
        <Route
          path="step-6"
          element={
            <Suspended>
              <Step6BankPage />
            </Suspended>
          }
        />
      </Route>

      {/* ---- App routes (authenticated only) ---- */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Suspended><Dashboard /></Suspended>} />
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
  const { session, seller } = useAuth();
  return <Navigate to={session && seller ? "/dashboard" : "/"} replace />;
}
