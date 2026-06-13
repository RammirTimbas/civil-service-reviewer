import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
      },
      logout: async () => {
        // call backend to clear HttpOnly cookie
        try {
          await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (e) {}
        try {
          localStorage.removeItem('token');
        } catch (e) {}
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
      // persist only the user object; do not persist JWT token
      partialize: (state) => ({ user: state.user }),
    }
  )
);
