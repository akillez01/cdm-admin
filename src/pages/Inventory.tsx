import { AlertTriangle, Droplets, Package, ShoppingCart } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import MetricsCard from '../components/dashboard/MetricsCard';
import DaimeForm from '../components/inventory/DaimeForm';
import InventoryForm from '../components/inventory/InventoryForm';
import InventoryList from '../components/inventory/InventoryList';
import Modal from '../components/ui/Modal';
import { useDataProvider } from '../hooks/useDataProvider';
import { DaimeInventoryInsert, DaimeInventoryItem, InventoryItem } from '../types';

const Inventory: React.FC = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Santo Daime inventory states
  const [isAddingDaime, setIsAddingDaime] = useState(false);
  const [selectedDaime, setSelectedDaime] = useState<DaimeInventoryItem | null>(null);
  const [daimeInventory, setDaimeInventory] = useState<DaimeInventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'geral' | 'daime'>('geral');
  const [isViewingDaime, setIsViewingDaime] = useState(false);
  
  const { 
    getInventory, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem,
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem
  } = useDataProvider();

  const loadInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInventory() as InventoryItem[];
      setInventory(data);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getInventory]);

  const loadDaimeInventory = useCallback(async () => {
    try {
      const data = await getDaimeInventory() as DaimeInventoryItem[];
      setDaimeInventory(data);
    } catch (error) {
      console.error('Erro ao carregar inventário do Daime:', error);
      // Fallback para dados mock em caso de erro
      const mockDaimeData: DaimeInventoryItem[] = [
        {
          id: '1',
          codigo: 'DM001',
          graduacao: 'Força 3',
          litros: 15.5,
          dataFeitio: '2024-12-15',
          responsavelFeitio: 'Padrinho João',
          localFeitio: 'Casa de Feitio - Núcleo Central',
          tipoFeitio: 'Concentração',
          panela: 'Panela 1',
          observacoes: 'Feitio realizado com jagube do Rio Jordão',
          status: 'disponivel',
          localArmazenamento: 'Despensa Principal - Prateleira A',
          temperatura: 18,
          ph: 3.2,
          cor: 'Marrom',
          consistencia: 'Densa',
          created_at: '2024-12-15T10:00:00Z'
        },
        {
          id: '2',
          codigo: 'DM002', 
          graduacao: 'Força 4',
          litros: 8.2,
          dataFeitio: '2024-11-28',
          responsavelFeitio: 'Madrinha Maria',
          localFeitio: 'Casa de Feitio - Núcleo Norte',
          tipoFeitio: 'Novo',
          panela: 'Panela 2',
          observacoes: 'Primeira força do ano, muito concentrada',
          status: 'reservado',
          localArmazenamento: 'Despensa Principal - Prateleira B', 
          temperatura: 16,
          ph: 3.1,
          cor: 'Marrom Escuro',
          consistencia: 'Muito Densa',
          created_at: '2024-11-28T14:30:00Z'
        }
      ];
      setDaimeInventory(mockDaimeData);
    }
  }, [getDaimeInventory]);

  useEffect(() => {
    const loadData = async () => {
      await loadInventory();
      await loadDaimeInventory();
    };
    loadData();
  }, [loadInventory, loadDaimeInventory]);

  const handleAddItem = () => {
    setIsAddingItem(true);
    setSelectedItem(null);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAddingItem(true);
  };

  const handleCloseModal = () => {
    setIsAddingItem(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este item?')) {
      try {
        await deleteInventoryItem(id);
        await loadInventory();
        handleCloseModal();
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item!');
      }
    }
  };

  const handleSubmit = async (data: Partial<InventoryItem>) => {
    try {
      if (selectedItem) {
        await updateInventoryItem(selectedItem.id, {
          name: data.name,
          category: data.category,
          quantity: data.quantity,
          location: data.location,
          value: data.value,
          supplier: data.supplier,
          purchase_date: data.purchaseDate,
          min_quantity: data.minQuantity,
          status: data.status as 'available' | 'low' | 'depleted',
          notes: data.notes,
        });
      } else {
        await addInventoryItem({
          name: data.name!,
          category: data.category!,
          quantity: data.quantity!,
          location: data.location!,
          value: data.value!,
          supplier: data.supplier,
          purchase_date: data.purchaseDate,
          min_quantity: data.minQuantity,
          status: data.status as 'available' | 'low' | 'depleted',
          notes: data.notes,
        });
      }
      await loadInventory();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  // Daime inventory functions
  const handleAddDaime = () => {
    setSelectedDaime(null);
    setIsAddingDaime(true);
  };

  const handleEditDaime = (item: DaimeInventoryItem) => {
    setSelectedDaime(item);
    setIsAddingDaime(true);
  };

  const handleCloseDaimeModal = () => {
    setIsAddingDaime(false);
    setSelectedDaime(null);
  };

  const handleDaimeSubmit = async (data: Partial<DaimeInventoryItem>) => {
    try {
      if (selectedDaime) {
        // Update existing item
        await updateDaimeInventoryItem(selectedDaime.id, data);
      } else {
        // Add new item
        await addDaimeInventoryItem(data as DaimeInventoryInsert);
      }
      await loadDaimeInventory();
      handleCloseDaimeModal();
    } catch (error) {
      console.error('Erro ao salvar sacramento:', error);
      throw error;
    }
  };

  const handleDeleteDaime = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro de sacramento?')) {
      try {
        await deleteDaimeInventoryItem(id);
        await loadDaimeInventory();
      } catch (error) {
        console.error('Erro ao excluir sacramento:', error);
        alert('Erro ao excluir sacramento!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Calculate inventory metrics
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
  const lowStockItems = inventory.filter(item => item.status === 'low').length;
  const categories = new Set(inventory.map(item => item.category)).size;

  // Calculate Daime inventory metrics
  const totalDaimeLitros = daimeInventory.reduce((sum, item) => sum + item.litros, 0);
  const daimePorGraduacao = daimeInventory.reduce((acc, item) => {
    acc[item.graduacao] = (acc[item.graduacao] || 0) + item.litros;
    return acc;
  }, {} as Record<string, number>);
  const daimeDisponivel = daimeInventory.filter(item => item.status === 'disponivel').length;
  const daimeReservado = daimeInventory.filter(item => item.status === 'reservado').length;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Inventário
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie o controle de estoque, equipamentos e sacramento.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('geral')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'geral'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Inventário Geral
          </button>
          <button
            onClick={() => setActiveTab('daime')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'daime'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Droplets size={16} className="inline mr-2" />
            Sacramento do Daime
          </button>
        </nav>
      </div>

      {activeTab === 'geral' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total de Itens"
              value={totalItems}
              icon={<Package size={20} className="text-primary-500" />}
              iconBackground="bg-primary-100 dark:bg-primary-800"
            />
            
            <MetricsCard
              title="Valor Total"
              value={totalValue}
              prefix="R$ "
              icon={<ShoppingCart size={20} className="text-secondary-500" />}
              iconBackground="bg-secondary-100 dark:bg-secondary-800"
            />
            
            <MetricsCard
              title="Itens com Estoque Baixo"
              value={lowStockItems}
              icon={<AlertTriangle size={20} className="text-warning-500" />}
              iconBackground="bg-yellow-100 dark:bg-yellow-800"
            />
            
            <MetricsCard
              title="Categorias"
              value={categories}
              icon={<Package size={20} className="text-info-500" />}
              iconBackground="bg-blue-100 dark:bg-blue-800"
            />
          </div>
          
          <div className="mb-6">
            <InventoryList
              items={inventory}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
            />
          </div>
        </>
      )}

      {activeTab === 'daime' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total de Litros"
              value={totalDaimeLitros}
              suffix=" L"
              icon={<Droplets size={20} className="text-blue-500" />}
              iconBackground="bg-blue-100 dark:bg-blue-800"
            />
            
            <MetricsCard
              title="Disponível"
              value={daimeDisponivel}
              suffix=" lotes"
              icon={<Package size={20} className="text-green-500" />}
              iconBackground="bg-green-100 dark:bg-green-800"
            />
            
            <MetricsCard
              title="Reservado"
              value={daimeReservado}
              suffix=" lotes"
              icon={<AlertTriangle size={20} className="text-yellow-500" />}
              iconBackground="bg-yellow-100 dark:bg-yellow-800"
            />
            
            <MetricsCard
              title="Graduações"
              value={Object.keys(daimePorGraduacao).length}
              icon={<Package size={20} className="text-purple-500" />}
              iconBackground="bg-purple-100 dark:bg-purple-800"
            />
          </div>

          {/* Daime Inventory Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
                  Inventário do Sacramento
                </h2>
                <button
                  onClick={handleAddDaime}
                  className="btn btn-primary flex items-center"
                >
                  <Droplets size={16} className="mr-1" />
                  Registrar Sacramento
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Graduação</th>
                    <th scope="col">Litros</th>
                    <th scope="col">Data Feitio</th>
                    <th scope="col">Responsável</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Status</th>
                    <th scope="col">Local</th>
                    <th scope="col" className="relative">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {daimeInventory.length > 0 ? (
                    daimeInventory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800 dark:text-white">
                            {item.codigo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.graduacao === 'Força 5' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                            item.graduacao === 'Força 4' ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' :
                            item.graduacao === 'Força 3' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                            item.graduacao === 'Força 2' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                            'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          }`}>
                            {item.graduacao}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.litros}L
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.dataFeitio).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.responsavelFeitio}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.tipoFeitio}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'disponivel' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                            item.status === 'reservado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                            item.status === 'consumido' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' :
                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {item.status === 'disponivel' ? 'Disponível' :
                             item.status === 'reservado' ? 'Reservado' :
                             item.status === 'consumido' ? 'Consumido' : 'Vencido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.localArmazenamento}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDaime(item);
                                setIsViewingDaime(true);
                              }}
                              className="text-primary-500 hover:text-primary-600"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleEditDaime(item)}
                              className="text-secondary-500 hover:text-secondary-600"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteDaime(item.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          Nenhum registro de sacramento encontrado.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      {/* General Inventory Modal */}
      <Modal
        isOpen={isAddingItem}
        onClose={handleCloseModal}
        title={selectedItem ? 'Editar Item' : 'Novo Item'}
        size="lg"
      >
        <InventoryForm
          item={selectedItem || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
        {selectedItem && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleDeleteItem(selectedItem.id)}
              className="btn btn-danger"
            >
              Excluir
            </button>
          </div>
        )}
      </Modal>

      {/* Daime Inventory Modal */}
      <Modal
        isOpen={isAddingDaime}
        onClose={handleCloseDaimeModal}
        title={selectedDaime ? 'Editar Sacramento' : 'Registrar Novo Sacramento'}
        size="xl"
      >
        <DaimeForm
          item={selectedDaime || undefined}
          onSubmit={handleDaimeSubmit}
          onCancel={handleCloseDaimeModal}
        />
      </Modal>

      {/* Daime Details Modal */}
      <Modal
        isOpen={isViewingDaime && selectedDaime !== null}
        onClose={() => {
          setIsViewingDaime(false);
          setSelectedDaime(null);
        }}
        title="Detalhes do Sacramento"
        size="xl"
      >
        {selectedDaime && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Graduação
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedDaime.graduacao === 'Força 5' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                  selectedDaime.graduacao === 'Força 4' ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' :
                  selectedDaime.graduacao === 'Força 3' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                  selectedDaime.graduacao === 'Força 2' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                }`}>
                  {selectedDaime.graduacao}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantidade
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.litros}L</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data do Feitio
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(selectedDaime.dataFeitio).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsável
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.responsavelFeitio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local do Feitio
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.localFeitio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Feitio
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.tipoFeitio}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Panela
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.panela || 'Não informado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedDaime.status === 'disponivel' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                  selectedDaime.status === 'reservado' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                  selectedDaime.status === 'consumido' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100' :
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {selectedDaime.status === 'disponivel' ? 'Disponível' :
                   selectedDaime.status === 'reservado' ? 'Reservado' :
                   selectedDaime.status === 'consumido' ? 'Consumido' : 'Vencido'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Local de Armazenamento
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedDaime.localArmazenamento || 'Não informado'}
                </p>
              </div>
              {selectedDaime.temperatura && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperatura
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.temperatura}°C</p>
                </div>
              )}
              {selectedDaime.ph && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    pH
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.ph}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cor
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.cor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Consistência
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.consistencia}</p>
              </div>
            </div>
            
            {selectedDaime.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observações
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedDaime.observacoes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleEditDaime(selectedDaime)}
                className="btn btn-secondary"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setIsViewingDaime(false);
                  setSelectedDaime(null);
                }}
                className="btn btn-primary"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;