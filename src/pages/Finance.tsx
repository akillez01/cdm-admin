import React, { useState, useEffect } from 'react';
import { 
  DollarSign, CreditCard, TrendingUp, Wallet,
  PieChart, BarChart2, Download, Filter
} from 'lucide-react';
import TransactionList from '../components/finance/TransactionList';
import MetricsCard from '../components/dashboard/MetricsCard';
import ChartComponent from '../components/dashboard/ChartComponent';
import Modal from '../components/ui/Modal';
import { useSupabase } from '../hooks/useSupabase';
import { Transaction } from '../types';

const Finance: React.FC = () => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTransactions, addTransaction } = useSupabase();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setIsAddingTransaction(true);
  };

  const handleSubmitTransaction = async (data: Partial<Transaction>) => {
    try {
      await addTransaction({
        member_id: data.memberId,
        member_name: data.memberName,
        type: data.type as 'tithe' | 'offering' | 'donation' | 'expense',
        amount: data.amount!,
        date: new Date().toISOString(),
        category: data.category!,
        description: data.description,
        payment_method: data.paymentMethod as 'cash' | 'check' | 'card' | 'pix' | 'transfer',
      });
      await loadTransactions();
      setIsAddingTransaction(false);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Calculate financial metrics
  const totalRevenue = transactions
    .filter(t => t.type !== 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const balance = totalRevenue - totalExpenses;
  
  const tithesTotal = transactions
    .filter(t => t.type === 'tithe')
    .reduce((sum, t) => sum + Number(t.amount), 0);

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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Finanças
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie receitas, despesas e relatórios financeiros.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard
          title="Receitas Totais"
          value={totalRevenue}
          prefix="R$ "
          icon={<DollarSign size={20} className="text-success-500" />}
          iconBackground="bg-green-100 dark:bg-green-800"
        />
        
        <MetricsCard
          title="Despesas Totais"
          value={totalExpenses}
          prefix="R$ "
          icon={<CreditCard size={20} className="text-danger-500" />}
          iconBackground="bg-red-100 dark:bg-red-800"
        />
        
        <MetricsCard
          title="Saldo Atual"
          value={balance}
          prefix="R$ "
          icon={<Wallet size={20} className="text-info-500" />}
          iconBackground="bg-blue-100 dark:bg-blue-800"
        />
        
        <MetricsCard
          title="Total de Dízimos"
          value={tithesTotal}
          prefix="R$ "
          icon={<TrendingUp size={20} className="text-secondary-500" />}
          iconBackground="bg-secondary-100 dark:bg-secondary-800"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartComponent
            title="Receitas e Despesas"
            description="Comparativo dos últimos 6 meses"
            chartData={financeChartData}
            chartType="line"
          />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Relatórios Financeiros
          </h3>
          
          <div className="space-y-3">
            {[
              { name: 'Relatório Mensal', icon: <BarChart2 size={18} /> },
              { name: 'Relatório de Dízimos', icon: <PieChart size={18} /> },
              { name: 'Relatório Anual', icon: <BarChart2 size={18} /> },
              { name: 'Relatório de Categorias', icon: <PieChart size={18} /> },
            ].map((report, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-500 mr-3">
                  {report.icon}
                </div>
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-200">
                  {report.name}
                </span>
                <Download size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
          
          <button className="mt-4 w-full btn btn-outline">
            Gerar Novo Relatório
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <TransactionList
          transactions={transactions}
          onAddTransaction={handleAddTransaction}
        />
      </div>
      
      <Modal
        isOpen={isAddingTransaction}
        onClose={() => setIsAddingTransaction(false)}
        title="Nova Transação"
        size="lg"
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
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="form-label">Tipo</label>
              <select
                id="type"
                name="type"
                className="form-input"
                required
              >
                <option value="tithe">Dízimo</option>
                <option value="offering">Oferta</option>
                <option value="donation">Doação</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="form-label">Valor</label>
              <input
                type="number"
                id="amount"
                name="amount"
                className="form-input"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="form-label">Categoria</label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="form-input"
                required
              >
                <option value="cash">Dinheiro</option>
                <option value="check">Cheque</option>
                <option value="card">Cartão</option>
                <option value="pix">PIX</option>
                <option value="transfer">Transferência</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="memberName" className="form-label">Nome do Membro</label>
              <input
                type="text"
                id="memberName"
                name="memberName"
                className="form-input"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="form-label">Descrição</label>
              <textarea
                id="description"
                name="description"
                className="form-input h-24"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingTransaction(false)}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Finance;