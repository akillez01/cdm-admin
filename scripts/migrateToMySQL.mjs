/**
 * Script de Migração de Dados: Supabase → MySQL/Plesk
 * 
 * Este script exporta dados do Supabase e gera arquivos SQL
 * para importar no banco MySQL do Plesk
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configurações do Supabase
const supabaseUrl = 'https://xkkbeilbthmezeqizcch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(supabaseUrl, supabaseKey);

// Configurações de exportação
const EXPORT_DIR = './migration_export';
const EXPORT_DATE = new Date().toISOString().split('T')[0];

// Função para criar diretório de exportação
function ensureExportDir() {
    if (!fs.existsSync(EXPORT_DIR)) {
        fs.mkdirSync(EXPORT_DIR, { recursive: true });
    }
}

// Função para escape de SQL
function escapeSQLString(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'boolean') return str ? '1' : '0';
    if (typeof str === 'number') return str.toString();
    if (typeof str === 'object') return `'${JSON.stringify(str).replace(/'/g, "''")}'`;
    return `'${str.toString().replace(/'/g, "''")}'`;
}

// Função para gerar UUID v4 simples
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Exportar membros
async function exportMembers() {
    console.log('📋 Exportando membros...');
    
    const { data: members, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Erro ao exportar membros:', error);
        return;
    }
    
    let sql = `-- Dados dos Membros (${members.length} registros)\n`;
    sql += `-- Exportado em: ${new Date().toISOString()}\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DELETE FROM members;\n\n`;
    
    if (members.length > 0) {
        sql += `INSERT INTO members (
    id, first_name, last_name, email, phone, address, birth_date,
    baptism_date, join_date, status, groups, ministries, skills,
    photo, notes, created_at, updated_at
) VALUES\n`;
        
        const values = members.map(member => {
            return `(
    ${escapeSQLString(member.id || generateUUID())},
    ${escapeSQLString(member.first_name)},
    ${escapeSQLString(member.last_name)},
    ${escapeSQLString(member.email)},
    ${escapeSQLString(member.phone)},
    ${escapeSQLString(member.address)},
    ${escapeSQLString(member.birth_date)},
    ${escapeSQLString(member.baptism_date)},
    ${escapeSQLString(member.join_date)},
    ${escapeSQLString(member.status || 'active')},
    ${escapeSQLString(member.groups)},
    ${escapeSQLString(member.ministries)},
    ${escapeSQLString(member.skills)},
    ${escapeSQLString(member.photo)},
    ${escapeSQLString(member.notes)},
    ${escapeSQLString(member.created_at)},
    ${escapeSQLString(member.updated_at)}
)`;
        });
        
        sql += values.join(',\n') + ';\n\n';
    }
    
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'members.sql'), sql);
    console.log(`✅ ${members.length} membros exportados para members.sql`);
}

// Exportar transações
async function exportTransactions() {
    console.log('💰 Exportando transações...');
    
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: true });
    
    if (error) {
        console.error('Erro ao exportar transações:', error);
        return;
    }
    
    let sql = `-- Dados das Transações (${transactions.length} registros)\n`;
    sql += `-- Exportado em: ${new Date().toISOString()}\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DELETE FROM transactions;\n\n`;
    
    if (transactions.length > 0) {
        sql += `INSERT INTO transactions (
    id, member_name, type, amount, date, category, description,
    payment_method, created_at, updated_at
) VALUES\n`;
        
        const values = transactions.map(transaction => {
            return `(
    ${escapeSQLString(transaction.id || generateUUID())},
    ${escapeSQLString(transaction.member_name)},
    ${escapeSQLString(transaction.type)},
    ${escapeSQLString(transaction.amount)},
    ${escapeSQLString(transaction.date)},
    ${escapeSQLString(transaction.category)},
    ${escapeSQLString(transaction.description)},
    ${escapeSQLString(transaction.payment_method)},
    ${escapeSQLString(transaction.created_at)},
    ${escapeSQLString(transaction.updated_at)}
)`;
        });
        
        sql += values.join(',\n') + ';\n\n';
    }
    
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'transactions.sql'), sql);
    console.log(`✅ ${transactions.length} transações exportadas para transactions.sql`);
}

// Exportar inventário geral
async function exportInventory() {
    console.log('📦 Exportando inventário geral...');
    
    const { data: inventory, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Erro ao exportar inventário:', error);
        return;
    }
    
    let sql = `-- Dados do Inventário Geral (${inventory.length} registros)\n`;
    sql += `-- Exportado em: ${new Date().toISOString()}\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DELETE FROM inventory_items;\n\n`;
    
    if (inventory.length > 0) {
        sql += `INSERT INTO inventory_items (
    id, name, category, quantity, location, value, supplier,
    purchase_date, min_quantity, status, notes, created_at, updated_at
) VALUES\n`;
        
        const values = inventory.map(item => {
            return `(
    ${escapeSQLString(item.id || generateUUID())},
    ${escapeSQLString(item.name)},
    ${escapeSQLString(item.category)},
    ${escapeSQLString(item.quantity)},
    ${escapeSQLString(item.location)},
    ${escapeSQLString(item.value)},
    ${escapeSQLString(item.supplier)},
    ${escapeSQLString(item.purchase_date)},
    ${escapeSQLString(item.min_quantity)},
    ${escapeSQLString(item.status)},
    ${escapeSQLString(item.notes)},
    ${escapeSQLString(item.created_at)},
    ${escapeSQLString(item.updated_at)}
)`;
        });
        
        sql += values.join(',\n') + ';\n\n';
    }
    
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'inventory_items.sql'), sql);
    console.log(`✅ ${inventory.length} itens de inventário exportados para inventory_items.sql`);
}

// Exportar inventário do Daime
async function exportDaimeInventory() {
    console.log('🍃 Exportando inventário do Daime...');
    
    const { data: daime, error } = await supabase
        .from('daime_inventory')
        .select('*')
        .order('created_at', { ascending: true });
    
    if (error) {
        console.error('Erro ao exportar inventário do Daime:', error);
        return;
    }
    
    let sql = `-- Dados do Inventário do Daime (${daime.length} registros)\n`;
    sql += `-- Exportado em: ${new Date().toISOString()}\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DELETE FROM daime_inventory;\n\n`;
    
    if (daime.length > 0) {
        sql += `INSERT INTO daime_inventory (
    id, codigo, graduacao, litros, data_feitio, responsavel_feitio,
    local_feitio, tipo_feitio, panela, observacoes, status,
    data_validade, local_armazenamento, temperatura, ph, cor,
    consistencia, created_at, updated_at
) VALUES\n`;
        
        const values = daime.map(item => {
            return `(
    ${escapeSQLString(item.id || generateUUID())},
    ${escapeSQLString(item.codigo)},
    ${escapeSQLString(item.graduacao)},
    ${escapeSQLString(item.litros)},
    ${escapeSQLString(item.data_feitio)},
    ${escapeSQLString(item.responsavel_feitio)},
    ${escapeSQLString(item.local_feitio)},
    ${escapeSQLString(item.tipo_feitio || 'Novo')},
    ${escapeSQLString(item.panela)},
    ${escapeSQLString(item.observacoes)},
    ${escapeSQLString(item.status || 'disponivel')},
    ${escapeSQLString(item.data_validade)},
    ${escapeSQLString(item.local_armazenamento)},
    ${escapeSQLString(item.temperatura)},
    ${escapeSQLString(item.ph)},
    ${escapeSQLString(item.cor || 'Amarelo')},
    ${escapeSQLString(item.consistencia || 'Líquida')},
    ${escapeSQLString(item.created_at)},
    ${escapeSQLString(item.updated_at)}
)`;
        });
        
        sql += values.join(',\n') + ';\n\n';
    }
    
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'daime_inventory.sql'), sql);
    console.log(`✅ ${daime.length} registros do Daime exportados para daime_inventory.sql`);
}

// Exportar eventos
async function exportEvents() {
    console.log('📅 Exportando eventos...');
    
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
    
    if (error) {
        console.error('Erro ao exportar eventos:', error);
        return;
    }
    
    let sql = `-- Dados dos Eventos (${events.length} registros)\n`;
    sql += `-- Exportado em: ${new Date().toISOString()}\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DELETE FROM events;\n\n`;
    
    if (events.length > 0) {
        sql += `INSERT INTO events (
    id, title, description, start_date, end_date, location,
    organizer, status, budget, participants, resources, created_at, updated_at
) VALUES\n`;
        
        const values = events.map(event => {
            return `(
    ${escapeSQLString(event.id || generateUUID())},
    ${escapeSQLString(event.title)},
    ${escapeSQLString(event.description)},
    ${escapeSQLString(event.start_date)},
    ${escapeSQLString(event.end_date)},
    ${escapeSQLString(event.location)},
    ${escapeSQLString(event.organizer)},
    ${escapeSQLString(event.status || 'planned')},
    ${escapeSQLString(event.budget)},
    ${escapeSQLString(event.participants)},
    ${escapeSQLString(event.resources)},
    ${escapeSQLString(event.created_at)},
    ${escapeSQLString(event.updated_at)}
)`;
        });
        
        sql += values.join(',\n') + ';\n\n';
    }
    
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'events.sql'), sql);
    console.log(`✅ ${events.length} eventos exportados para events.sql`);
}

// Gerar script de importação completo
function generateImportScript() {
    console.log('📄 Gerando script de importação...');
    
    let script = `#!/bin/bash
# Script de Importação Completa - CDM Admin
# Gerado automaticamente em: ${new Date().toISOString()}
#
# IMPORTANTE: Execute este script no servidor Plesk
# com acesso ao MySQL

echo "🚀 Iniciando importação de dados CDM Admin..."

# Configurações (ajuste conforme necessário)
DB_HOST="localhost"
DB_NAME="cdm_admin"
DB_USER="cdm_user"
DB_PASS="sua_senha"

# Função para executar SQL
execute_sql() {
    local file=$1
    echo "📥 Importando $file..."
    mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < "$file"
    if [ $? -eq 0 ]; then
        echo "✅ $file importado com sucesso"
    else
        echo "❌ Erro ao importar $file"
        exit 1
    fi
}

# Ordem de importação (respeitando dependências)
echo "📋 Importando dados na ordem correta..."

execute_sql "members.sql"
execute_sql "transactions.sql"
execute_sql "inventory_items.sql"
execute_sql "daime_inventory.sql"
execute_sql "events.sql"

echo "🎉 Importação concluída com sucesso!"
echo ""
echo "📊 Verifique os dados importados:"
echo "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SELECT COUNT(*) as members FROM members;'"
echo "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SELECT COUNT(*) as transactions FROM transactions;'"
echo "mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME -e 'SELECT COUNT(*) as daime_items FROM daime_inventory;'"
`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'import_all.sh'), script);
    fs.chmodSync(path.join(EXPORT_DIR, 'import_all.sh'), '755');
    
    // Script PowerShell para Windows
    let psScript = `# Script de Importação CDM Admin (PowerShell)
# Gerado em: ${new Date().toISOString()}

Write-Host "🚀 Iniciando importação de dados CDM Admin..." -ForegroundColor Green

# Configurações (ajuste conforme necessário)
$DB_HOST = "localhost"
$DB_NAME = "cdm_admin"
$DB_USER = "cdm_user"
$DB_PASS = "sua_senha"

# Função para executar SQL
function Execute-SQL {
    param($File)
    Write-Host "📥 Importando $File..." -ForegroundColor Blue
    
    mysql -h$DB_HOST -u$DB_USER -p$DB_PASS $DB_NAME < $File
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $File importado com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao importar $File" -ForegroundColor Red
        exit 1
    }
}

# Importar arquivos na ordem
Execute-SQL "members.sql"
Execute-SQL "transactions.sql"
Execute-SQL "inventory_items.sql"
Execute-SQL "daime_inventory.sql"
Execute-SQL "events.sql"

Write-Host "🎉 Importação concluída!" -ForegroundColor Green
`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'import_all.ps1'), psScript);
    
    console.log('✅ Scripts de importação gerados (import_all.sh e import_all.ps1)');
}

// Gerar relatório de exportação
function generateReport(stats) {
    const report = `# Relatório de Migração CDM Admin

## 📊 Resumo da Exportação
- **Data**: ${new Date().toISOString()}
- **Origem**: Supabase
- **Destino**: MySQL/Plesk

## 📈 Estatísticas
- **Membros**: ${stats.members} registros
- **Transações**: ${stats.transactions} registros
- **Inventário Geral**: ${stats.inventory} registros
- **Inventário Daime**: ${stats.daime} registros
- **Eventos**: ${stats.events} registros

## 📁 Arquivos Gerados
- \`members.sql\` - Dados dos membros
- \`transactions.sql\` - Transações financeiras
- \`inventory_items.sql\` - Inventário geral
- \`daime_inventory.sql\` - Inventário do sacramento
- \`events.sql\` - Eventos e atividades
- \`import_all.sh\` - Script de importação (Linux/Mac)
- \`import_all.ps1\` - Script de importação (Windows)

## 🔄 Próximos Passos
1. Faça upload dos arquivos .sql para o servidor Plesk
2. Configure as variáveis de banco no script de importação
3. Execute o script: \`./import_all.sh\`
4. Verifique se os dados foram importados corretamente
5. Atualize as configurações do frontend (.env.production)
6. Teste a aplicação com os novos dados

## ⚠️ Importante
- Faça backup do banco antes da importação
- Ajuste as credenciais de banco nos scripts
- Teste em ambiente de desenvolvimento primeiro

---
*Migração gerada automaticamente pelo script de migração CDM Admin*
`;
    
    fs.writeFileSync(path.join(EXPORT_DIR, 'MIGRATION_REPORT.md'), report);
    console.log('📋 Relatório de migração gerado: MIGRATION_REPORT.md');
}

// Função principal
async function main() {
    console.log('🚀 Iniciando migração de dados do Supabase...\n');
    
    ensureExportDir();
    
    const stats = {
        members: 0,
        transactions: 0,
        inventory: 0,
        daime: 0,
        events: 0
    };
    
    try {
        // Exportar todas as tabelas
        await exportMembers();
        await exportTransactions();
        await exportInventory();
        await exportDaimeInventory();
        await exportEvents();
        
        // Contar registros para o relatório
        const { data: membersCount } = await supabase.from('members').select('id', { count: 'exact' });
        const { data: transactionsCount } = await supabase.from('transactions').select('id', { count: 'exact' });
        const { data: inventoryCount } = await supabase.from('inventory_items').select('id', { count: 'exact' });
        const { data: daimeCount } = await supabase.from('daime_inventory').select('id', { count: 'exact' });
        const { data: eventsCount } = await supabase.from('events').select('id', { count: 'exact' });
        
        stats.members = membersCount?.length || 0;
        stats.transactions = transactionsCount?.length || 0;
        stats.inventory = inventoryCount?.length || 0;
        stats.daime = daimeCount?.length || 0;
        stats.events = eventsCount?.length || 0;
        
        // Gerar scripts e relatórios
        generateImportScript();
        generateReport(stats);
        
        console.log('\n🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log(`📁 Arquivos salvos em: ${EXPORT_DIR}`);
        console.log(`📊 Total de registros: ${Object.values(stats).reduce((a, b) => a + b, 0)}`);
        
    } catch (error) {
        console.error('❌ Erro durante a migração:', error);
        process.exit(1);
    }
}

// Executar migração
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main as migrateSupabaseToMySQL };
