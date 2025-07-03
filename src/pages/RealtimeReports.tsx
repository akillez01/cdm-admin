import {
    Activity,
    DollarSign,
    Package,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { useSupabase } from '../hooks/useSupabase';

interface RealtimeMetrics {
  totalMembers: number;
  activeMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalInventoryItems: number;
  lowStockItems: number;
  totalDaimeInventory: number;
  availableDaime: number;
  upcomingEvents: number;
  recentTransactions: number;
  timestamp: Date;
}

interface ChartDataPoint {
  period: string;
  value: number;
  comparison?: number;
}

interface Period {
  label: string;
  start: Date;
  end: Date;
}

const COLORS = ["#003B4D", "#D4AF37", "#185A6D", "#B39020", "#2D7D91", "#A67C00"];

const RealtimeReports: React.FC = () => {
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '3m'>('7d');
  
  // Dados dos gráficos
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [membershipData, setMembershipData] = useState<ChartDataPoint[]>([]);
  const [transactionTrends, setTransactionTrends] = useState<ChartDataPoint[]>([]);

  const { 
    getMembers, 
    getTransactions, 
    getInventory, 
    getDaimeInventory
  } = useSupabase();

  // Carregar métricas em tempo real
  const loadRealtimeMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [members, transactions, inventory, daimeInventory] = await Promise.all([
        getMembers(),
        getTransactions(),
        getInventory(),
        getDaimeInventory()
      ]);

      // Calcular métricas
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const activeMembers = members.filter(m => m.status === 'active').length;
      const monthlyTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
      const monthlyRevenue = monthlyTransactions
        .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalRevenue = transactions
        .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const lowStockItems = inventory.filter(item => 
        item.quantity <= (item.minQuantity || 5)
      ).length;

      const availableDaime = daimeInventory.filter(item => 
        item.status === 'disponivel'
      ).length;

      const newMetrics: RealtimeMetrics = {
        totalMembers: members.length,
        activeMembers,
        totalRevenue,
        monthlyRevenue,
        totalInventoryItems: inventory.length,
        lowStockItems,
        totalDaimeInventory: daimeInventory.length,
        availableDaime,
        upcomingEvents: 0, // TODO: implementar quando tiver eventos
        recentTransactions: monthlyTransactions.length,
        timestamp: new Date()
      };

      setMetrics(newMetrics);
      
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getMembers, getTransactions, getInventory, getDaimeInventory]);

  // Gerar períodos baseado no timeRange
  const generatePeriods = useCallback((range: string): Period[] => {
    const now = new Date();
    const periods = [];
    
    switch (range) {
      case '24h':
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
          periods.push({
            label: hour.getHours().toString().padStart(2, '0') + 'h',
            start: new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours()),
            end: new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours() + 1)
          });
        }
        break;
        
      case '7d':
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          periods.push({
            label: day.toLocaleDateString('pt-BR', { weekday: 'short' }),
            start: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
            end: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
          });
        }
        break;
        
      case '30d':
        for (let i = 29; i >= 0; i--) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          periods.push({
            label: day.getDate().toString(),
            start: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
            end: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
          });
        }
        break;
        
      case '3m':
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({
            label: month.toLocaleDateString('pt-BR', { month: 'short' }),
            start: new Date(month.getFullYear(), month.getMonth(), 1),
            end: new Date(month.getFullYear(), month.getMonth() + 1, 1)
          });
        }
        break;
    }
    
    return periods;
  }, []);

  // Verificar se data está no período
  const isInPeriod = useCallback((date: Date, period: Period) => {
    return date >= period.start && date < period.end;
  }, []);

  // Auto-refresh
  useEffect(() => {
    loadRealtimeMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadRealtimeMetrics, 30000); // 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadRealtimeMetrics]);

  // Recarregar quando timeRange mudar
  const loadChartData = useCallback(async () => {
    try {
      const transactions = await getTransactions();
      const members = await getMembers();
      
      // Gerar dados por período
      const periods = generatePeriods(timeRange);
      
      // Dados de receita
      const revenueByPeriod = periods.map(period => {
        const periodTransactions = transactions.filter(t => 
          isInPeriod(new Date(t.date), period) &&
          ['tithe', 'offering', 'donation'].includes(t.type)
        );
        const revenue = periodTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          period: period.label,
          value: revenue,
          comparison: revenue // TODO: implementar comparação com período anterior
        };
      });

      // Dados de crescimento de membros
      const membersByPeriod = periods.map(period => {
        const periodMembers = members.filter(m => 
          m.joinDate && isInPeriod(new Date(m.joinDate), period)
        );
        
        return {
          period: period.label,
          value: periodMembers.length
        };
      });

      // Dados de transações
      const transactionsByPeriod = periods.map(period => {
        const periodTransactions = transactions.filter(t => 
          isInPeriod(new Date(t.date), period)
        );
        
        return {
          period: period.label,
          value: periodTransactions.length
        };
      });

      setRevenueData(revenueByPeriod);
      setMembershipData(membersByPeriod);
      setTransactionTrends(transactionsByPeriod);
      
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    }
  }, [getTransactions, getMembers, timeRange, generatePeriods, isInPeriod]);

  useEffect(() => {
    if (metrics) {
      loadChartData();
    }
  }, [timeRange, metrics, loadChartData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const MetricCard = ({ 
    title, 
    value, 
    trend, 
    icon: Icon, 
    color = 'blue',
    isLoading = false 
  }: {
    title: string;
    value: string | number;
    trend?: { value: number; isPositive: boolean };
    icon: React.ElementType;
    color?: string;
    isLoading?: boolean;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 break-words">
            {isLoading ? '...' : value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-xs sm:text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? <TrendingUp size={14} className="sm:w-4 sm:h-4" /> : <TrendingDown size={14} className="sm:w-4 sm:h-4" />}
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full bg-${color}-100 dark:bg-${color}-900 flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 truncate">
        {title}
      </h3>
      <div className="h-48 sm:h-64">
        {children}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 truncate">
            Relatórios em Tempo Real
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">
            {metrics && `Última atualização: ${metrics.timestamp.toLocaleTimeString('pt-BR')}`}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
          {/* Seletor de período */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '24h' | '7d' | '30d' | '3m')}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-xs sm:text-sm"
          >
            <option value="24h">Últimas 24h</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="3m">Últimos 3 meses</option>
          </select>

          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            {/* Auto-refresh toggle */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2"
              />
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Auto-refresh</span>
            </label>

            {/* Refresh button */}
            <button
              onClick={loadRealtimeMetrics}
              disabled={isLoading}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <MetricCard
          title="Membros Ativos"
          value={metrics?.activeMembers || 0}
          icon={Users}
          color="blue"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Receita Mensal"
          value={formatCurrency(metrics?.monthlyRevenue || 0)}
          icon={DollarSign}
          color="green"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Itens em Estoque"
          value={metrics?.totalInventoryItems || 0}
          icon={Package}
          color="purple"
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Daime Disponível"
          value={`${metrics?.availableDaime || 0}/${metrics?.totalDaimeInventory || 0}`}
          icon={Activity}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <ChartCard title="Receitas por Período">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `R$ ${value}`} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Receita']} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#D4AF37" 
                fill="#D4AF37" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Novos Membros">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={membershipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#003B4D" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volume de Transações">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#185A6D" 
                strokeWidth={3}
                dot={{ fill: "#185A6D", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Status do Inventário">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: 'Estoque Normal', value: (metrics?.totalInventoryItems || 0) - (metrics?.lowStockItems || 0) },
                  { name: 'Estoque Baixo', value: metrics?.lowStockItems || 0 }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alertas e notificações */}
      {metrics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Alertas e Notificações
          </h3>
          
          <div className="space-y-2 sm:space-y-3">
            {metrics.lowStockItems > 0 && (
              <div className="flex items-start sm:items-center p-3 bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-md">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-orange-800 dark:text-orange-200 break-words">
                  {metrics.lowStockItems} itens com estoque baixo
                </span>
              </div>
            )}
            
            {metrics.activeMembers > metrics.totalMembers * 0.9 && (
              <div className="flex items-start sm:items-center p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-green-800 dark:text-green-200 break-words">
                  Alta taxa de membros ativos ({Math.round((metrics.activeMembers / metrics.totalMembers) * 100)}%)
                </span>
              </div>
            )}
            
            {metrics.monthlyRevenue > 5000 && (
              <div className="flex items-start sm:items-center p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 break-words">
                  Meta mensal de receita atingida!
                </span>
              </div>
            )}
            
            {metrics.lowStockItems === 0 && metrics.activeMembers <= metrics.totalMembers * 0.9 && metrics.monthlyRevenue <= 5000 && (
              <div className="flex items-center justify-center p-6 text-gray-500 dark:text-gray-400">
                <span className="text-xs sm:text-sm">Nenhum alerta no momento</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeReports;
