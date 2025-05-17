import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import { Member } from '../../types';

interface MemberListProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onViewMember: (member: Member) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  onAddMember,
  onEditMember,
  onViewMember,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'visitor':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 md:mb-0">
            Lista de Membros
          </h2>
          <button
            onClick={onAddMember}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Membro
          </button>
        </div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar membros..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="visitor">Visitantes</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Telefone</th>
              <th scope="col">Status</th>
              <th scope="col">Ministérios</th>
              <th scope="col" className="relative">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {member.photo ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={member.photo}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-200 font-medium text-sm">
                            {(member.firstName?.[0] || '')}{(member.lastName?.[0] || '')}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {member.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadgeClass(member.status)}`}>
                      {member.status === 'active' && 'Ativo'}
                      {member.status === 'inactive' && 'Inativo'}
                      {member.status === 'visitor' && 'Visitante'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {member.ministries.slice(0, 2).map((ministry, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200"
                        >
                          {ministry}
                        </span>
                      ))}
                      {member.ministries.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          +{member.ministries.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onViewMember(member)}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => onEditMember(member)}
                        className="text-secondary-500 hover:text-secondary-600"
                      >
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhum membro encontrado com os filtros atuais.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando <span className="font-medium">{filteredMembers.length}</span> de{' '}
          <span className="font-medium">{members.length}</span> membros
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
            2
          </button>
          <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberList;