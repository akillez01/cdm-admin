import React, { useState } from 'react';
import { InventoryItem } from '../../types';

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  item,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: item?.name || '',
    category: item?.category || '',
    quantity: item?.quantity || 0,
    location: item?.location || '',
    value: item?.value || 0,
    supplier: item?.supplier || '',
    purchaseDate: item?.purchaseDate || '',
    minQuantity: item?.minQuantity || 0,
    status: item?.status || 'available',
    notes: item?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="name" className="form-label">Nome do Item</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="form-label">Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="location" className="form-label">Localização</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="quantity" className="form-label">Quantidade</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="form-input"
            min="0"
            required
          />
        </div>
        
        <div>
          <label htmlFor="minQuantity" className="form-label">Quantidade Mínima</label>
          <input
            type="number"
            id="minQuantity"
            name="minQuantity"
            value={formData.minQuantity}
            onChange={handleChange}
            className="form-input"
            min="0"
            required
          />
        </div>
        
        <div>
          <label htmlFor="value" className="form-label">Valor Unitário</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="form-input"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label htmlFor="supplier" className="form-label">Fornecedor</label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="purchaseDate" className="form-label">Data de Compra</label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="available">Disponível</option>
            <option value="low">Baixo</option>
            <option value="depleted">Esgotado</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="notes" className="form-label">Observações</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input h-24"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {item ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};

export default InventoryForm;