import React, { useEffect, useState } from 'react';
import { Notification, NotificationSettings } from '../types';
import { NotificationContext, NotificationContextType } from './NotificationContext';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    systemUpdates: true,
    memberUpdates: true,
    financialAlerts: true,
    inventoryAlerts: true,
  });

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Manter máximo 50 notificações
    
    console.log('🔔 Nova notificação:', newNotification.title);
  };

  const addWelcomeNotifications = React.useCallback(() => {
    const welcomeNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[] = [
      {
        type: 'success',
        title: 'Sistema Configurado!',
        message: 'Upload de imagens para membros e sacramentos configurado com sucesso.',
        priority: 'high',
        category: 'system',
        actionUrl: '/members',
        actionLabel: 'Ver Membros'
      },
      {
        type: 'info',
        title: 'Bem-vindo ao CDM Admin',
        message: 'Sistema de administração da igreja está pronto para uso.',
        priority: 'medium',
        category: 'general'
      },
      {
        type: 'warning',
        title: 'Configurar Backup',
        message: 'Recomendamos configurar backup automático dos dados.',
        priority: 'medium',
        category: 'system'
      }
    ];

    welcomeNotifications.forEach(notification => {
      addNotification(notification);
    });
  }, []);

  // Carregar notificações do localStorage na inicialização
  useEffect(() => {
    const savedNotifications = localStorage.getItem('cdm-notifications');
    const savedSettings = localStorage.getItem('cdm-notification-settings');
    
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }

    // Adicionar notificações de boas-vindas na primeira vez
    if (!savedNotifications) {
      addWelcomeNotifications();
    }
  }, [addWelcomeNotifications]);

  // Salvar notificações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('cdm-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Salvar configurações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('cdm-notification-settings', JSON.stringify(settings));
  }, [settings]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Adicionar notificações automáticas baseadas em eventos do sistema
  useEffect(() => {
    const checkSystemStatus = () => {
      // Verificar estoque baixo (simulado)
      const lowStockItems = Math.floor(Math.random() * 3);
      if (lowStockItems > 0 && settings.inventoryAlerts) {
        addNotification({
          type: 'warning',
          title: 'Estoque Baixo',
          message: `${lowStockItems} item(ns) com estoque baixo precisam de atenção.`,
          priority: 'medium',
          category: 'inventory',
          actionUrl: '/inventory',
          actionLabel: 'Ver Estoque'
        });
      }

      // Verificar atualizações do sistema (simulado)
      if (Math.random() > 0.8 && settings.systemUpdates) {
        addNotification({
          type: 'info',
          title: 'Atualização Disponível',
          message: 'Nova versão do sistema CDM Admin disponível.',
          priority: 'low',
          category: 'system'
        });
      }
    };

    // Verificar status a cada 30 minutos
    const interval = setInterval(checkSystemStatus, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updateSettings,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
