import { useCallback, useEffect, useState } from 'react';

// Controla logs para evitar repetição durante hot reload
const LOG_KEYS = {
  API_CONFIG: 'cdm-admin-api-config-logged',
  API_OPERATIONS: 'cdm-admin-api-operations-logged'
};

// Hook para detectar se a API local está disponível e fazer fallback para Supabase
export function useApiWithFallback() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sleepy-allen.66-179-92-233.plesk.page/api';
  const forceSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';
  
  // Se forçar Supabase, marcar API como indisponível imediatamente
  const [apiCheckStatus, setApiCheckStatus] = useState<'checking' | 'available' | 'unavailable'>(
    forceSupabase ? 'unavailable' : 'checking'
  );
  
  // Verifica se estamos em ambiente de desenvolvimento
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  
  // Verifica se a URL da API é localhost (para evitar tentativas em produção)
  const isApiLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
  
  // Função para testar se a API está disponível
  const testApiAvailability = useCallback(async (): Promise<boolean> => {
    // Se VITE_USE_SUPABASE=true, não testar API
    if (forceSupabase) {
      // Log apenas uma vez por sessão
      const lastLogged = sessionStorage.getItem(LOG_KEYS.API_CONFIG);
      if (lastLogged !== 'force-supabase') {
        console.log('🔵 VITE_USE_SUPABASE=true - Pulando teste de API');
        sessionStorage.setItem(LOG_KEYS.API_CONFIG, 'force-supabase');
      }
      return false;
    }
    
    // Se a API é localhost e não estamos em desenvolvimento, retorna falso diretamente
    if (isApiLocalhost && !isDevelopment) {
      // Log apenas uma vez por sessão
      const lastLogged = sessionStorage.getItem(LOG_KEYS.API_CONFIG);
      if (lastLogged !== 'skip-localhost-prod') {
        console.log('🔄 Pulando teste de API localhost em produção');
        sessionStorage.setItem(LOG_KEYS.API_CONFIG, 'skip-localhost-prod');
      }
      return false;
    }
    
    try {
      // Log apenas uma vez por sessão para testes de API
      const lastLogged = sessionStorage.getItem(LOG_KEYS.API_OPERATIONS);
      if (lastLogged !== API_BASE_URL) {
        console.log(`🔄 Testando disponibilidade da API: ${API_BASE_URL}/health`);
        sessionStorage.setItem(LOG_KEYS.API_OPERATIONS, API_BASE_URL);
      }
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout curto para evitar esperas longas
        signal: AbortSignal.timeout(5000),
      });
      
      const isAvailable = response.ok;
      // Log resultado apenas se não foi logado antes
      const resultKey = `${API_BASE_URL}-${isAvailable ? 'available' : 'unavailable'}`;
      const lastResultLogged = sessionStorage.getItem(`${LOG_KEYS.API_OPERATIONS}-result`);
      if (lastResultLogged !== resultKey) {
        console.log(`📡 API ${isAvailable ? 'DISPONÍVEL' : 'INDISPONÍVEL'}: ${API_BASE_URL}`);
        sessionStorage.setItem(`${LOG_KEYS.API_OPERATIONS}-result`, resultKey);
      }
      return isAvailable;
    } catch (error) {
      // Log erro apenas uma vez por sessão
      const errorKey = `${API_BASE_URL}-error`;
      const lastErrorLogged = sessionStorage.getItem(`${LOG_KEYS.API_OPERATIONS}-error`);
      if (lastErrorLogged !== errorKey) {
        console.log(`❌ Erro ao testar API: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        sessionStorage.setItem(`${LOG_KEYS.API_OPERATIONS}-error`, errorKey);
      }
      return false;
    }
  }, [API_BASE_URL, isDevelopment, isApiLocalhost, forceSupabase]);

  // Testa a API na inicialização (apenas uma vez) - mas não se forçar Supabase
  useEffect(() => {
    if (forceSupabase) {
      // Se forçar Supabase, não testar API
      // Log apenas uma vez por sessão
      const lastLogged = sessionStorage.getItem(LOG_KEYS.API_CONFIG);
      if (lastLogged !== 'using-supabase-directly') {
        console.log('🔵 VITE_USE_SUPABASE=true - Não testando API, usando Supabase diretamente');
        sessionStorage.setItem(LOG_KEYS.API_CONFIG, 'using-supabase-directly');
      }
      setApiCheckStatus('unavailable');
      return;
    }
    
    const checkApi = async () => {
      const isAvailable = await testApiAvailability();
      setApiCheckStatus(isAvailable ? 'available' : 'unavailable');
    };
    
    checkApi();
  }, [testApiAvailability, forceSupabase]);

  // Função para fazer requisições com fallback
  const makeRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    // Se ainda não checamos ou sabemos que está indisponível, falha direto
    if (apiCheckStatus === 'unavailable') {
      throw new Error('API_NOT_AVAILABLE');
    }
    
    // Se ainda está checando, testa uma vez mais
    if (apiCheckStatus === 'checking') {
      const isApiAvailable = await testApiAvailability();
      if (!isApiAvailable) {
        setApiCheckStatus('unavailable');
        throw new Error('API_NOT_AVAILABLE');
      }
      setApiCheckStatus('available');
    }

    try {
      // Log de requisições apenas em modo de debug
      if (import.meta.env.DEV && sessionStorage.getItem('cdm-admin-debug-requests') === 'true') {
        console.log(`📡 Fazendo requisição para: ${API_BASE_URL}${endpoint}`);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // Timeout para evitar travamentos
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const text = await response.text();
        // Se retornar HTML, significa que a API não existe
        if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
          // Log apenas uma vez por sessão
          const lastLogged = sessionStorage.getItem(`${LOG_KEYS.API_OPERATIONS}-html-error`);
          if (lastLogged !== API_BASE_URL) {
            console.log('❌ API retornou HTML - marcando como indisponível');
            sessionStorage.setItem(`${LOG_KEYS.API_OPERATIONS}-html-error`, API_BASE_URL);
          }
          setApiCheckStatus('unavailable');
          throw new Error('API_NOT_AVAILABLE');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'API_NOT_AVAILABLE') {
        throw error;
      }
      // Para outros erros, marca como indisponível para evitar tentativas futuras
      // Log apenas uma vez por sessão
      const errorKey = `request-error-${API_BASE_URL}`;
      const lastErrorLogged = sessionStorage.getItem(`${LOG_KEYS.API_OPERATIONS}-request-error`);
      if (lastErrorLogged !== errorKey) {
        console.log(`❌ Erro na requisição API - marcando como indisponível: ${error}`);
        sessionStorage.setItem(`${LOG_KEYS.API_OPERATIONS}-request-error`, errorKey);
      }
      setApiCheckStatus('unavailable');
      throw new Error('API_NOT_AVAILABLE');
    }
  }, [API_BASE_URL, testApiAvailability, apiCheckStatus]);

  return {
    makeRequest,
    testApiAvailability,
    API_BASE_URL,
    apiStatus: apiCheckStatus,
    isApiLocalhost,
    isDevelopment,
  };
}
