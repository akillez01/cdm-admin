import type { User as SupabaseUser } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from './authContext';
import { AuthContextType, User } from './authTypes';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mapeamento de usuários autorizados
const AUTHORIZED_USERS = {
  'yan@cdm.com': { name: 'Yan', role: 'admin' as const },
  'michel@cdm.com': { name: 'Michel', role: 'admin' as const },
  'admin@cdm.com': { name: 'Administrador', role: 'admin' as const },
  // Emails do Google autorizados
  'yan.cdm@gmail.com': { name: 'Yan', role: 'admin' as const },
  'michel.cdm@gmail.com': { name: 'Michel', role: 'admin' as const },
  'admin.cdm@gmail.com': { name: 'Administrador', role: 'admin' as const },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = user !== null;

  // Verificar status de autenticação do Supabase
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Verificando status de autenticação...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          setError('Erro ao verificar autenticação');
          return;
        }

        if (session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          const userData = await createUserFromSupabaseUser(session.user);
          if (userData) {
            setUser(userData);
            console.log('👤 Usuário autenticado:', userData);
          } else {
            console.log('❌ Usuário não autorizado:', session.user.email);
            await supabase.auth.signOut();
            setError('Usuário não autorizado');
          }
        } else {
          console.log('ℹ️ Nenhuma sessão ativa');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar autenticação:', error);
        setError('Erro ao verificar autenticação');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Mudança de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await createUserFromSupabaseUser(session.user);
        if (userData) {
          setUser(userData);
          setError(null);
        } else {
          await supabase.auth.signOut();
          setError('Usuário não autorizado');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setError(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Criar objeto User a partir do usuário do Supabase
  const createUserFromSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const email = supabaseUser.email;
    if (!email || !AUTHORIZED_USERS[email as keyof typeof AUTHORIZED_USERS]) {
      return null;
    }

    const authorizedUser = AUTHORIZED_USERS[email as keyof typeof AUTHORIZED_USERS];
    return {
      id: supabaseUser.id,
      name: authorizedUser.name,
      email: email,
      role: authorizedUser.role
    };
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('🔐 Tentativa de login:', email);

      // Verificar se é um usuário autorizado
      if (!AUTHORIZED_USERS[email as keyof typeof AUTHORIZED_USERS]) {
        throw new Error('Usuário não autorizado para este sistema');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro de login:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido:', data.user.email);
        const userData = await createUserFromSupabaseUser(data.user);
        if (userData) {
          setUser(userData);
        } else {
          await supabase.auth.signOut();
          throw new Error('Usuário não autorizado');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      console.error('❌ Erro no login:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login via Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('🔐 Tentativa de login via Google...');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${import.meta.env.VITE_BASE_URL || ''}/`
        }
      });

      if (error) {
        console.error('❌ Erro de login Google:', error);
        throw new Error(error.message);
      }

      console.log('✅ Redirecionamento para Google iniciado');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login com Google';
      console.error('❌ Erro no login Google:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
      console.log('✅ Logout realizado');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    logout,
    isLoading,
    isAuthenticated,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
