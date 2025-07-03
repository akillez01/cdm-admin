import React, { useState } from 'react';
import { DaimeInventoryItem } from '../../types';
import ImageUpload from '../ui/ImageUpload';

interface DaimeFormProps {
  item?: DaimeInventoryItem;
  onSubmit: (data: Partial<DaimeInventoryItem>) => Promise<void>;
  onCancel: () => void;
}

const DaimeForm: React.FC<DaimeFormProps> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<DaimeInventoryItem>>({
    codigo: item?.codigo || '',
    graduacao: item?.graduacao || 'Força 1',
    litros: item?.litros || 0,
    dataFeitio: item?.dataFeitio || '',
    responsavelFeitio: item?.responsavelFeitio || '',
    localFeitio: item?.localFeitio || '',
    tipoFeitio: item?.tipoFeitio || 'Novo',
    panela: item?.panela || '',
    observacoes: item?.observacoes || '',
    status: item?.status || 'disponivel',
    dataValidade: item?.dataValidade || '',
    localArmazenamento: item?.localArmazenamento || '',
    temperatura: item?.temperatura || undefined,
    ph: item?.ph || undefined,
    cor: item?.cor || 'Amarelo',
    consistencia: item?.consistencia || 'Líquida',
    photo: item?.photo || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'litros' || name === 'temperatura' || name === 'ph' 
        ? (value === '' ? undefined : Number(value))
        : value
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, photo: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.litros || !formData.dataFeitio || !formData.responsavelFeitio) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar sacramento:', error);
      alert('Erro ao salvar sacramento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div>
          <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código do Sacramento *
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: DM001"
            required
          />
        </div>

        {/* Graduação */}
        <div>
          <label htmlFor="graduacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Graduação *
          </label>
          <select
            id="graduacao"
            name="graduacao"
            value={formData.graduacao}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Força 1">Força 1</option>
            <option value="Força 2">Força 2</option>
            <option value="Força 3">Força 3</option>
            <option value="Força 4">Força 4</option>
            <option value="Força 5">Força 5</option>
          </select>
        </div>

        {/* Litros */}
        <div>
          <label htmlFor="litros" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantidade (Litros) *
          </label>
          <input
            type="number"
            id="litros"
            name="litros"
            value={formData.litros}
            onChange={handleInputChange}
            step="0.1"
            min="0"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.0"
            required
          />
        </div>

        {/* Data do Feitio */}
        <div>
          <label htmlFor="dataFeitio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data do Feitio *
          </label>
          <input
            type="date"
            id="dataFeitio"
            name="dataFeitio"
            value={formData.dataFeitio}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Responsável pelo Feitio */}
        <div>
          <label htmlFor="responsavelFeitio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Responsável pelo Feitio *
          </label>
          <input
            type="text"
            id="responsavelFeitio"
            name="responsavelFeitio"
            value={formData.responsavelFeitio}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do responsável"
            required
          />
        </div>

        {/* Local do Feitio */}
        <div>
          <label htmlFor="localFeitio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Local do Feitio
          </label>
          <input
            type="text"
            id="localFeitio"
            name="localFeitio"
            value={formData.localFeitio}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Casa de Feitio - Núcleo Central"
          />
        </div>

        {/* Tipo de Feitio */}
        <div>
          <label htmlFor="tipoFeitio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Feitio
          </label>
          <select
            id="tipoFeitio"
            name="tipoFeitio"
            value={formData.tipoFeitio}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Novo">Novo</option>
            <option value="Concentração">Concentração</option>
            <option value="Reforço">Reforço</option>
          </select>
        </div>

        {/* Panela */}
        <div>
          <label htmlFor="panela" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Panela
          </label>
          <input
            type="text"
            id="panela"
            name="panela"
            value={formData.panela}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Panela 1"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="consumido">Consumido</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        {/* Local de Armazenamento */}
        <div>
          <label htmlFor="localArmazenamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Local de Armazenamento
          </label>
          <input
            type="text"
            id="localArmazenamento"
            name="localArmazenamento"
            value={formData.localArmazenamento}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Despensa Principal - Prateleira A"
          />
        </div>

        {/* Data de Validade */}
        <div>
          <label htmlFor="dataValidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data de Validade
          </label>
          <input
            type="date"
            id="dataValidade"
            name="dataValidade"
            value={formData.dataValidade}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Temperatura */}
        <div>
          <label htmlFor="temperatura" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Temperatura (°C)
          </label>
          <input
            type="number"
            id="temperatura"
            name="temperatura"
            value={formData.temperatura || ''}
            onChange={handleInputChange}
            step="0.1"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 18.5"
          />
        </div>

        {/* pH */}
        <div>
          <label htmlFor="ph" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            pH
          </label>
          <input
            type="number"
            id="ph"
            name="ph"
            value={formData.ph || ''}
            onChange={handleInputChange}
            step="0.1"
            min="0"
            max="14"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 3.2"
          />
        </div>

        {/* Cor */}
        <div>
          <label htmlFor="cor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cor
          </label>
          <select
            id="cor"
            name="cor"
            value={formData.cor}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Amarelo">Amarelo</option>
            <option value="Marrom Claro">Marrom Claro</option>
            <option value="Marrom">Marrom</option>
            <option value="Marrom Escuro">Marrom Escuro</option>
            <option value="Roxo">Roxo</option>
          </select>
        </div>

        {/* Consistência */}
        <div>
          <label htmlFor="consistencia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Consistência
          </label>
          <select
            id="consistencia"
            name="consistencia"
            value={formData.consistencia}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Líquida">Líquida</option>
            <option value="Densa">Densa</option>
            <option value="Muito Densa">Muito Densa</option>
          </select>
        </div>
      </div>

      {/* Observações */}
      <div className="md:col-span-2">
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleInputChange}
          rows={4}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Informações adicionais sobre o sacramento..."
        />
      </div>

      {/* Upload de Imagem */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Foto do Sacramento
        </label>
        <ImageUpload
          onImageUrlChange={handleImageUpload}
          currentImageUrl={formData.photo}
          bucketName="sacramentos"
          folder="fotos"
          placeholder="Adicionar foto do sacramento para registro"
        />
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : (item ? 'Atualizar Sacramento' : 'Registrar Sacramento')}
        </button>
      </div>
    </form>
  );
};

export default DaimeForm;
