import {
    BarChart3,
    Calendar,
    DollarSign,
    Filter,
    Package,
    RefreshCw,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ChartComponent from '../components/dashboard/ChartComponent';
import ReportExporter from '../components/reports/ReportExporter';
import { useSupabase } from '../hooks/useSupabase';

interface ReportMetrics {
  totalMembers: number;
  monthlyRevenue: number;
  totalTransactions: number;
  inventoryValue: number;
  lastUpdated: Date;
}

interface ReportFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  reportType: 'all' | 'finance' | 'members' | 'inventory';
  period: '7d' | '30d' | '3m' | '6m' | '1y';
}

const ReportsEnhanced: React.FC = () => {
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      end: new Date()
    },
    reportType: 'all',
    period: '30d'
  });

  const { getMembers, getTransactions, getInventory } = useSupabase();

  useEffect(() => {
    loadReportData();
  }, [filters]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      const [members, transactions, inventory] = await Promise.all([
        getMembers(),
        getTransactions(),
        getInventory()
      ]);

      // Filtrar dados por período
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= filters.dateRange.start && 
               transactionDate <= filters.dateRange.end;
      });

      const monthlyRevenue = filteredTransactions
        .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const inventoryValue = inventory
        .reduce((sum, item) => sum + (Number(item.value || 0) * Number(item.quantity || 0)), 0);

      setMetrics({
        totalMembers: members.length,
        monthlyRevenue,
        totalTransactions: filteredTransactions.length,
        inventoryValue,
        lastUpdated: new Date()
      });

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (exportOptions: any) => {
    setIsExporting(true);
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em um caso real, isso faria uma chamada à API para gerar o arquivo
      console.log('Exportando relatório com opções:', exportOptions);
      
      // Simular download
      const blob = new Blob(['Dados do relatório'], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-cdm-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro na exportação:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const updatePeriod = (period: '7d' | '30d' | '3m' | '6m' | '1y') => {
    const end = new Date();
    let start = new Date();
    
    switch (period) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '3m':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6m':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    setFilters(prev => ({
      ...prev,
      period,
      dateRange: { start, end }
    }));
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600 mt-1">
            Visualização detalhada dos dados da comunidade
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={loadReportData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          
          <ReportExporter 
            onExport={handleExport}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: '7d', label: '7d' },
                { value: '30d', label: '30d' },
                { value: '3m', label: '3m' },
                { value: '6m', label: '6m' },
                { value: '1y', label: '1a' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => updatePeriod(period.value as any)}
                  className={`
                    px-3 py-1 text-sm rounded-lg border transition-colors
                    ${filters.period === period.value 
                      ? 'bg-primary-100 border-primary-500 text-primary-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Relatório */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                reportType: e.target.value as any 
              }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todos os Dados</option>
              <option value="finance">Financeiro</option>
              <option value="members">Membros</option>
              <option value="inventory">Inventário</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Última Atualização
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {metrics?.lastUpdated?.toLocaleString('pt-BR') || 'Carregando...'}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Resumidas */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total de Membros',
              value: metrics.totalMembers,
              icon: <Users className="w-6 h-6" />,
              color: 'text-blue-600 bg-blue-50'
            },
            {
              title: 'Receita do Período',
              value: `R$ ${metrics.monthlyRevenue.toLocaleString('pt-BR')}`,
              icon: <DollarSign className="w-6 h-6" />,
              color: 'text-green-600 bg-green-50'
            },
            {
              title: 'Transações',
              value: metrics.totalTransactions,
              icon: <TrendingUp className="w-6 h-6" />,
              color: 'text-purple-600 bg-purple-50'
            },
            {
              title: 'Valor do Inventário',
              value: `R$ ${metrics.inventoryValue.toLocaleString('pt-BR')}`,
              icon: <Package className="w-6 h-6" />,
              color: 'text-orange-600 bg-orange-50'
            }
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.title}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Receitas */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Receitas por Mês</h3>
          </div>
          <div className="h-64">
            <ChartComponent
              type="bar"
              data={{
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                  label: 'Receitas',
                  data: [1200, 1900, 3000, 5000, 2000, 3000],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Gráfico de Membros */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Crescimento de Membros</h3>
          </div>
          <div className="h-64">
            <ChartComponent
              type="line"
              data={{
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                  label: 'Novos Membros',
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderColor: 'rgba(16, 185, 129, 1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Link para Relatórios em Tempo Real */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Relatórios em Tempo Real
            </h3>
            <p className="text-gray-600">
              Acesse dados atualizados automaticamente com refresh em tempo real
            </p>
          </div>
          <a 
            href="/realtime"
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Ver Tempo Real
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReportsEnhanced;
