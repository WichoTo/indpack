// src/config/auth.ts
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';
import { supabase } from './supabase';



// Interfaz para el objeto de respuesta
export interface AuthResponse {
  error: { message: string } | null;
}

// Función para iniciar sesión con email y contraseña
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// Función para iniciar sesión con Google (OAuth)
export const loginWithGoogle = async (): Promise<AuthResponse> => {
  const redirectUrl = import.meta.env.VITE_APP_REDIRECT_URL;
  
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  });
};



// Función para resetear la contraseña
export const resetPassword = async (
  email: string
): Promise<AuthResponse> => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset',
  });
};

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { session, loading }
}

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const useAuthRole = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          return;
        }
        setUser(data.user);
        const { data: userData, error: userDbError } = await supabase
          .from("users")
          .select('role')
          .eq("id", data.user.id)
          .single();

        if (userDbError || !userData) {
          console.warn("❌ Usuario no encontrado en la tabla 'TUser'. Redirigiendo a /");
          return;
        }


        setRole(userData.role);

       
      } catch (err) {
        console.error("❌ Error al verificar el usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, role, loading };
};