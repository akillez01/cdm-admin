import { useApi } from './useApi';
import { useSupabase } from './useSupabase';

/**
 * Hook híbrido que usa Supabase ou API nova baseado na configuração
 * Permite migração gradual sem quebrar o sistema
 */
export function useDataProvider() {
  const useSupabaseMode = import.meta.env.VITE_USE_SUPABASE !== 'false';
  
  const apiHook = useApi();
  const supabaseHook = useSupabase();
  
  // Retorna o hook apropriado baseado na configuração
  if (useSupabaseMode) {
    console.log('🔵 Usando Supabase como provider de dados');
    return {
      ...supabaseHook,
      provider: 'supabase' as const
    };
  } else {
    console.log('🟢 Usando API MySQL como provider de dados');
    return {
      ...apiHook,
      provider: 'api' as const
    };
  }
}
