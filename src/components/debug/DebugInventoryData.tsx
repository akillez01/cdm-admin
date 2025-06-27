import React, { useEffect, useState } from 'react';
import { useDataProvider } from '../../hooks/useDataProvider';
import { DaimeInventoryItem, InventoryItem } from '../../types';

interface DebugData {
  inventory: InventoryItem[];
  daimeInventory: DaimeInventoryItem[];
  error: string | null;
  loading: boolean;
}

const DebugInventoryData: React.FC = () => {
  const [debugData, setDebugData] = useState<DebugData>({
    inventory: [],
    daimeInventory: [],
    error: null,
    loading: true
  });

  const { getInventory, getDaimeInventory } = useDataProvider();

  useEffect(() => {
    const loadDebugData = async () => {
      console.log('🔍 [DEBUG] Iniciando carregamento de dados...');
      
      try {
        setDebugData(prev => ({ ...prev, loading: true, error: null }));

        // Testar inventário geral
        console.log('📦 [DEBUG] Carregando inventário geral...');
        const inventoryData = await getInventory();
        console.log('📦 [DEBUG] Inventário carregado:', inventoryData);

        // Testar inventário do Daime  
        console.log('🍃 [DEBUG] Carregando inventário do Daime...');
        const daimeData = await getDaimeInventory();
        console.log('🍃 [DEBUG] Daime carregado:', daimeData);

        setDebugData({
          inventory: Array.isArray(inventoryData) ? inventoryData : [],
          daimeInventory: Array.isArray(daimeData) ? daimeData : [],
          error: null,
          loading: false
        });

        console.log('✅ [DEBUG] Carregamento concluído com sucesso');
      } catch (error) {
        console.error('❌ [DEBUG] Erro no carregamento:', error);
        setDebugData(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          loading: false
        }));
      }
    };

    loadDebugData();
  }, [getInventory, getDaimeInventory]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔍 Debug Inventário</h4>
      
      {debugData.loading && (
        <div style={{ color: '#666' }}>⏳ Carregando dados...</div>
      )}
      
      {debugData.error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          ❌ Erro: {debugData.error}
        </div>
      )}
      
      {!debugData.loading && (
        <>
          <div style={{ marginBottom: '8px' }}>
            📦 <strong>Inventário Geral:</strong> {debugData.inventory.length} itens
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            🍃 <strong>Inventário Daime:</strong> {debugData.daimeInventory.length} itens
          </div>
          
          {debugData.inventory.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Primeiro item:</strong><br/>
              <span style={{ fontSize: '10px', color: '#666' }}>
                {debugData.inventory[0].name} - {debugData.inventory[0].category}
              </span>
            </div>
          )}
          
          {debugData.daimeInventory.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <strong>Primeiro Daime:</strong><br/>
              <span style={{ fontSize: '10px', color: '#666' }}>
                {debugData.daimeInventory[0].codigo} - {debugData.daimeInventory[0].graduacao}
              </span>
            </div>
          )}
        </>
      )}
      
      <div style={{ fontSize: '10px', color: '#888', marginTop: '10px' }}>
        Atualizou: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DebugInventoryData;
