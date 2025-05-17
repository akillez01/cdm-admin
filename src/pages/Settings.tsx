import React, { useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';

const ChurchSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    churchName: 'Igreja Exemplo',
    pastorName: 'Pastor João Silva',
    contactEmail: 'contato@igrejaexemplo.com',
    contactPhone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123 - Centro, São Paulo/SP',
  });

  const { supabase } = useSupabase();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // Aqui você pode salvar as configurações no Supabase
      // Exemplo: await supabase.from('settings').upsert([formData]);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie as configurações do sistema e preferências.
        </p>
      </div>

      {/* Restante do código permanece o mesmo */}
      {/* ... */}
    </div>
  );
};

export default ChurchSettings;