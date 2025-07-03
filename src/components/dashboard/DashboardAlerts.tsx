import {
    AlertTriangle,
    CheckCircle,
    Info,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
}

const DashboardAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const { getInventory, getMembers, getTransactions } = useSupabase();

  useEffect(() => {
    const checkForAlerts = async () => {
      const newAlerts: Alert[] = [];

      try {
        // Verificar estoque baixo
        const inventory = await getInventory();
        const lowStockItems = inventory.filter(item => 
          item.quantity !== undefined && item.quantity < 5
        );

        if (lowStockItems.length > 0) {
          newAlerts.push({
            id: 'low-stock',
            type: 'warning',
            title: 'Estoque Baixo',
            message: `${lowStockItems.length} itens com estoque abaixo de 5 unidades`,
            action: {
              label: 'Ver Inventário',
              onClick: () => window.location.href = '/inventory'
            },
            dismissible: true
          });
        }

        // Verificar membros pendentes de aprovação
        const members = await getMembers();
        const pendingMembers = members.filter(member => member.status === 'pending');

        if (pendingMembers.length > 0) {
          newAlerts.push({
            id: 'pending-members',
            type: 'info',
            title: 'Membros Pendentes',
            message: `${pendingMembers.length} membros aguardando aprovação`,
            action: {
              label: 'Revisar Membros',
              onClick: () => window.location.href = '/members?filter=pending'
            },
            dismissible: true
          });
        }

        // Verificar transações do mês
        const transactions = await getTransactions();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyTransactions
          .filter(t => ['tithe', 'offering', 'donation'].includes(t.type))
          .reduce((sum, t) => sum + Number(t.amount), 0);

        if (monthlyRevenue > 10000) {
          newAlerts.push({
            id: 'high-revenue',
            type: 'success',
            title: 'Meta Atingida!',
            message: `Receita mensal já alcançou R$ ${monthlyRevenue.toLocaleString('pt-BR')}`,
            dismissible: true
          });
        }

        // Verificar eventos próximos (próximos 7 dias)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Simular eventos próximos (seria uma query real)
        const upcomingEvents = 2; // placeholder
        if (upcomingEvents > 0) {
          newAlerts.push({
            id: 'upcoming-events',
            type: 'info',
            title: 'Eventos Próximos',
            message: `${upcomingEvents} eventos programados para os próximos 7 dias`,
            action: {
              label: 'Ver Agenda',
              onClick: () => window.location.href = '/events'
            },
            dismissible: true
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error('Erro ao verificar alertas:', error);
      }
    };

    checkForAlerts();
    
    // Recheck alerts every 5 minutes
    const interval = setInterval(checkForAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [getInventory, getMembers, getTransactions]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const getAlertIcon = (type: string) => {
    const icons = {
      warning: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />,
      info: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
      success: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      urgent: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
    };
    return icons[type as keyof typeof icons];
  };

  const getAlertClasses = (type: string) => {
    const classes = {
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      urgent: 'bg-red-50 border-red-200 text-red-800'
    };
    return classes[type as keyof typeof classes];
  };

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Tudo em Ordem</h3>
            <p className="text-xs sm:text-sm text-gray-600">Não há alertas no momento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-orange-50 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Alertas e Notificações</h3>
          <p className="text-xs sm:text-sm text-gray-600">{activeAlerts.length} alertas ativos</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              p-3 sm:p-4 rounded-lg border-l-4 border border-gray-200
              ${getAlertClasses(alert.type)}
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm truncate">{alert.title}</h4>
                  <p className="text-xs sm:text-sm mt-1 opacity-90 break-words">{alert.message}</p>
                  {alert.action && (
                    <button
                      onClick={alert.action.onClick}
                      className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium underline hover:no-underline focus:outline-none block"
                    >
                      {alert.action.label}
                    </button>
                  )}
                </div>
              </div>
              {alert.dismissible && (
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded-full focus:outline-none"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAlerts;
