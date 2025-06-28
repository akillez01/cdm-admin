import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Member } from '../../types';

interface MemberListProps {
  members: Member[];
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onViewMember: (member: Member) => void;
  onUpdateMemberStatus: (memberId: string, newStatus: 'active' | 'inactive') => Promise<void>;
}

const MemberList: React.FC<MemberListProps> = ({
  members,
  onAddMember,
  onEditMember,
  onViewMember,
  onUpdateMemberStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusToggle = async (member: Member) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await onUpdateMemberStatus(member.id, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status do membro:', error);
    }
  };

  const getMemberType = (member: Member) => {
    if (member.status === 'visitor') return 'Visitante';
    if (member.ministries && member.ministries.length > 0) return 'Fardado';
    return 'Frequentador';
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    const memberType = getMemberType(member);
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'visitor' && memberType === 'Visitante') ||
      (typeFilter === 'member' && memberType === 'Frequentador') ||
      (typeFilter === 'ordained' && memberType === 'Fardado');
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
            Lista de Membros
          </h2>
          <button
            onClick={onAddMember}
            className="btn btn-primary flex items-center justify-center w-full sm:w-auto"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Membro
          </button>
        </div>
        
        <div className="mt-4 flex flex-col gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-input pl-10 w-full"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="w-full sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-input w-full"
              >
                <option value="all">Todos os Tipos</option>
                <option value="visitor">Visitante</option>
                <option value="member">Frequentador</option>
                <option value="ordained">Fardado</option>
              </select>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input w-full"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="visitor">Visitantes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {/* Tabela para md+ */}
        <table className="table w-full hidden md:table">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">Telefone</th>
              <th scope="col">Status</th>
              <th scope="col">Tipo</th>
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
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={member.status === 'active'}
                          onChange={() => handleStatusToggle(member)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {member.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getMemberType(member)}
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
        {/* Cards para mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div key={member.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {member.photo ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={member.photo}
                      alt={`${member.firstName} ${member.lastName}`}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-200 font-medium text-lg">
                        {(member.firstName?.[0] || '')}{(member.lastName?.[0] || '')}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-base font-semibold text-gray-800 dark:text-white">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm mt-2">
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 px-2 py-0.5 rounded">
                    {getMemberType(member)}
                  </span>
                  <span className={`px-2 py-0.5 rounded ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{member.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                  {member.phone && (
                    <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                      {member.phone}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onViewMember(member)}
                    className="text-primary-500 hover:text-primary-600 text-sm"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEditMember(member)}
                    className="text-secondary-500 hover:text-secondary-600 text-sm"
                  >
                    Editar
                  </button>
                  <label className="inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={member.status === 'active'}
                      onChange={() => handleStatusToggle(member)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-primary-600 relative">
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${member.status === 'active' ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum membro encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
          Mostrando <span className="font-medium">{filteredMembers.length}</span> de{' '}
          <span className="font-medium">{members.length}</span> membros
        </div>
        
        <div className="flex flex-wrap justify-center gap-1">
          <button
            disabled
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-primary-500 text-white rounded-md">1</button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
            2
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberList;