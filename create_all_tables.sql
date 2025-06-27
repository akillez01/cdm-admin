-- Script SQL para criar todas as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- ================================
-- 1. TABELA MEMBERS (Membros)
-- ================================
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    membership_type VARCHAR(50) DEFAULT 'regular',
    join_date DATE DEFAULT CURRENT_DATE,
    birth_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 2. TABELA TRANSACTIONS (Transações)
-- ================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'donation', 'payment')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 3. VERIFICAR SE DAIME_INVENTORY JÁ EXISTE
-- ================================
-- Se não existir, criar:
CREATE TABLE IF NOT EXISTS public.daime_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    graduacao VARCHAR(50) NOT NULL,
    litros DECIMAL(8,2) NOT NULL,
    data_feitio DATE NOT NULL,
    responsavel_feitio VARCHAR(255),
    local_feitio VARCHAR(255),
    tipo_feitio VARCHAR(100),
    panela VARCHAR(50),
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'em_uso', 'acabou', 'vencido')),
    data_validade DATE,
    local_armazenamento VARCHAR(255),
    temperatura DECIMAL(4,1),
    ph DECIMAL(3,1),
    cor VARCHAR(50),
    consistencia VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 4. VERIFICAR SE INVENTORY_ITEMS JÁ EXISTE
-- ================================
-- Se não existir, criar:
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(255),
    value DECIMAL(10,2),
    supplier VARCHAR(255),
    purchase_date DATE,
    min_quantity INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'low_stock', 'out_of_stock', 'discontinued')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================
-- 5. CRIAR INDEXES PARA PERFORMANCE
-- ================================
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_daime_inventory_status ON public.daime_inventory(status);
CREATE INDEX IF NOT EXISTS idx_daime_inventory_codigo ON public.daime_inventory(codigo);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON public.inventory_items(status);

-- ================================
-- 6. HABILITAR RLS (Row Level Security)
-- ================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daime_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- ================================
-- 7. CRIAR POLÍTICAS DE ACESSO BÁSICAS
-- ================================
-- Permitir SELECT para todos os usuários autenticados
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.members FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.transactions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.daime_inventory FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.inventory_items FOR SELECT USING (true);

-- Permitir INSERT, UPDATE, DELETE para todos os usuários autenticados
CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update for all users" ON public.members FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON public.members FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update for all users" ON public.transactions FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON public.transactions FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON public.daime_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update for all users" ON public.daime_inventory FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON public.daime_inventory FOR DELETE USING (true);

CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON public.inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update for all users" ON public.inventory_items FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON public.inventory_items FOR DELETE USING (true);

-- ================================
-- 8. CRIAR TRIGGERS PARA UPDATED_AT
-- ================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS set_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER IF NOT EXISTS set_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER IF NOT EXISTS set_updated_at BEFORE UPDATE ON public.daime_inventory FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER IF NOT EXISTS set_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================
-- 9. INSERIR DADOS DE EXEMPLO
-- ================================

-- Membros de exemplo
INSERT INTO public.members (name, email, phone, status, membership_type) VALUES
('João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'active', 'regular'),
('Maria Santos', 'maria@exemplo.com', '(11) 88888-8888', 'active', 'premium'),
('Pedro Costa', 'pedro@exemplo.com', '(11) 77777-7777', 'active', 'regular')
ON CONFLICT (email) DO NOTHING;

-- Itens de inventário de exemplo
INSERT INTO public.inventory_items (name, category, quantity, location, min_quantity, status) VALUES
('Velas Brancas', 'Liturgia', 50, 'Despensa Principal', 10, 'available'),
('Incenso de Sândalo', 'Liturgia', 25, 'Despensa Principal', 5, 'available'),
('Cadeiras de Plástico', 'Mobiliário', 30, 'Salão Principal', 20, 'available'),
('Água Mineral', 'Consumo', 48, 'Cozinha', 12, 'available'),
('Papel Higiênico', 'Limpeza', 20, 'Banheiro', 5, 'available')
ON CONFLICT DO NOTHING;

-- Transações de exemplo
INSERT INTO public.transactions (type, amount, description, category, date, status) VALUES
('income', 500.00, 'Doação mensal', 'Doações', CURRENT_DATE, 'completed'),
('expense', 150.00, 'Compra de velas', 'Material Litúrgico', CURRENT_DATE, 'completed'),
('expense', 80.00, 'Conta de luz', 'Utilidades', CURRENT_DATE, 'completed')
ON CONFLICT DO NOTHING;

-- ================================
-- FINALIZAÇÃO
-- ================================
-- Verificar se as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('members', 'transactions', 'daime_inventory', 'inventory_items')
ORDER BY tablename;
