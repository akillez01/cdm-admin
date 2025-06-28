#!/usr/bin/env node

/**
 * Script de Teste Final do Deploy CDM Admin
 * Verifica se todos os arquivos estão no lugar certo para o Plesk
 */

const fs = require('fs');
const path = require('path');

console.log('=== TESTE FINAL DO DEPLOY CDM ADMIN ===\n');

// Pasta de deploy
const deployPath = './deploy-plesk';

// Arquivos essenciais que devem existir
const essentialFiles = [
    'index.html',
    '.htaccess',
    '.env.production',
    'vite.svg',
    'images/cdmlogo.png',
    'assets/index-D-vrDhA2.js',
    'assets/index-CWfnR0Ha.css'
];

// Verificar se a pasta de deploy existe
console.log('1. Verificando pasta de deploy...');
if (!fs.existsSync(deployPath)) {
    console.error('❌ Pasta deploy-plesk não encontrada!');
    process.exit(1);
}
console.log('✅ Pasta deploy-plesk encontrada');

// Verificar arquivos essenciais
console.log('\n2. Verificando arquivos essenciais...');
let allFilesExist = true;
essentialFiles.forEach(file => {
    const filePath = path.join(deployPath, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file} (${stats.size} bytes)`);
    } else {
        console.log(`❌ ${file} - ARQUIVO FALTANDO!`);
        allFilesExist = false;
    }
});

// Verificar conteúdo do index.html
console.log('\n3. Verificando configuração do index.html...');
const indexPath = path.join(deployPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

const checks = [
    { name: 'CSP configurado', check: indexContent.includes('Content-Security-Policy') },
    { name: 'Supabase permitido', check: indexContent.includes('xkkbeilbthmezeqizcch.supabase.co') },
    { name: 'Scripts carregados', check: indexContent.includes('index-') && indexContent.includes('.js') },
    { name: 'CSS carregado', check: indexContent.includes('index-') && indexContent.includes('.css') },
    { name: 'Título correto', check: indexContent.includes('Ceu das Matas') }
];

checks.forEach(({name, check}) => {
    console.log(`${check ? '✅' : '❌'} ${name}`);
});

// Verificar .env.production
console.log('\n4. Verificando configuração de produção...');
const envPath = path.join(deployPath, '.env.production');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envChecks = [
        { name: 'Supabase habilitado', check: envContent.includes('VITE_USE_SUPABASE=true') },
        { name: 'URL Supabase configurada', check: envContent.includes('VITE_SUPABASE_URL=') },
        { name: 'Key Supabase configurada', check: envContent.includes('VITE_SUPABASE_ANON_KEY=') }
    ];
    
    envChecks.forEach(({name, check}) => {
        console.log(`${check ? '✅' : '❌'} ${name}`);
    });
} else {
    console.log('❌ .env.production não encontrado!');
    allFilesExist = false;
}

// Verificar .htaccess
console.log('\n5. Verificando configuração Apache (.htaccess)...');
const htaccessPath = path.join(deployPath, '.htaccess');
if (fs.existsSync(htaccessPath)) {
    const htaccessContent = fs.readFileSync(htaccessPath, 'utf8');
    const htaccessChecks = [
        { name: 'Rewrite habilitado', check: htaccessContent.includes('RewriteEngine On') },
        { name: 'SPA routing configurado', check: htaccessContent.includes('RewriteRule . /index.html [L]') },
        { name: 'Cache configurado', check: htaccessContent.includes('ExpiresActive On') },
        { name: 'Compressão configurada', check: htaccessContent.includes('mod_deflate') }
    ];
    
    htaccessChecks.forEach(({name, check}) => {
        console.log(`${check ? '✅' : '❌'} ${name}`);
    });
} else {
    console.log('❌ .htaccess não encontrado!');
    allFilesExist = false;
}

// Calcular tamanho total
console.log('\n6. Informações do deploy...');
function getDirectorySize(dirPath) {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
            totalSize += getDirectorySize(filePath);
        } else {
            totalSize += stats.size;
        }
    });
    
    return totalSize;
}

const totalSize = getDirectorySize(deployPath);
console.log(`📦 Tamanho total do deploy: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

// Lista de arquivos no deploy
console.log('\n7. Estrutura do deploy:');
function listFiles(dir, prefix = '') {
    const files = fs.readdirSync(dir).sort();
    files.forEach((file, index) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        
        if (stats.isDirectory()) {
            console.log(`${prefix}${connector}${file}/`);
            listFiles(filePath, prefix + (isLast ? '    ' : '│   '));
        } else {
            const size = stats.size > 1024 ? `${(stats.size / 1024).toFixed(1)}KB` : `${stats.size}B`;
            console.log(`${prefix}${connector}${file} (${size})`);
        }
    });
}

listFiles(deployPath);

// Resultado final
console.log('\n=== RESULTADO ===');
if (allFilesExist) {
    console.log('✅ DEPLOY PRONTO PARA UPLOAD NO PLESK!');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Acesse o painel Plesk');
    console.log('2. Vá para File Manager > httpdocs/');
    console.log('3. Faça upload de TODO o conteúdo da pasta deploy-plesk/');
    console.log('4. Teste o site no navegador');
    console.log('5. Verifique se o logo aparece e dados carregam');
} else {
    console.log('❌ DEPLOY INCOMPLETO - Corrija os arquivos faltantes!');
    process.exit(1);
}
