import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';

interface RealtimeStatsWidgetProps {
  className?: string;
  showRefreshButton?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const RealtimeStatsWidget: React.FC<RealtimeStatsWidgetProps> = ({
  className = '',
  showRefreshButton = true,
  autoRefresh = true,
  refreshInterval = 30
}) => {
  const { stats, isLoading, refetch } = useRealtimeStats({
    autoRefresh,
    refreshInterval
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    trend,
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { value: number; isPositive: boolean };
    color?: 'blue' | 'green' | 'orange' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500'
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </span>
          <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`}></div>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {isLoading ? '...' : value}
        </div>
        
        {subtitle && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>
        )}
        
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="ml-1">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    );
  };

  if (!stats && !isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          Erro ao carregar estatísticas
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Métricas em Tempo Real
          </h3>
          {stats && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Atualizado às {stats.lastUpdate.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
        
        {showRefreshButton && (
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Métricas Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Membros Ativos"
          value={stats?.activeMembers || 0}
          subtitle={`de ${stats?.membersCount || 0} total`}
          color="blue"
        />
        
        <StatCard
          title="Receita Mensal"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          subtitle={`${stats?.recentTransactions || 0} transações`}
          color="green"
        />
        
        <StatCard
          title="Itens Estoque"
          value={stats?.inventoryCount || 0}
          subtitle={`${stats?.lowStockCount || 0} em falta`}
          color="purple"
        />
        
        <StatCard
          title="Daime"
          value={`${stats?.daimeCount || 0} itens`}
          subtitle="Inventário atual"
          color="orange"
        />
      </div>

      {/* Alertas */}
      {stats && stats.lowStockCount > 0 && (
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
          <div className="flex items-center text-sm text-orange-800 dark:text-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            {stats.lowStockCount} {stats.lowStockCount === 1 ? 'item com' : 'itens com'} estoque baixo
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeStatsWidget;
