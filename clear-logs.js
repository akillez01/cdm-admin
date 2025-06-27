// Script para limpar os logs do sessionStorage e testar as mudanças
console.log('🧹 Limpando cache de logs do sessionStorage...');

// Lista todas as chaves relacionadas aos logs do CDM Admin
const keysToRemove = [
  'cdm-admin-provider-config-logged',
  'cdm-admin-api-config-logged',
  'cdm-admin-api-operations-logged',
  'cdm-admin-api-operations-logged-result',
  'cdm-admin-api-operations-logged-error',
  'cdm-admin-api-operations-logged-html-error',
  'cdm-admin-api-operations-logged-request-error'
];

if (typeof window !== 'undefined' && window.sessionStorage) {
  keysToRemove.forEach(key => {
    if (sessionStorage.getItem(key)) {
      console.log(`🗑️ Removendo: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  console.log('✅ Cache de logs limpo! Recarregue a página para ver logs apenas uma vez.');
  console.log('💡 Para habilitar logs de debug de requisições, execute:');
  console.log("   sessionStorage.setItem('cdm-admin-debug-requests', 'true')");
} else {
  console.log('❌ Este script deve ser executado no console do navegador');
}
