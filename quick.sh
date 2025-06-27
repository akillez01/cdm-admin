#!/bin/bash

# Comandos Rápidos CDM Admin
echo "🚀 CDM Admin - Comandos Rápidos"
echo "================================"

case "$1" in
    "supabase")
        echo "🔵 Configurando para usar Supabase..."
        cat > .env << EOF
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo
VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin - Supabase
EOF
        rm -rf node_modules/.vite
        echo "✅ Configurado para Supabase!"
        ;;
    
    "mysql")
        echo "🟢 Configurando para usar MySQL..."
        cat > .env << EOF
VITE_USE_SUPABASE=false
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo
VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin - MySQL
EOF
        rm -rf node_modules/.vite
        echo "✅ Configurado para MySQL!"
        echo "💡 Lembre-se de iniciar o backend: ./start-dev-server.sh"
        ;;
    
    "clean")
        echo "🧹 Limpando cache..."
        rm -rf node_modules/.vite
        rm -rf dist
        echo "✅ Cache limpo!"
        ;;
    
    "status")
        echo "📊 Status atual:"
        if [ -f ".env" ]; then
            echo "🔍 Arquivo .env encontrado:"
            cat .env | grep -E "VITE_USE_SUPABASE|VITE_API_URL" | head -2
        else
            echo "❌ Arquivo .env não encontrado"
        fi
        ;;
    
    "start")
        echo "🚀 Iniciando desenvolvimento..."
        if [ -f ".env" ]; then
            if grep -q "VITE_USE_SUPABASE=false" .env; then
                echo "🟢 Modo MySQL - iniciando backend..."
                ./start-dev-server.sh &
                sleep 3
            fi
            echo "🌐 Iniciando frontend..."
            npm run dev
        else
            echo "❌ Configure o .env primeiro: ./quick.sh supabase"
        fi
        ;;
    
    *)
        echo "📋 Comandos disponíveis:"
        echo "  ./quick.sh supabase  - Usar Supabase (rápido)"
        echo "  ./quick.sh mysql     - Usar MySQL local"
        echo "  ./quick.sh clean     - Limpar cache"
        echo "  ./quick.sh status    - Ver configuração atual"
        echo "  ./quick.sh start     - Iniciar desenvolvimento"
        echo ""
        echo "💡 Para resolver o erro imediatamente:"
        echo "  ./quick.sh supabase && npm run dev"
        ;;
esac
