import {
  Calendar,
  DollarSign,
  Download,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
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

  const [membershipGrowthData, setMembershipGrowthData] = useState({
    labels: [],
    datasets: [{
      label: 'Novos Membros',
      data: [],
      backgroundColor: 'rgba(0, 59, 77, 0.7)',
    }],
  });

  const [financialData, setFinancialData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Dízimos',
        data: [],
        backgroundColor: 'rgba(212, 175, 55, 0.7)',
      },
      {
        label: 'Ofertas',
        data: [],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
      {
        label: 'Doações',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  });

  const [attendanceData, setAttendanceData] = useState({
    labels: ['Domingo', 'Quarta', 'Sexta', 'Células'],
    datasets: [{
      label: 'Média de Presenças',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(0, 59, 77, 0.8)',
        'rgba(212, 175, 55, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
    }],
  });

  // Carrega todos os gráficos ao abrir a página
  useEffect(() => {
    loadReportData('members');
    loadReportData('finance');
    loadReportData('attendance');
    // eslint-disable-next-line
  }, [dateRange.start, dateRange.end]);

  const loadReportData = async (reportType: string) => {
    setIsLoading(true);
    try {
      const months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(dateRange.end);
        date.setMonth(date.getMonth() - (5 - i));
        return {
          label: date.toLocaleString('pt-BR', { month: 'short' }),
          year: date.getFullYear(),
          month: date.getMonth(),
        };
      });

      if (reportType === 'members') {
        const members = await getMembers();
        const monthlyNewMembers = new Array(6).fill(0);

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

        setMembershipGrowthData({
          labels: months.map(m => m.label),
          datasets: [{
            label: 'Novos Membros',
            data: monthlyNewMembers,
            backgroundColor: 'rgba(0, 59, 77, 0.7)',
          }],
        });
      }

      if (reportType === 'finance') {
        const transactions = await getTransactions();
        const dizimos = new Array(6).fill(0);
        const ofertas = new Array(6).fill(0);
        const doacoes = new Array(6).fill(0);

        transactions.forEach(tx => {
          const txDate = new Date(tx.date);
          const monthIndex = months.findIndex(m =>
            m.month === txDate.getMonth() &&
            m.year === txDate.getFullYear()
          );
          if (monthIndex !== -1) {
            if (tx.category === 'Dízimo') dizimos[monthIndex] += Number(tx.amount);
            else if (tx.category === 'Oferta') ofertas[monthIndex] += Number(tx.amount);
            else if (tx.category === 'Doação') doacoes[monthIndex] += Number(tx.amount);
          }
        });

        setFinancialData({
          labels: months.map(m => m.label),
          datasets: [
            {
              label: 'Dízimos',
              data: dizimos,
              backgroundColor: 'rgba(212, 175, 55, 0.7)',
            },
            {
              label: 'Ofertas',
              data: ofertas,
              backgroundColor: 'rgba(16, 185, 129, 0.7)',
            },
            {
              label: 'Doações',
              data: doacoes,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
          ],
        });
      }

      if (reportType === 'attendance') {
        const inventory = await getInventory();
        const tipos = ['Domingo', 'Quarta', 'Sexta', 'Células'];
        const presencas = tipos.map(tipo =>
          inventory.filter(e => e.type === tipo).reduce((sum, e) => sum + (e.attendance || 0), 0)
        );
        setAttendanceData({
          labels: tipos,
          datasets: [{
            label: 'Média de Presenças',
            data: presencas,
            backgroundColor: [
              'rgba(0, 59, 77, 0.8)',
              'rgba(212, 175, 55, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
            ],
          }],
        });
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    alert(`Relatório gerado com sucesso!`);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Relatórios
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gere relatórios detalhados sobre membros, finanças e atividades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 mr-3">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Relatório de Membros
            </h3>
          </div>
          <div className="h-40">
            <ChartComponent
              chartData={membershipGrowthData}
              chartType="bar"
              hideTitle
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-500 mr-3">
              <DollarSign size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Relatório Financeiro
            </h3>
          </div>
          <div className="h-40">
            <ChartComponent
              chartData={financialData}
              chartType="bar"
              hideTitle
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-info-100 dark:bg-info-800 text-info-500 mr-3">
              <Calendar size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Relatório de Atividades
            </h3>
          </div>
          <div className="h-40">
            <ChartComponent
              chartData={attendanceData}
              chartType="doughnut"
              hideTitle
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={`Relatório de ${selectedReport}`}
        size="xl"
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Selecionar Período:</span>
                </div>
                <input 
                  type="date" 
                  className="form-input"
                  value={dateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange({...dateRange, start: new Date(e.target.value)})}
                />
                <span>até</span>
                <input 
                  type="date" 
                  className="form-input"
                  value={dateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange({...dateRange, end: new Date(e.target.value)})}
                />
              </div>
              <button 
                onClick={handleDownload}
                className="btn btn-primary flex items-center"
              >
                <Download size={16} className="mr-2" />
                Exportar
              </button>
            </div>

            {selectedReport === 'members' && (
              <div className="space-y-8">
                <ChartComponent
                  title="Crescimento de Membros"
                  chartData={membershipGrowthData}
                  chartType="line"
                />
              </div>
            )}

            {selectedReport === 'finance' && (
              <div className="space-y-8">
                <ChartComponent
                  title="Distribuição de Receitas"
                  chartData={financialData}
                  chartType="bar"
                />
              </div>
            )}

            {selectedReport === 'attendance' && (
              <div className="space-y-8">
                <ChartComponent
                  title="Média de Presenças"
                  chartData={attendanceData}
                  chartType="doughnut"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports;