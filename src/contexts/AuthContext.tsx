import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppRole = 'super_admin' | 'gym_owner' | 'trainer' | 'member';

export interface MockUser {
  id: string;
  email: string | null;
  phone: string | null;
  user_metadata: { full_name?: string; avatar_url?: string; name?: string; role?: AppRole };
}

interface AuthContextType {
  // Keep same shape as before so ProtectedRoute / DashboardLayout / pages all work
  user: MockUser | null;
  session: MockUser | null;   // alias — components that check !!session work fine
  loading: boolean;
  roles: AppRole[];
  primaryRole: AppRole | null;
  // New methods
  loginWithGoogle: (googleUser: { name: string; email: string; picture?: string; role?: AppRole }) => void;
  loginWithMobile: (phone: string, role?: AppRole) => void;
  signOut: () => void;
  // Legacy stubs — kept so nothing else in the codebase breaks
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, role?: AppRole) => Promise<{ error: Error | null }>;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'anyfeast_mock_user';

function persist(user: MockUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function restore(): MockUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

function clear() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Role assignment — reads from user_metadata.role ────────────────────────

function deriveRoles(user: MockUser): AppRole[] {
  const role = user.user_metadata?.role as AppRole | undefined;
  if (role) return [role];
  // fallback: derive from phone
  const phoneRoleMap: Record<string, AppRole> = {
    '9999999999': 'trainer',
    '8888888888': 'gym_owner',
    '7777777777': 'member',
    '6666666666': 'super_admin',
  };
  if (user.phone && phoneRoleMap[user.phone]) return [phoneRoleMap[user.phone]];
  return ['trainer'];
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = restore();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const roles: AppRole[] = user ? deriveRoles(user) : [];

  const primaryRole: AppRole | null = roles.includes('super_admin') ? 'super_admin'
    : roles.includes('gym_owner') ? 'gym_owner'
    : roles.includes('trainer') ? 'trainer'
    : roles.includes('member') ? 'member'
    : null;

  // ── Login with Google ──────────────────────────────────────────────────────
  const loginWithGoogle = (googleUser: { name: string; email: string; picture?: string; role?: AppRole }) => {
    const mock: MockUser = {
      id: `google-${Date.now()}`,
      email: googleUser.email,
      phone: null,
      user_metadata: {
        full_name: googleUser.name,
        name: googleUser.name,
        avatar_url: googleUser.picture,
        role: googleUser.role ?? 'trainer',
      },
    };
    persist(mock);
    setUser(mock);
  };

  // ── Login with Mobile ──────────────────────────────────────────────────────
  const loginWithMobile = (phone: string, role?: AppRole) => {
    const mock: MockUser = {
      id: `phone-${Date.now()}`,
      email: null,
      phone,
      user_metadata: { full_name: phone, role: role ?? 'trainer' },
    };
    persist(mock);
    setUser(mock);
  };

  // ── Sign out ───────────────────────────────────────────────────────────────
  const signOut = () => {
    clear();
    setUser(null);
  };

  // ── Legacy stubs (nothing calls these now, but TypeScript needs them) ──────
  const signIn = async (_email: string, _password: string) => ({ error: null });
  const signUp = async (_email: string, _password: string, _name: string) => ({ error: null });

  return (
    <AuthContext.Provider value={{
      user,
      session: user,   // alias
      loading,
      roles,
      primaryRole,
      loginWithGoogle,
      loginWithMobile,
      signOut,
      signIn,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
