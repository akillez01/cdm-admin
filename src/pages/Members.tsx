import React, { useCallback, useEffect, useState } from 'react';
import MemberForm from '../components/members/MemberForm';
import MemberList from '../components/members/MemberList';
import Modal from '../components/ui/Modal';
import { useSupabase } from '../hooks/useSupabase';
import { Member } from '../types';

const Members: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isViewingMember, setIsViewingMember] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getMembers, addMember, updateMember, deleteMember } = useSupabase();

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getMembers]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

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

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Deseja realmente excluir este membro?')) {
      try {
        await deleteMember(id);
        await loadMembers();
        handleCloseModal();
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
        alert('Erro ao excluir membro!');
      }
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateMember(memberId, { status: newStatus });
      await loadMembers();
    } catch (error) {
      console.error('Erro ao atualizar status do membro:', error);
    }
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
          onUpdateMemberStatus={handleUpdateMemberStatus}
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
            {/* ...detalhes do membro... */}
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
              <button
                onClick={() => handleDeleteMember(selectedMember.id)}
                className="btn btn-danger"
              >
                Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Members;