import React, { useState, useEffect } from 'react';
import { 
  Users, DollarSign, CalendarDays, Package, 
  TrendingUp, ArrowUpRight, PieChart, BarChart2
} from 'lucide-react';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChartComponent from '../components/dashboard/ChartComponent';
import { useSupabase } from '../hooks/useSupabase';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalIncome: 0,
    upcomingEvents: 0,
    lowStockItems: 0,
  });

  const [membershipData, setMembershipData] = useState({
    labels: [],
    datasets: [{
      label: 'Novos Membros',
      data: [],
      backgroundColor: 'rgba(0, 59, 77, 0.7)',
    }],
  });

  const [financeData, setFinanceData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Receitas',
        data: [],
        borderColor: 'rgba(212, 175, 55, 0.7)',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
      },
      {
        label: 'Despesas',
        data: [],
        borderColor: 'rgba(239, 68, 68, 0.7)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
    ],
  });

  const [attendanceData, setAttendanceData] = useState({
    labels: ['Domingo', 'Quarta', 'Sexta', 'Células', 'Jovens'],
    datasets: [{
      label: 'Presenças',
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(0, 59, 77, 0.8)',
        'rgba(212, 175, 55, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
    }],
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const { supabase, getMembers, getInventory, getTransactions } = useSupabase();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load members data
      const members = await getMembers();
      const totalMembers = members.length;
      const newMembersThisMonth = members.filter(member => {
        const joinDate = new Date(member.join_date);
        const today = new Date();
        return joinDate.getMonth() === today.getMonth() && 
               joinDate.getFullYear() === today.getFullYear();
      }).length;

      // Load financial data
      const transactions = await getTransactions();
      const totalIncome = transactions
        .filter(t => t.type !== 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Load inventory data
      const inventory = await getInventory();
      const lowStockItems = inventory.filter(item => item.status === 'low').length;

      // Update stats
      setStats({
        totalMembers,
        totalIncome,
        upcomingEvents: 0, // To be implemented with events
        lowStockItems,
      });

      // Update charts data
      updateChartsData(transactions, members);

      // Update recent activities
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const recentMembers = members
        .sort((a, b) => new Date(b.join_date).getTime() - new Date(a.join_date).getTime())
        .slice(0, 5);

      const recentInventoryChanges = inventory
        .filter(item => item.status === 'low')
        .slice(0, 5);

      setRecentActivities([
        ...recentTransactions.map(t => ({
          type: 'transaction',
          data: t,
          date: new Date(t.date),
        })),
        ...recentMembers.map(m => ({
          type: 'member',
          data: m,
          date: new Date(m.join_date),
        })),
        ...recentInventoryChanges.map(i => ({
          type: 'inventory',
          data: i,
          date: new Date(i.updated_at),
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateChartsData = (transactions: any[], members: any[]) => {
    // Get last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        label: date.toLocaleString('pt-BR', { month: 'short' }),
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    }).reverse();

    // Calculate monthly totals
    const monthlyIncome = new Array(6).fill(0);
    const monthlyExpenses = new Array(6).fill(0);
    const monthlyNewMembers = new Array(6).fill(0);

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = months.findIndex(m => 
        m.month === transactionDate.getMonth() && 
        m.year === transactionDate.getFullYear()
      );

      if (monthIndex !== -1) {
        if (transaction.type === 'expense') {
          monthlyExpenses[monthIndex] += Number(transaction.amount);
        } else {
          monthlyIncome[monthIndex] += Number(transaction.amount);
        }
      }
    });

    members.forEach(member => {
      const joinDate = new Date(member.join_date);
      const monthIndex = months.findIndex(m => 
        m.month === joinDate.getMonth() && 
        m.year === joinDate.getFullYear()
      );

      if (monthIndex !== -1) {
        monthlyNewMembers[monthIndex]++;
      }
    });

    setFinanceData({
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Receitas',
          data: monthlyIncome,
          borderColor: 'rgba(212, 175, 55, 0.7)',
          backgroundColor: 'rgba(212, 175, 55, 0.2)',
        },
        {
          label: 'Despesas',
          data: monthlyExpenses,
          borderColor: 'rgba(239, 68, 68, 0.7)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
        },
      ],
    });

    setMembershipData({
      labels: months.map(m => m.label),
      datasets: [{
        label: 'Novos Membros',
        data: monthlyNewMembers,
        backgroundColor: 'rgba(0, 59, 77, 0.7)',
      }],
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutos atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} horas atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} dias atrás`;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Visão geral da igreja e métricas importantes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard
          title="Total de Membros"
          value={stats.totalMembers}
          icon={<Users size={20} className="text-primary-500" />}
          iconBackground="bg-primary-100 dark:bg-primary-800"
        />
        
        <MetricsCard
          title="Receitas Mensais"
          value={stats.totalIncome}
          prefix="R$ "
          icon={<DollarSign size={20} className="text-secondary-500" />}
          iconBackground="bg-secondary-100 dark:bg-secondary-800"
        />
        
        <MetricsCard
          title="Eventos Futuros"
          value={stats.upcomingEvents}
          icon={<CalendarDays size={20} className="text-info-500" />}
          iconBackground="bg-blue-100 dark:bg-blue-800"
        />
        
        <MetricsCard
          title="Itens com Estoque Baixo"
          value={stats.lowStockItems}
          icon={<Package size={20} className="text-warning-500" />}
          iconBackground="bg-yellow-100 dark:bg-yellow-800"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartComponent
          title="Receitas e Despesas"
          description="Comparativo dos últimos 6 meses"
          chartData={financeData}
          chartType="line"
        />
        
        <ChartComponent
          title="Crescimento de Membros"
          description="Novos membros nos últimos 6 meses"
          chartData={membershipData}
          chartType="bar"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartComponent
          title="Presenças por Evento"
          description="Média de presenças por tipo de evento"
          chartData={attendanceData}
          chartType="doughnut"
          className="lg:col-span-1"
        />
        
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Atividades Recentes
          </h3>
          
          <div className="space-y-4">
            {recentActivities.map((activity: any, index: number) => {
              let icon;
              let color;
              let title;
              let description;

              switch (activity.type) {
                case 'transaction':
                  icon = activity.data.type === 'expense' ? 
                    <DollarSign size={16} /> : 
                    <TrendingUp size={16} />;
                  color = activity.data.type === 'expense' ? 
                    'bg-red-100 text-red-500 dark:bg-red-800' : 
                    'bg-green-100 text-green-500 dark:bg-green-800';
                  title = activity.data.type === 'expense' ? 
                    'Nova despesa registrada' : 
                    'Nova receita registrada';
                  description = `${activity.data.description || activity.data.category} - R$ ${activity.data.amount}`;
                  break;
                case 'member':
                  icon = <Users size={16} />;
                  color = 'bg-primary-100 text-primary-500 dark:bg-primary-800';
                  title = 'Novo membro registrado';
                  description = `${activity.data.first_name} ${activity.data.last_name}`;
                  break;
                case 'inventory':
                  icon = <Package size={16} />;
                  color = 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800';
                  title = 'Alerta de estoque';
                  description = `${activity.data.name} está com estoque baixo`;
                  break;
                default:
                  return null;
              }

              return (
                <div key={index} className="flex">
                  <div className={`p-2 rounded-full ${color} mr-3`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatTimeAgo(activity.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="mt-4 text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center">
            Ver todas as atividades
            <ArrowUpRight size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;