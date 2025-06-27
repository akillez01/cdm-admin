import { useCallback, useEffect } from 'react';
import { DaimeInventoryInsert, DaimeInventoryUpdate } from '../types';
import { useApi } from './useApi';
import { useApiWithFallback } from './useApiWithFallback';
import { useSupabase } from './useSupabase';

// Controla logs para evitar repetição durante hot reload
const LOG_KEYS = {
  PROVIDER_CONFIG: 'cdm-admin-provider-config-logged'
};

/**
 * Hook híbrido que usa API com fallback automático para Supabase
 * Detecta automaticamente se a API está disponível e faz fallback
 */
export function useDataProvider() {
  const { apiStatus } = useApiWithFallback();
  const apiHook = useApi();
  const supabaseHook = useSupabase();
  
  // Verificar se deve forçar uso do Supabase via variável de ambiente
  const forceSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';
  
  // Helper function para decidir qual hook usar
  const shouldUseSupabase = forceSupabase || apiStatus === 'unavailable';
  
  // Configuração atual como string para detectar mudanças
  const currentConfig = `${forceSupabase}-${apiStatus}-${shouldUseSupabase}`;
  
  // Log apenas uma vez por sessão ou quando a configuração mudar
  useEffect(() => {
    const lastLoggedConfig = sessionStorage.getItem(LOG_KEYS.PROVIDER_CONFIG);
    
    if (lastLoggedConfig !== currentConfig) {
      if (forceSupabase) {
        console.log('🔵 CDM Admin: Usando Supabase diretamente (VITE_USE_SUPABASE=true)');
      } else {
        console.log(`📡 CDM Admin: API Status=${apiStatus}, Usando ${shouldUseSupabase ? 'Supabase' : 'API Local'}`);
      }
      
      sessionStorage.setItem(LOG_KEYS.PROVIDER_CONFIG, currentConfig);
    }
  }, [currentConfig, forceSupabase, apiStatus, shouldUseSupabase]);
  
  // Inventário do Daime
  const getDaimeInventory = useCallback(async (filters?: { status?: string; graduacao?: string; search?: string }) => {
    try {
      if (shouldUseSupabase) {
        return await supabaseHook.getDaimeInventory();
      }
      
      return await apiHook.getDaimeInventory(filters);
    } catch {
      return await supabaseHook.getDaimeInventory();
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const addDaimeInventoryItem = useCallback(async (item: DaimeInventoryInsert) => {
    try {
      if (shouldUseSupabase) {
        return await supabaseHook.addDaimeInventoryItem(item);
      }
      
      return await apiHook.addDaimeInventoryItem(item);
    } catch {
      return await supabaseHook.addDaimeInventoryItem(item);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const updateDaimeInventoryItem = useCallback(async (id: string, item: DaimeInventoryUpdate) => {
    try {
      if (shouldUseSupabase) {
        return await supabaseHook.updateDaimeInventoryItem(id, item);
      }
      
      return await apiHook.updateDaimeInventoryItem(id, item);
    } catch {
      return await supabaseHook.updateDaimeInventoryItem(id, item);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const deleteDaimeInventoryItem = useCallback(async (id: string) => {
    try {
      if (shouldUseSupabase) {
        return await supabaseHook.deleteDaimeInventoryItem(id);
      }
      
      return await apiHook.deleteDaimeInventoryItem(id);
    } catch {
      return await supabaseHook.deleteDaimeInventoryItem(id);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  // Inventário Geral
  const getInventory = useCallback(async () => {
    try {
      if (shouldUseSupabase) {
        return await supabaseHook.getInventory();
      }
      
      return await apiHook.getInventory();
    } catch (error) {
      return await supabaseHook.getInventory();
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const addInventoryItem = useCallback(async (item: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para addInventoryItem');
        return await supabaseHook.addInventoryItem(item);
      }
      
      console.log('🟢 Tentando usar API para addInventoryItem');
      return await apiHook.addInventoryItem(item);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em addInventoryItem');
      return await supabaseHook.addInventoryItem(item);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const updateInventoryItem = useCallback(async (id: string, item: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para updateInventoryItem');
        return await supabaseHook.updateInventoryItem(id, item);
      }
      
      console.log('🟢 Tentando usar API para updateInventoryItem');
      return await apiHook.updateInventoryItem(id, item);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em updateInventoryItem');
      return await supabaseHook.updateInventoryItem(id, item);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para deleteInventoryItem');
        return await supabaseHook.deleteInventoryItem(id);
      }
      
      console.log('🟢 Tentando usar API para deleteInventoryItem');
      return await apiHook.deleteInventoryItem(id);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em deleteInventoryItem');
      return await supabaseHook.deleteInventoryItem(id);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  // Membros
  const getMembers = useCallback(async () => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 Usando Supabase para getMembers');
        return await supabaseHook.getMembers();
      }
      
      console.log('🟢 Tentando usar API para getMembers');
      return await apiHook.getMembers();
    } catch (error) {
      // Se tabela members não existir no Supabase, retornar array vazio
      if (error instanceof Error && error.message.includes('does not exist')) {
        console.log('⚠️ Tabela members não existe no Supabase - retornando lista vazia');
        return [];
      }
      console.log('🔵 Fallback para Supabase em getMembers');
      try {
        return await supabaseHook.getMembers();
      } catch (fallbackError) {
        if (fallbackError instanceof Error && fallbackError.message.includes('does not exist')) {
          console.log('⚠️ Tabela members não existe - retornando lista vazia');
          return [];
        }
        throw fallbackError;
      }
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const addMember = useCallback(async (member: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para addMember');
        return await supabaseHook.addMember(member);
      }
      
      console.log('🟢 Tentando usar API para addMember');
      return await apiHook.addMember(member);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em addMember');
      return await supabaseHook.addMember(member);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const updateMember = useCallback(async (id: string, member: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para updateMember');
        return await supabaseHook.updateMember(id, member);
      }
      
      console.log('🟢 Tentando usar API para updateMember');
      return await apiHook.updateMember(id, member);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em updateMember');
      return await supabaseHook.updateMember(id, member);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const deleteMember = useCallback(async (id: string) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - usando Supabase para deleteMember');
        return await supabaseHook.deleteMember(id);
      }
      
      console.log('🟢 Tentando usar API para deleteMember');
      return await apiHook.deleteMember(id);
    } catch (error) {
      console.log('🔵 Fallback para Supabase em deleteMember');
      return await supabaseHook.deleteMember(id);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  // Eventos - Usando apenas API por enquanto
  const getEvents = useCallback(async () => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - eventos não disponíveis no Supabase ainda');
        return [];
      }
      
      console.log('🟢 Tentando usar API para getEvents');
      return await apiHook.getEvents();
    } catch (error) {
      console.log('🔵 Erro ao buscar eventos:', error);
      return [];
    }
  }, [shouldUseSupabase, apiHook]);

  const addEvent = useCallback(async (event: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - eventos não disponíveis no Supabase ainda');
        throw new Error('Events not available in Supabase yet');
      }
      
      console.log('🟢 Tentando usar API para addEvent');
      return await apiHook.addEvent(event);
    } catch (error) {
      console.log('🔵 Erro ao adicionar evento:', error);
      throw error;
    }
  }, [shouldUseSupabase, apiHook]);

  const updateEvent = useCallback(async (id: string, event: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - eventos não disponíveis no Supabase ainda');
        throw new Error('Events not available in Supabase yet');
      }
      
      console.log('🟢 Tentando usar API para updateEvent');
      return await apiHook.updateEvent(id, event);
    } catch (error) {
      console.log('🔵 Erro ao atualizar evento:', error);
      throw error;
    }
  }, [shouldUseSupabase, apiHook]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 API indisponível - eventos não disponíveis no Supabase ainda');
        throw new Error('Events not available in Supabase yet');
      }
      
      console.log('🟢 Tentando usar API para deleteEvent');
      return await apiHook.deleteEvent(id);
    } catch (error) {
      console.log('🔵 Erro ao deletar evento:', error);
      throw error;
    }
  }, [shouldUseSupabase, apiHook]);

  // Transações
  const getTransactions = useCallback(async () => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 Usando Supabase para getTransactions');
        return await supabaseHook.getTransactions();
      }
      
      console.log('🟢 Tentando usar API para getTransactions');
      return await apiHook.getTransactions();
    } catch (error) {
      // Se tabela transactions não existir no Supabase, retornar array vazio
      if (error instanceof Error && error.message.includes('does not exist')) {
        console.log('⚠️ Tabela transactions não existe no Supabase - retornando lista vazia');
        return [];
      }
      console.log('� Fallback para Supabase em getTransactions');
      try {
        return await supabaseHook.getTransactions();
      } catch (fallbackError) {
        if (fallbackError instanceof Error && fallbackError.message.includes('does not exist')) {
          console.log('⚠️ Tabela transactions não existe - retornando lista vazia');
          return [];
        }
        console.log('🔵 Erro ao buscar transações:', fallbackError);
        return [];
      }
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  const addTransaction = useCallback(async (transaction: any) => {
    try {
      if (shouldUseSupabase) {
        console.log('🔵 Usando Supabase para addTransaction');
        return await supabaseHook.addTransaction(transaction);
      }
      
      console.log('🟢 Tentando usar API para addTransaction');
      return await apiHook.addTransaction(transaction);
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not exist')) {
        console.log('⚠️ Tabela transactions não existe - não é possível adicionar');
        throw new Error('Tabela transactions não existe no Supabase. Execute o script SQL para criá-la.');
      }
      console.log('🔵 Fallback para Supabase em addTransaction');
      return await supabaseHook.addTransaction(transaction);
    }
  }, [shouldUseSupabase, apiHook, supabaseHook]);

  return {
    // Daime Inventory
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem,
    
    // General Inventory
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    // Members
    getMembers,
    addMember,
    updateMember,
    deleteMember,
    
    // Events
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Transactions
    getTransactions,
    addTransaction,
    
    // Status info
    apiStatus,
    usingSupabase: shouldUseSupabase,
  };
}
