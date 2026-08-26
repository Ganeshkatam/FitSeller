import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile, Seller } from "../types";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  seller: Seller | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({} as AuthState);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(data.session);
        if (data.session?.user) {
          await loadSellerContext(data.session.user.id, data.session.user.email ?? "");
        }
      } catch (err) {
        console.error("Auth context initialization error:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (cancelled) return;
      setSession(s);
      if (s?.user) {
        await loadSellerContext(s.user.id, s.user.email ?? "");
      } else {
        setProfile(null);
        setSeller(null);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function loadSellerContext(userId: string, email: string) {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Fetch user Profile (created and managed at database level via handle_new_user trigger)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      setProfile(profileData ?? null);

      // 2. Fetch Seller record by authoritative profile ownership
      let { data: sellerRecord } = await supabase
        .from("sellers")
        .select(
          "id, profile_id, business_name, business_email, status, brand_name, primary_category, shipping_mode, courier_partner, dispatch_time_hours, onboarding_completed_at, created_at, updated_at"
        )
        .eq("profile_id", userId)
        .maybeSingle();

      // Fallback: Link legacy record only if profile_id was never assigned
      if (!sellerRecord && cleanEmail) {
        const { data: legacyRecord } = await supabase
          .from("sellers")
          .select(
            "id, profile_id, business_name, business_email, status, brand_name, primary_category, shipping_mode, courier_partner, dispatch_time_hours, onboarding_completed_at, created_at, updated_at"
          )
          .eq("business_email", cleanEmail)
          .is("profile_id", null)
          .maybeSingle();

        if (legacyRecord) {
          const { data: linkedSeller } = await supabase
            .from("sellers")
            .update({ profile_id: userId })
            .eq("id", legacyRecord.id)
            .select(
              "id, profile_id, business_name, business_email, status, brand_name, primary_category, shipping_mode, courier_partner, dispatch_time_hours, onboarding_completed_at, created_at, updated_at"
            )
            .maybeSingle();
          sellerRecord = linkedSeller ?? legacyRecord;
        }
      }

      setSeller(sellerRecord ?? null);

      setAuthError(null);
    } catch {
      setProfile(null);
      setSeller(null);
    }
  }

  async function refreshAuth() {
    if (session?.user) {
      await loadSellerContext(session.user.id, session.user.email ?? "");
    }
  }

  async function signIn(email: string, password: string) {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) throw error;

    if (data.session) {
      setSession(data.session);
    }
  }

  async function signUp(email: string, password: string, fullName: string, phone: string) {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      phone: phone.trim() || undefined,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim() || null,
        },
      },
    });
    if (error) throw error;

    if (data.session) {
      setSession(data.session);
    }
  }

  async function requestPasswordReset(email: string) {
    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  async function resendVerification(email: string) {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });
    if (error) throw error;
  }

  async function signInWithGoogle() {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }

  async function signOut() {
    setAuthError(null);
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        seller,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshAuth,
        requestPasswordReset,
        updatePassword,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
