import React, { useState } from 'react';
import { Member } from '../../types';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: Partial<Member>) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({
  member,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
    birthDate: member?.birthDate || '',
    baptismDate: member?.baptismDate || '',
    status: member?.status || 'active',
    ministries: member?.ministries || [],
    groups: member?.groups || [],
    skills: member?.skills || [],
    notes: member?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'ministries' | 'groups' | 'skills') => {
    const values = e.target.value.split(',').map(v => v.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="form-label">Nome</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="form-label">Sobrenome</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="form-label">Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="address" className="form-label">Endereço</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="birthDate" className="form-label">Data de Nascimento</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="baptismDate" className="form-label">Data de Batismo</label>
          <input
            type="date"
            id="baptismDate"
            name="baptismDate"
            value={formData.baptismDate}
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
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="visitor">Visitante</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="ministries" className="form-label">Ministérios (separados por vírgula)</label>
          <input
            type="text"
            id="ministries"
            name="ministries"
            value={formData.ministries?.join(', ')}
            onChange={(e) => handleArrayChange(e, 'ministries')}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="groups" className="form-label">Grupos (separados por vírgula)</label>
          <input
            type="text"
            id="groups"
            name="groups"
            value={formData.groups?.join(', ')}
            onChange={(e) => handleArrayChange(e, 'groups')}
            className="form-input"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="form-label">Habilidades (separadas por vírgula)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills?.join(', ')}
            onChange={(e) => handleArrayChange(e, 'skills')}
            className="form-input"
          />
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
          {member ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;