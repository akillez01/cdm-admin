import { useCallback, useEffect, useState } from 'react';
import { useSupabase } from './useSupabase';

interface RealtimeStats {
  membersCount: number;
  activeMembers: number;
  inventoryCount: number;
  lowStockCount: number;
  daimeCount: number;
  monthlyRevenue: number;
  recentTransactions: number;
  lastUpdate: Date;
}

interface UseRealtimeStatsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // em segundos
}

export const useRealtimeStats = (options: UseRealtimeStatsOptions = {}) => {
  const { autoRefresh = true, refreshInterval = 30 } = options;
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    getMembers, 
    getTransactions, 
    getInventory, 
    getDaimeInventory 
  } = useSupabase();

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dados em paralelo
      const [members, transactions, inventory, daimeInventory] = await Promise.all([
        getMembers(),
        getTransactions(),
        getInventory(),
        getDaimeInventory()
      ]);

      // Calcular estatísticas
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const activeMembers = members.filter(m => m.status === 'active').length;
      
      const recentTransactions = transactions.filter(t => 
        new Date(t.date) >= thirtyDaysAgo
      );

      const monthlyRevenue = recentTransactions
        .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const lowStockCount = inventory.filter(item => 
        item.quantity <= (item.minQuantity || 5)
      ).length;

      const newStats: RealtimeStats = {
        membersCount: members.length,
        activeMembers,
        inventoryCount: inventory.length,
        lowStockCount,
        daimeCount: daimeInventory.length,
        monthlyRevenue,
        recentTransactions: recentTransactions.length,
        lastUpdate: new Date()
      };

      setStats(newStats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [getMembers, getTransactions, getInventory, getDaimeInventory]);

  // Atualização inicial e auto-refresh
  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchStats, autoRefresh, refreshInterval]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};
