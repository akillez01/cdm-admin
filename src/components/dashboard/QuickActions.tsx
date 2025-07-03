import {
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Package,
    Plus,
    UserPlus
} from 'lucide-react';
import React, { useState } from 'react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: 'primary' | 'success' | 'warning' | 'info';
  description: string;
}

const QuickActions: React.FC = () => {
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const handleQuickAction = async (actionId: string, action: () => void) => {
    setIsExecuting(actionId);
    try {
      await action();
      // addNotification('Ação executada com sucesso!', 'success');
    } catch {
      // addNotification('Erro ao executar ação', 'error');
    } finally {
      setIsExecuting(null);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-member',
      label: 'Novo Membro',
      icon: <UserPlus className="w-5 h-5" />,
      action: () => {
        // Navegar para página de membros com modal aberto
        window.location.href = '/members?action=new';
      },
      color: 'primary',
      description: 'Cadastrar novo membro'
    },
    {
      id: 'add-transaction',
      label: 'Nova Transação',
      icon: <DollarSign className="w-5 h-5" />,
      action: () => {
        window.location.href = '/finance?action=new';
      },
      color: 'success',
      description: 'Registrar dízimo, oferta ou doação'
    },
    {
      id: 'add-inventory',
      label: 'Adicionar Item',
      icon: <Package className="w-5 h-5" />,
      action: () => {
        window.location.href = '/inventory?action=new';
      },
      color: 'info',
      description: 'Adicionar item ao inventário'
    },
    {
      id: 'create-event',
      label: 'Novo Evento',
      icon: <Calendar className="w-5 h-5" />,
      action: () => {
        window.location.href = '/events?action=new';
      },
      color: 'warning',
      description: 'Criar novo evento ou culto'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-primary-50 border-primary-200 hover:bg-primary-100 text-primary-700',
      success: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
      warning: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 text-yellow-700',
      info: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Plus className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          <p className="text-xs sm:text-sm text-gray-600">Acesso direto às principais funcionalidades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.id, action.action)}
            disabled={isExecuting === action.id}
            className={`
              p-3 sm:p-4 rounded-lg border-2 transition-all duration-200
              ${getColorClasses(action.color)}
              ${isExecuting === action.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {isExecuting === action.id ? (
                  <Clock className="w-5 h-5 animate-spin" />
                ) : (
                  action.icon
                )}
              </div>
              <div className="text-left flex-1">
                <div className="font-medium text-sm sm:text-base">{action.label}</div>
                <div className="text-xs sm:text-sm opacity-75 mt-1">{action.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Ações de urgência/status */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status do Sistema</h4>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs sm:text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Sistema Online</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>Backup Automático Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
