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
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
      const userMeta = session?.user?.user_metadata;

      // 1. Ensure Profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      let profileData = existingProfile;
      if (!profileData) {
        const rawName =
          userMeta?.full_name ??
          userMeta?.name ??
          cleanEmail.split("@")[0] ??
          "Seller";
        const { data: newProfile } = await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              email: cleanEmail,
              full_name: rawName,
              display_name: rawName,
              avatar_url: userMeta?.avatar_url ?? userMeta?.picture ?? null,
              role: "seller",
            },
            { onConflict: "id" }
          )
          .select()
          .maybeSingle();
        profileData = newProfile ?? null;
      }
      setProfile(profileData);

      // 2. Check if a Seller record exists
      const { data: existingSeller } = await supabase
        .from("sellers")
        .select("*")
        .or(`profile_id.eq.${userId},business_email.eq.${cleanEmail}`)
        .maybeSingle();

      let sellerRecord = existingSeller;

      // 3. When no seller account exists, CREATE A NEW SELLER ACCOUNT AUTOMATICALLY
      if (!sellerRecord) {
        const rawName =
          profileData?.full_name ??
          userMeta?.full_name ??
          userMeta?.name ??
          cleanEmail.split("@")[0] ??
          "Seller";
        const businessName =
          rawName.charAt(0).toUpperCase() + rawName.slice(1);

        const { data: createdSeller, error: createSellerErr } = await supabase
          .from("sellers")
          .insert({
            profile_id: userId,
            business_email: cleanEmail,
            business_name: businessName,
            status: "active",
          })
          .select()
          .maybeSingle();

        if (!createSellerErr && createdSeller) {
          sellerRecord = createdSeller;

          // Also auto-initialize merchant wallet
          try {
            await supabase.from("wallets").insert({
              seller_id: createdSeller.id,
              available_balance: 0,
              pending_balance: 0,
              on_hold_balance: 0,
              currency: "INR",
            });
          } catch {
            // Ignore if wallets table is not present
          }
        }
      } else if (!sellerRecord.profile_id && userId) {
        // Link profile_id if not yet linked
        const { data: linkedSeller } = await supabase
          .from("sellers")
          .update({ profile_id: userId })
          .eq("id", sellerRecord.id)
          .select()
          .maybeSingle();
        if (linkedSeller) sellerRecord = linkedSeller;
      }

      setSeller(sellerRecord);
      setAuthError(null);
    } catch {
      setProfile(null);
      setSeller(null);
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

  async function signUp(email: string, password: string) {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
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
        requestPasswordReset,
        updatePassword,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
