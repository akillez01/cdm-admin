import { useCallback } from 'react';
import { DaimeInventoryInsert, DaimeInventoryUpdate } from '../types';

// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Tipos para as respostas da API
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface DaimeStats {
  membersCount: number;
  dimeItemsCount: number;
  totalLitros: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

export function useApi() {
  // Função para obter headers de autenticação
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }, []);

  // Função genérica para fazer requests à API
  const apiRequest = useCallback(async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na API ${endpoint}:`, error);
      throw error;
    }
  }, [getAuthHeaders]);

  // ===== AUTENTICAÇÃO =====
  
  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Salvar token no localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  }, [apiRequest]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
  }, []);

  const getCurrentUser = useCallback(async () => {
    return apiRequest('/auth/me');
  }, [apiRequest]);

  // ===== INVENTÁRIO DO DAIME =====
  
  const getDaimeInventory = useCallback(async (filters?: {
    status?: string;
    graduacao?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.graduacao) params.append('graduacao', filters.graduacao);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = `/daime-inventory${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  }, [apiRequest]);

  const addDaimeInventoryItem = useCallback(async (item: DaimeInventoryInsert) => {
    return apiRequest('/daime-inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }, [apiRequest]);

  const updateDaimeInventoryItem = useCallback(async (id: string, item: DaimeInventoryUpdate) => {
    return apiRequest(`/daime-inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }, [apiRequest]);

  const deleteDaimeInventoryItem = useCallback(async (id: string) => {
    return apiRequest(`/daime-inventory/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  // ===== MEMBROS =====
  
  const getMembers = useCallback(async () => {
    return apiRequest('/members');
  }, [apiRequest]);

  const addMember = useCallback(async (member: Record<string, unknown>) => {
    return apiRequest('/members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  }, [apiRequest]);

  const updateMember = useCallback(async (id: string, member: Record<string, unknown>) => {
    return apiRequest(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    });
  }, [apiRequest]);

  const deleteMember = useCallback(async (id: string) => {
    return apiRequest(`/members/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  // ===== TRANSAÇÕES =====
  
  const getTransactions = useCallback(async () => {
    return apiRequest('/transactions');
  }, [apiRequest]);

  const addTransaction = useCallback(async (transaction: Record<string, unknown>) => {
    return apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }, [apiRequest]);

  const updateTransaction = useCallback(async (id: string, transaction: Record<string, unknown>) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }, [apiRequest]);

  const deleteTransaction = useCallback(async (id: string) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  // ===== INVENTÁRIO GERAL =====
  
  const getInventory = useCallback(async () => {
    return apiRequest('/inventory');
  }, [apiRequest]);

  const addInventoryItem = useCallback(async (item: Record<string, unknown>) => {
    return apiRequest('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }, [apiRequest]);

  const updateInventoryItem = useCallback(async (id: string, item: Record<string, unknown>) => {
    return apiRequest(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }, [apiRequest]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    return apiRequest(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  // ===== EVENTOS =====
  
  const getEvents = useCallback(async () => {
    return apiRequest('/events');
  }, [apiRequest]);

  const addEvent = useCallback(async (event: Record<string, unknown>) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }, [apiRequest]);

  const updateEvent = useCallback(async (id: string, event: Record<string, unknown>) => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }, [apiRequest]);

  const deleteEvent = useCallback(async (id: string) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  // ===== ESTATÍSTICAS =====
  
  const getStats = useCallback(async (): Promise<DaimeStats> => {
    return apiRequest<DaimeStats>('/stats');
  }, [apiRequest]);

  // ===== UTILITÁRIOS =====
  
  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('auth_token');
  }, []);

  const handleApiError = useCallback((error: Error | { message?: string }) => {
    console.error('Erro da API:', error);
    
    // Se o erro for 401 (não autorizado), limpar token e redirecionar
    if (error.message?.includes('401') || error.message?.includes('Token')) {
      logout();
      window.location.href = '/login';
      return;
    }
    
    // Retornar mensagem de erro amigável
    if (error.message) {
      return error.message;
    }
    
    return 'Erro interno do servidor. Tente novamente.';
  }, [logout]);

  return {
    // Autenticação
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    
    // Inventário do Daime
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem,
    
    // Membros
    getMembers,
    addMember,
    updateMember,
    deleteMember,
    
    // Transações
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Inventário Geral
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    
    // Eventos
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Estatísticas
    getStats,
    
    // Utilitários
    handleApiError,
    apiRequest,
  };
}
