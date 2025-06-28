import {
    BarChart2,
    CreditCard,
    DollarSign,
    Download,
    PieChart,
    TrendingUp,
    Wallet
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ChartComponent from '../components/dashboard/ChartComponent';
import MetricsCard from '../components/dashboard/MetricsCard';
import TransactionList from '../components/finance/TransactionList';
import Autocomplete from '../components/ui/Autocomplete';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { useSupabase } from '../hooks/useSupabase';
import { Member, Transaction } from '../types';

const Finance: React.FC = () => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const { getTransactions, addTransaction, getMembers } = useSupabase();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, membersData] = await Promise.all([
          getTransactions(),
          getMembers()
        ]);
        setTransactions(transactionsData);
        setMembers(membersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [getTransactions, getMembers]);

  const handleAddTransaction = () => {
    setIsAddingTransaction(true);
    setSelectedMemberId(''); // Reset selected member when opening modal
  };

  const handleCloseModal = () => {
    setIsAddingTransaction(false);
    setSelectedMemberId(''); // Reset selected member when closing modal
  };

  const handleSubmitTransaction = async (data: Partial<Transaction>) => {
    try {
      const selectedMember = members.find(m => m.id === selectedMemberId);
      await addTransaction({
        member_id: selectedMemberId || undefined,
        member_name: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : data.memberName,
        type: data.type as 'tithe' | 'offering' | 'donation' | 'expense',
        amount: data.amount!,
        date: new Date().toISOString(),
        category: data.category!,
        description: data.description,
        payment_method: data.paymentMethod as 'cash' | 'check' | 'card' | 'pix' | 'transfer',
      });
      const updatedTransactions = await getTransactions();
      setTransactions(updatedTransactions);
      setIsAddingTransaction(false);
      setSelectedMemberId('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Calculate financial metrics
  const financialMetrics = {
    totalRevenue: transactions
      .filter(t => t.type !== 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0),
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0),
    balance: 0, // Will be calculated below
    tithesTotal: transactions
      .filter(t => t.type === 'tithe')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  };
  financialMetrics.balance = financialMetrics.totalRevenue - financialMetrics.totalExpenses;

  // Prepare chart data
  const financeChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receitas',
        data: [10500, 11200, 9800, 12500, 10800, 11500],
        borderColor: 'rgba(212, 175, 55, 0.7)',
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
      },
      {
        label: 'Despesas',
        data: [7800, 8100, 7500, 8300, 7900, 8200],
        borderColor: 'rgba(239, 68, 68, 0.7)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
    ],
  };

  // Prepare member options for autocomplete
  const memberOptions = members.map(member => ({
    id: member.id,
    label: `${member.firstName} ${member.lastName}`,
    value: member.id
  }));

  const reportTypes = [
    { name: 'Relatório Mensal', icon: <BarChart2 size={18} /> },
    { name: 'Relatório de Mensalidades', icon: <PieChart size={18} /> },
    { name: 'Relatório Anual', icon: <BarChart2 size={18} /> },
    { name: 'Relatório de Categorias', icon: <PieChart size={18} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 sm:p-6">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2 font-display">
          Finanças
        </h1>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Gerencie receitas, despesas e relatórios financeiros
        </p>
      </header>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-6 sm:mb-8">
        <MetricsCard
          title="Receitas Totais"
          value={financialMetrics.totalRevenue}
          prefix="R$ "
          icon={<DollarSign size={18} className="text-green-500" />}
          iconBackground="bg-green-100 dark:bg-green-800"
        />
        
        <MetricsCard
          title="Despesas Totais"
          value={financialMetrics.totalExpenses}
          prefix="R$ "
          icon={<CreditCard size={18} className="text-red-500" />}
          iconBackground="bg-red-100 dark:bg-red-800"
        />
        
        <MetricsCard
          title="Saldo Atual"
          value={financialMetrics.balance}
          prefix="R$ "
          icon={<Wallet size={18} className="text-blue-500" />}
          iconBackground="bg-blue-100 dark:bg-blue-800"
        />
        
        <MetricsCard
          title="Total de Mensalidades"
          value={financialMetrics.tithesTotal}
          prefix="R$ "
          icon={<TrendingUp size={18} className="text-amber-500" />}
          iconBackground="bg-amber-100 dark:bg-amber-800"
        />
      </div>

      {/* Charts and Reports Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <ChartComponent
            title="Receitas e Despesas"
            description="Comparativo dos últimos 6 meses"
            chartData={financeChartData}
            chartType="line"
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Relatórios Financeiros
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reportTypes.map((report, index) => (
              <div 
                key={index}
                className="flex items-center p-2 sm:p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="p-1 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 mr-2 sm:mr-3">
                  {report.icon}
                </div>
                <span className="flex-1 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                  {report.name}
                </span>
                <Download size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Gerar Novo Relatório
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mb-4 sm:mb-6">
        <TransactionList
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
        />
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddingTransaction}
        onClose={handleCloseModal}
        title="Nova Transação"
        size="md"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmitTransaction({
            type: formData.get('type') as Transaction['type'],
            amount: Number(formData.get('amount')),
            category: formData.get('category') as string,
            description: formData.get('description') as string,
            paymentMethod: formData.get('paymentMethod') as Transaction['paymentMethod'],
            memberName: formData.get('memberName') as string,
          });
        }} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="tithe">Dízimo</option>
                <option value="offering">Oferta</option>
                <option value="donation">Doação</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Forma de Pagamento
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione uma forma</option>
                <option value="cash">Dinheiro</option>
                <option value="check">Cheque</option>
                <option value="card">Cartão</option>
                <option value="pix">PIX</option>
                <option value="transfer">Transferência</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Membro (opcional)
              </label>
              <Autocomplete
                id="memberName"
                name="memberName"
                placeholder="Digite o nome do membro..."
                options={memberOptions}
                onChange={(value) => setSelectedMemberId(value)}
                noOptionsText="Nenhum membro encontrado"
                clearable
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Salvar Transação
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Finance;