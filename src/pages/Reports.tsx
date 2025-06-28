import { Calendar, DollarSign, Download, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChartComponent from '../components/dashboard/ChartComponent';
import Modal from '../components/ui/Modal';
import { useSupabase } from '../hooks/useSupabase';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 5)),
    end: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const { getMembers, getTransactions, getInventory } = useSupabase();

  // Configurações de dados dos gráficos
  const [chartData, setChartData] = useState({
    membership: {
      labels: [],
      datasets: [{
        label: 'Novos Membros',
        data: [],
        backgroundColor: 'rgba(0, 107, 166, 0.8)',
        borderColor: 'rgba(0, 107, 166, 1)',
        borderWidth: 2,
        tension: 0.4
      }]
    },
    finance: {
      labels: [],
      datasets: [
        {
          label: 'Dízimos',
          data: [],
          backgroundColor: 'rgba(234, 179, 8, 0.8)',
          borderColor: 'rgba(234, 179, 8, 1)',
          borderWidth: 2
        },
        {
          label: 'Ofertas',
          data: [],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2
        },
        {
          label: 'Doações',
          data: [],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2
        }
      ]
    },
    attendance: {
      labels: ['Domingo', 'Quarta', 'Sexta', 'Células'],
      datasets: [{
        label: 'Média de Presenças',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(0, 107, 166, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgba(0, 107, 166, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)'
        ],
        borderWidth: 1
      }]
    }
  });

  // Carrega os dados quando o componente é montado ou quando o intervalo de datas muda
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadReportData('membership'),
        loadReportData('finance'),
        loadReportData('attendance')
      ]);
    };
    loadData();
  }, [dateRange]);

  const loadReportData = async (reportType: string) => {
    setIsLoading(true);
    try {
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(dateRange.end);
        date.setMonth(date.getMonth() - (5 - i));
        return {
          label: date.toLocaleString('pt-BR', { month: 'short' }),
          year: date.getFullYear(),
          month: date.getMonth()
        };
      });

      if (reportType === 'membership') {
        const members = await getMembers();
        const monthlyCounts = new Array(6).fill(0);

        members.forEach(member => {
          const joinDate = new Date(member.join_date);
          const monthIndex = months.findIndex(m => 
            m.month === joinDate.getMonth() && 
            m.year === joinDate.getFullYear()
          );
          if (monthIndex !== -1) monthlyCounts[monthIndex]++;
        });

        setChartData(prev => ({
          ...prev,
          membership: {
            ...prev.membership,
            labels: months.map(m => m.label),
            datasets: [{
              ...prev.membership.datasets[0],
              data: monthlyCounts
            }]
          }
        }));
      }

      if (reportType === 'finance') {
        const transactions = await getTransactions();
        const categories = {
          Dízimo: new Array(6).fill(0),
          Oferta: new Array(6).fill(0),
          Doação: new Array(6).fill(0)
        };

        transactions.forEach(tx => {
          const txDate = new Date(tx.date);
          const monthIndex = months.findIndex(m => 
            m.month === txDate.getMonth() && 
            m.year === txDate.getFullYear()
          );
          if (monthIndex !== -1 && categories[tx.category]) {
            categories[tx.category][monthIndex] += Number(tx.amount);
          }
        });

        setChartData(prev => ({
          ...prev,
          finance: {
            labels: months.map(m => m.label),
            datasets: [
              { ...prev.finance.datasets[0], data: categories['Dízimo'] },
              { ...prev.finance.datasets[1], data: categories['Oferta'] },
              { ...prev.finance.datasets[2], data: categories['Doação'] }
            ]
          }
        }));
      }

      if (reportType === 'attendance') {
        const inventory = await getInventory();
        const types = ['Domingo', 'Quarta', 'Sexta', 'Células'];
        const averages = types.map(type => {
          const events = inventory.filter(e => e.type === type);
          const total = events.reduce((sum, e) => sum + (e.attendance || 0), 0);
          return events.length ? Math.round(total / events.length) : 0;
        });

        setChartData(prev => ({
          ...prev,
          attendance: {
            ...prev.attendance,
            datasets: [{
              ...prev.attendance.datasets[0],
              data: averages
            }]
          }
        }));
      }
    } catch (error) {
      console.error(`Erro ao carregar ${reportType}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Implementação real de download viria aqui
    alert(`Relatório de ${selectedReport} exportado com sucesso!`);
  };

  const reportCards = [
    {
      id: 'membership',
      icon: <Users size={20} />,
      title: 'Membros',
      description: 'Crescimento e estatísticas de membros',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-300'
    },
    {
      id: 'finance',
      icon: <DollarSign size={20} />,
      title: 'Finanças',
      description: 'Receitas e despesas da igreja',
      bgColor: 'bg-amber-100 dark:bg-amber-900',
      textColor: 'text-amber-600 dark:text-amber-300'
    },
    {
      id: 'attendance',
      icon: <Calendar size={20} />,
      title: 'Atendimento',
      description: 'Presenças em cultos e eventos',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900',
      textColor: 'text-emerald-600 dark:text-emerald-300'
    }
  ];

  return (
    <div className="animate-fade-in p-4 sm:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Relatórios Analíticos
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Visualize e exporte dados importantes da sua igreja
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 mb-6 sm:mb-8">
        {reportCards.map((card) => (
          <div 
            key={card.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 cursor-pointer"
            onClick={() => setSelectedReport(card.id)}
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} ${card.textColor} mr-3 sm:mr-4`}>
                {card.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {card.title}
              </h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
              {card.description}
            </p>
            <div className="h-32 sm:h-40">
              <ChartComponent
                chartData={chartData[card.id]}
                chartType={card.id === 'attendance' ? 'doughnut' : 'line'}
                hideTitle
              />
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Relatório de ${reportCards.find(c => c.id === selectedReport)?.title || ''}`}
        size="xl"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar size={16} className="mr-2" />
                  <span>Período:</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <DatePicker
                    selected={dateRange.start}
                    onChange={(date) => setDateRange({...dateRange, start: date})}
                    selectsStart
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">até</span>
                  <DatePicker
                    selected={dateRange.end}
                    onChange={(date) => setDateRange({...dateRange, end: date})}
                    selectsEnd
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    minDate={dateRange.start}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
              >
                <Download size={16} className="mr-2" />
                Exportar Relatório
              </button>
            </div>

            <div className="space-y-8">
              <ChartComponent
                title={
                  selectedReport === 'membership' ? 'Crescimento de Membros' :
                  selectedReport === 'finance' ? 'Distribuição de Receitas' :
                  'Média de Presenças'
                }
                chartData={chartData[selectedReport]}
                chartType={
                  selectedReport === 'attendance' ? 'doughnut' : 
                  selectedReport === 'finance' ? 'bar' : 'line'
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;