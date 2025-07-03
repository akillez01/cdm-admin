import React from 'react';
import DashboardAlerts from '../components/dashboard/DashboardAlerts';
import MetricsOverview from '../components/dashboard/MetricsOverview';
import QuickActions from '../components/dashboard/QuickActions';
import RealtimeStatsWidget from '../components/dashboard/RealtimeStatsWidget';

const DashboardEnhanced: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard CDM Admin</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Visão geral das atividades e métricas da comunidade
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 order-first sm:order-last">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Métricas Principais */}
      <MetricsOverview />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Coluna 1: Ações Rápidas */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <QuickActions />
        </div>

        {/* Coluna 2: Alertas e Notificações */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <DashboardAlerts />
        </div>
      </div>

      {/* Widget de Estatísticas em Tempo Real */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Estatísticas em Tempo Real</h3>
          <a 
            href="/realtime" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
          >
            Ver relatório completo →
          </a>
        </div>
        <RealtimeStatsWidget autoRefresh={true} />
      </div>

      {/* Links Rápidos de Navegação */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { 
              label: 'Relatórios', 
              url: '/reports', 
              description: 'Análises e relatórios' 
            },
            { 
              label: 'Membros', 
              url: '/members', 
              description: 'Gestão de membros' 
            },
            { 
              label: 'Finanças', 
              url: '/finance', 
              description: 'Controle financeiro' 
            },
            { 
              label: 'Inventário', 
              url: '/inventory', 
              description: 'Gestão de estoque' 
            }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group block"
            >
              <div className="font-medium text-gray-900 group-hover:text-primary-600 text-sm sm:text-base">
                {link.label}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                {link.description}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardEnhanced;
