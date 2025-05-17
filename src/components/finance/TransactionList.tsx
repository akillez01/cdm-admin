import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onAddTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      (transaction.memberName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'tithe':
      case 'offering':
      case 'donation':
        return <ArrowUp size={16} className="text-success-500" />;
      case 'expense':
        return <ArrowDown size={16} className="text-danger-500" />;
      default:
        return null;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'tithe':
        return 'Dízimo';
      case 'offering':
        return 'Oferta';
      case 'donation':
        return 'Doação';
      case 'expense':
        return 'Despesa';
      default:
        return type;
    }
  };

  const getTransactionTypeClass = (type: string) => {
    switch (type) {
      case 'tithe':
      case 'offering':
      case 'donation':
        return 'badge-success';
      case 'expense':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
            Transações Financeiras
          </h2>
          <button
            onClick={onAddTransaction}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Nova Transação
          </button>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">Todos os Tipos</option>
              <option value="tithe">Dízimos</option>
              <option value="offering">Ofertas</option>
              <option value="donation">Doações</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Tipo</th>
              <th scope="col">Membro</th>
              <th scope="col">Categoria</th>
              <th scope="col">Valor</th>
              <th scope="col">Forma de Pagamento</th>
              <th scope="col">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTransactionTypeIcon(transaction.type)}
                      <span className={`badge ml-2 ${getTransactionTypeClass(transaction.type)}`}>
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transaction.memberName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'expense' 
                      ? 'text-danger-500' 
                      : 'text-success-500'
                  }`}>
                    {transaction.type === 'expense' ? '- ' : '+ '}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{transaction.paymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {transaction.description || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma transação encontrada com os filtros atuais.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-medium">{filteredTransactions.length}</span> de{' '}
          <span className="font-medium">{transactions.length}</span> transações
        </div>
        
        <div className="flex space-x-1">
          <button
            disabled
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <button className="px-3 py-1 bg-primary-500 text-white rounded-md">1</button>
          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;