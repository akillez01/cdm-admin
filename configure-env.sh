#!/bin/bash

# Script para configurar o arquivo .env rapidamente
echo "🔧 Configurando arquivo .env para desenvolvimento..."

# Criar arquivo .env com configuração correta
cat > .env << EOF
# CDM Admin - Configuração de Desenvolvimento
# Gerado automaticamente em $(date)

# ===========================================
# CONFIGURAÇÃO PRINCIPAL
# ===========================================

# MODO: false = API MySQL, true = Supabase
VITE_USE_SUPABASE=false

# API LOCAL (Backend Node.js)
VITE_API_URL=http://localhost:3001/api

# App
VITE_APP_TITLE=CDM Admin - Dev
VITE_APP_VERSION=1.0.0-dev
VITE_BASE_URL=/cdm-admin

# ===========================================
# SUPABASE (BACKUP/FALLBACK)
# ===========================================

VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODEwODIzOCwiZXhwIjoyMDYzNjg0MjM4fQ.oimqdYXE4BJ5Qh3Y9vfHjsN0TMcPqUlk15UEIVKHtTE
EOF

echo "✅ Arquivo .env criado!"
echo ""
echo "📊 Configuração atual:"
echo "- Modo: API MySQL (localhost:3001)"
echo "- Supabase como fallback"
echo "- Debug habilitado"
echo ""
echo "🎯 Para usar:"
echo "1. npm run dev (frontend)"
echo "2. ./start-dev-server.sh (backend)"
echo ""
echo "🔄 Para alternar modos:"
echo "- Usar MySQL: echo 'VITE_USE_SUPABASE=false' > .env"  
echo "- Usar Supabase: echo 'VITE_USE_SUPABASE=true' > .env"
