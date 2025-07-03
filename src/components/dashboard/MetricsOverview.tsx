import {
    Calendar,
    DollarSign,
    Minus,
    Package,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

interface MetricCard {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface DashboardMetrics {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  inventoryItems: number;
  lowStockItems: number;
  upcomingEvents: number;
  lastUpdated: Date;
}

const MetricsOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMembers, getTransactions, getInventory } = useSupabase();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        
        const [members, transactions, inventory] = await Promise.all([
          getMembers(),
          getTransactions(),
          getInventory()
        ]);

        // Calcular métricas
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const totalMembers = members.length;
        const activeMembers = members.filter(m => m.status === 'active').length;

        const monthlyTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyTransactions
          .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalRevenue = transactions
          .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const inventoryItems = inventory.length;
        const lowStockItems = inventory.filter(item => 
          item.quantity !== undefined && item.quantity < 5
        ).length;

        // Simular eventos próximos (seria uma query real no Supabase)
        const upcomingEvents = 3; // placeholder

        setMetrics({
          totalMembers,
          activeMembers,
          monthlyRevenue,
          totalRevenue,
          inventoryItems,
          lowStockItems,
          upcomingEvents,
          lastUpdated: new Date()
        });

      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [getMembers, getTransactions, getInventory]);

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const metricCards: MetricCard[] = [
    {
      title: 'Membros Ativos',
      value: metrics.activeMembers,
      trend: {
        value: ((metrics.activeMembers / metrics.totalMembers) * 100),
        direction: metrics.activeMembers > (metrics.totalMembers * 0.8) ? 'up' : 'neutral',
        period: 'do total'
      },
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-50',
      description: `${metrics.totalMembers} membros totais`
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${metrics.monthlyRevenue.toLocaleString('pt-BR')}`,
      trend: {
        value: 15.5, // seria calculado com base no mês anterior
        direction: 'up',
        period: 'vs mês anterior'
      },
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600 bg-green-50',
      description: `R$ ${metrics.totalRevenue.toLocaleString('pt-BR')} total`
    },
    {
      title: 'Itens Inventário',
      value: metrics.inventoryItems,
      trend: metrics.lowStockItems > 0 ? {
        value: metrics.lowStockItems,
        direction: 'down',
        period: 'estoque baixo'
      } : undefined,
      icon: <Package className="w-6 h-6" />,
      color: metrics.lowStockItems > 0 ? 'text-red-600 bg-red-50' : 'text-purple-600 bg-purple-50',
      description: metrics.lowStockItems > 0 ? 
        `${metrics.lowStockItems} itens com estoque baixo` : 
        'Todos os itens em estoque adequado'
    },
    {
      title: 'Próximos Eventos',
      value: metrics.upcomingEvents,
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-orange-600 bg-orange-50',
      description: 'Eventos nos próximos 30 dias'
    }
  ];

  const getTrendIcon = (direction: string) => {
    const icons = {
      up: <TrendingUp className="w-4 h-4" />,
      down: <TrendingDown className="w-4 h-4" />,
      neutral: <Minus className="w-4 h-4" />
    };
    return icons[direction as keyof typeof icons];
  };

  const getTrendColor = (direction: string) => {
    const colors = {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-600'
    };
    return colors[direction as keyof typeof colors];
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Visão Geral</h2>
        <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
          Atualizado em {metrics.lastUpdated.toLocaleTimeString('pt-BR')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${metric.color}`}>
                {metric.icon}
              </div>
              {metric.trend && (
                <div className={`flex items-center gap-1 ${getTrendColor(metric.trend.direction)}`}>
                  {getTrendIcon(metric.trend.direction)}
                  <span className="text-xs sm:text-sm font-medium">
                    {metric.trend.value.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-gray-600">
                {metric.title}
              </div>
            </div>

            {metric.description && (
              <div className="text-xs text-gray-500">
                {metric.description}
              </div>
            )}

            {metric.trend && (
              <div className="text-xs text-gray-500 mt-1">
                {metric.trend.period}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsOverview;
