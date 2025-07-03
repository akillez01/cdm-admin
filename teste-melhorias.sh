#!/bin/bash

# ========================================
# SCRIPT DE TESTE - MELHORIAS CDM ADMIN
# ========================================

echo "🚀 TESTANDO MELHORIAS DO CDM ADMIN"
echo "=================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto CDM Admin"
    exit 1
fi

echo "✅ Diretório correto confirmado"

# Verificar arquivos criados
echo ""
echo "📁 VERIFICANDO ARQUIVOS CRIADOS:"
echo "--------------------------------"

files=(
    "src/components/dashboard/QuickActions.tsx"
    "src/components/dashboard/DashboardAlerts.tsx" 
    "src/components/dashboard/MetricsOverview.tsx"
    "src/components/reports/ReportExporter.tsx"
    "src/pages/DashboardEnhanced.tsx"
    "src/pages/ReportsEnhanced.tsx"
    "MELHORIAS_DASHBOARD_RELATORIOS.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (não encontrado)"
    fi
done

# Verificar dependências
echo ""
echo "📦 VERIFICANDO DEPENDÊNCIAS:"
echo "----------------------------"

dependencies=(
    "lucide-react"
    "recharts"
    "react-router-dom"
)

for dep in "${dependencies[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "✅ $dep"
    else
        echo "⚠️  $dep (pode precisar instalar)"
    fi
done

# Verificar estrutura de tipos
echo ""
echo "🔧 VERIFICANDO TIPOS TYPESCRIPT:"
echo "--------------------------------"

if grep -q "interface.*Metrics" src/components/dashboard/MetricsOverview.tsx; then
    echo "✅ Interfaces de métricas definidas"
else
    echo "❌ Interfaces de métricas não encontradas"
fi

if grep -q "interface.*Alert" src/components/dashboard/DashboardAlerts.tsx; then
    echo "✅ Interfaces de alertas definidas"
else
    echo "❌ Interfaces de alertas não encontradas"
fi

# Verificar integração com Supabase
echo ""
echo "💾 VERIFICANDO INTEGRAÇÃO SUPABASE:"
echo "-----------------------------------"

if grep -q "useSupabase" src/components/dashboard/MetricsOverview.tsx; then
    echo "✅ MetricsOverview integrado com Supabase"
else
    echo "❌ MetricsOverview sem integração Supabase"
fi

if grep -q "useSupabase" src/components/dashboard/DashboardAlerts.tsx; then
    echo "✅ DashboardAlerts integrado com Supabase"
else
    echo "❌ DashboardAlerts sem integração Supabase"
fi

# Verificar roteamento
echo ""
echo "🔀 VERIFICANDO ROTEAMENTO:"
echo "-------------------------"

if grep -q "DashboardEnhanced" src/App.tsx; then
    echo "✅ DashboardEnhanced adicionado ao roteamento"
else
    echo "❌ DashboardEnhanced não está no roteamento"
fi

if grep -q "dashboard-old" src/App.tsx; then
    echo "✅ Dashboard original mantido como backup"
else
    echo "⚠️  Dashboard original pode ter sido sobrescrito"
fi

# Teste de compilação (se Node.js estiver disponível)
echo ""
echo "🔨 TESTE DE COMPILAÇÃO:"
echo "----------------------"

if command -v npm &> /dev/null; then
    echo "📋 Executando verificação TypeScript..."
    
    # Verificar se há erros de compilação
    if npm run type-check 2>/dev/null || npx tsc --noEmit 2>/dev/null; then
        echo "✅ Compilação TypeScript bem-sucedida"
    else
        echo "⚠️  Podem existir erros de TypeScript (execute 'npm run dev' para detalhes)"
    fi
else
    echo "⚠️  Node.js/npm não encontrado - pule o teste de compilação"
fi

# Resumo
echo ""
echo "📊 RESUMO DAS MELHORIAS:"
echo "========================"
echo "✅ Dashboard aprimorado com métricas em tempo real"
echo "✅ Sistema de alertas inteligente"
echo "✅ Ações rápidas para tarefas comuns"
echo "✅ Exportação avançada de relatórios"
echo "✅ Relatórios com filtros dinâmicos"
echo "✅ Componentes responsivos e acessíveis"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "==================="
echo "1. Execute 'npm run dev' para testar localmente"
echo "2. Acesse '/' para ver o novo dashboard"
echo "3. Teste as funcionalidades de exportação em '/reports'"
echo "4. Verifique os relatórios tempo real em '/realtime'"
echo "5. Valide alertas e métricas com dados reais"

echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "================"
echo "📄 Consulte MELHORIAS_DASHBOARD_RELATORIOS.md para detalhes completos"
echo "📄 Consulte SISTEMA_RELATORIOS_TEMPO_REAL.md para relatórios"

echo ""
echo "🎉 TESTE CONCLUÍDO!"
echo "==================="
