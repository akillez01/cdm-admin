
/**
 * Componente de debug para verificar variáveis de ambiente
 * Remover em produção
 */
export function DebugEnv() {
  const envVars = {
    'VITE_USE_SUPABASE': import.meta.env.VITE_USE_SUPABASE,
    'VITE_API_URL': import.meta.env.VITE_API_URL,
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
    'NODE_ENV': import.meta.env.NODE_ENV,
    'MODE': import.meta.env.MODE,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
  };

  const useSupabaseMode = import.meta.env.VITE_USE_SUPABASE !== 'false';

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔧 Debug - Variáveis de Ambiente</h3>
      
      <div className="mb-2">
        <strong>Modo Ativo:</strong> 
        <span className={`ml-2 px-2 py-1 rounded ${useSupabaseMode ? 'bg-blue-600' : 'bg-green-600'}`}>
          {useSupabaseMode ? '🔵 Supabase' : '🟢 API MySQL'}
        </span>
      </div>

      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key}:</span>
            <span className="text-yellow-300 ml-2 truncate">
              {value === undefined ? 'undefined' : String(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 text-xs text-gray-400">
        💡 Se USE_SUPABASE for 'undefined', crie arquivo .env na raiz
      </div>
    </div>
  );
}
