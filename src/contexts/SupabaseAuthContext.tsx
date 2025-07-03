import { User as SupabaseUser } from '@supabase/supabase-js';
import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  // Verificar se há um usuário logado no Supabase
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          const userData = await getUserData(supabaseUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await getUserData(session.user);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getUserData = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Aqui você pode buscar dados adicionais do usuário de uma tabela profiles
    // Por enquanto, vamos usar os dados básicos e assumir que todos são admin
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email || 'Usuário',
      email: supabaseUser.email || '',
      role: 'admin' // Por padrão, todos são admin
    };
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (data.user) {
        const userData = await getUserData(data.user);
        setUser(userData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
