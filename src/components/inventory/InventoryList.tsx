import React, { useState } from 'react';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../types';

interface InventoryListProps {
  items: InventoryItem[];
  onAddItem: () => void;
  onEditItem: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onAddItem,
  onEditItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'badge-success';
      case 'low':
        return 'badge-warning';
      case 'depleted':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'low':
        return 'Baixo';
      case 'depleted':
        return 'Esgotado';
      default:
        return status;
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
            Inventário
          </h2>
          <button
            onClick={onAddItem}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Item
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar itens..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input w-full"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-full"
            >
              <option value="all">Todos os Status</option>
              <option value="available">Disponível</option>
              <option value="low">Baixo</option>
              <option value="depleted">Esgotado</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Categoria</th>
              <th scope="col">Quantidade</th>
              <th scope="col">Localização</th>
              <th scope="col">Valor</th>
              <th scope="col">Status</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      {item.status === 'low' && (
                        <AlertTriangle size={16} className="text-warning-500 mr-2" />
                      )}
                      {item.quantity}
                      {item.minQuantity && (
                        <span className="text-xs text-gray-400 ml-1">
                          (min: {item.minQuantity})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-primary-500 hover:text-primary-600 mr-3"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum item encontrado com os filtros atuais.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-medium">{filteredItems.length}</span> de{' '}
          <span className="font-medium">{items.length}</span> itens
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

export default InventoryList;