import React, { useState, useEffect } from 'react';
import MemberList from '../components/members/MemberList';
import MemberForm from '../components/members/MemberForm';
import Modal from '../components/ui/Modal';
import { useSupabase } from '../hooks/useSupabase';
import { Member } from '../types';

const Members: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isViewingMember, setIsViewingMember] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getMembers, addMember, updateMember } = useSupabase();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = () => {
    setIsAddingMember(true);
    setSelectedMember(null);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsAddingMember(true);
    setIsViewingMember(false);
  };

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewingMember(true);
    setIsAddingMember(false);
  };

  const handleCloseModal = () => {
    setIsAddingMember(false);
    setIsViewingMember(false);
    setSelectedMember(null);
  };

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      if (selectedMember) {
        await updateMember(selectedMember.id, {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          birth_date: data.birthDate,
          baptism_date: data.baptismDate,
          status: data.status as 'active' | 'inactive' | 'visitor',
          groups: data.groups,
          ministries: data.ministries,
          skills: data.skills,
          notes: data.notes,
        });
      } else {
        await addMember({
          first_name: data.firstName!,
          last_name: data.lastName!,
          email: data.email!,
          phone: data.phone,
          address: data.address,
          birth_date: data.birthDate,
          baptism_date: data.baptismDate,
          status: data.status as 'active' | 'inactive' | 'visitor',
          groups: data.groups,
          ministries: data.ministries,
          skills: data.skills,
          notes: data.notes,
        });
      }
      await loadMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Membros
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie os membros, visitantes e seus dados.
        </p>
      </div>
      
      <div className="mb-6">
        <MemberList
          members={members}
          onAddMember={handleAddMember}
          onEditMember={handleEditMember}
          onViewMember={handleViewMember}
        />
      </div>
      
      <Modal
        isOpen={isAddingMember}
        onClose={handleCloseModal}
        title={selectedMember ? 'Editar Membro' : 'Novo Membro'}
        size="lg"
      >
        <MemberForm
          member={selectedMember || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
      
      <Modal
        isOpen={isViewingMember}
        onClose={handleCloseModal}
        title="Detalhes do Membro"
        size="lg"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {selectedMember.photo ? (
                <img
                  src={selectedMember.photo}
                  alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-200 text-2xl font-medium">
                    {selectedMember.firstName[0]}
                    {selectedMember.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {selectedMember.firstName} {selectedMember.lastName}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedMember.email}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Telefone
                </h4>
                <p className="text-gray-800 dark:text-white">{selectedMember.phone}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h4>
                <p className="text-gray-800 dark:text-white capitalize">
                  {selectedMember.status === 'active' && 'Ativo'}
                  {selectedMember.status === 'inactive' && 'Inativo'}
                  {selectedMember.status === 'visitor' && 'Visitante'}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Endereço
                </h4>
                <p className="text-gray-800 dark:text-white">{selectedMember.address}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Nascimento
                </h4>
                <p className="text-gray-800 dark:text-white">
                  {new Date(selectedMember.birthDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Data de Batismo
                </h4>
                <p className="text-gray-800 dark:text-white">
                  {selectedMember.baptismDate
                    ? new Date(selectedMember.baptismDate).toLocaleDateString('pt-BR')
                    : 'Não batizado'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Ministérios
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedMember.ministries?.map((ministry, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200"
                    >
                      {ministry}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Grupos
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedMember.groups?.map((group, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-secondary-50 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-200"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Habilidades
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedMember.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedMember.notes && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Observações
                  </h4>
                  <p className="text-gray-800 dark:text-white mt-1">
                    {selectedMember.notes}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => handleEditMember(selectedMember)}
                className="btn btn-primary"
              >
                Editar
              </button>
              <button
                onClick={handleCloseModal}
                className="btn btn-outline"
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

export default Members