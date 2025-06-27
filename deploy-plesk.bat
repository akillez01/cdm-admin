@echo off
REM Script de Deploy para Plesk (Windows)
REM Execute este arquivo .bat

echo 🚀 Iniciando deploy para Plesk...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar se npm está instalado
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado. Instale npm primeiro.
    pause
    exit /b 1
)

REM Verificar se arquivo .env.production existe
if not exist ".env.production" (
    echo ⚠️  Arquivo .env.production não encontrado.
    echo 📝 Copie .env.production.example para .env.production e configure suas variáveis.
    copy .env.production.example .env.production
    echo ✅ Arquivo .env.production criado. Configure suas variáveis antes de continuar.
    pause
    exit /b 1
)

echo 📦 Instalando dependências...
call npm install

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências.
    pause
    exit /b 1
)

echo 🔍 Executando linting...
call npm run lint

echo 🏗️  Fazendo build para produção...
call npm run build:production

if errorlevel 1 (
    echo ❌ Erro no build.
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!
echo.
echo 📁 Arquivos para upload estão na pasta: dist/
echo.
echo 📋 Próximos passos:
echo 1. Acesse seu painel Plesk
echo 2. Vá para File Manager
echo 3. Navegue até public_html ou httpdocs
echo 4. Faça upload de todos os arquivos da pasta dist/
echo 5. Configure o .htaccess se necessário
echo.
echo 🌐 Após o upload, acesse seu domínio para verificar se tudo está funcionando.
echo.
echo 🔧 Para debug, verifique:
echo    - Variáveis de ambiente no .env.production
echo    - Configuração do Supabase
echo    - Logs no painel Plesk
echo.

REM Opcional: Criar arquivo zip para upload
set /p createzip="💾 Deseja criar um arquivo ZIP para upload? (y/n): "
if /i "%createzip%"=="y" (
    echo 📦 Criando arquivo ZIP...
    powershell -command "Compress-Archive -Path 'dist\*' -DestinationPath 'cdm-admin-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.zip'"
    echo ✅ Arquivo ZIP criado com sucesso!
)

echo.
echo 🎉 Deploy preparado com sucesso!
pause
