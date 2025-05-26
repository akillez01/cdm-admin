-- Políticas de acesso para controle de admin e usuários

-- Exemplo: Adiciona coluna role na tabela de usuários (caso use tabela customizada)
-- ALTER TABLE users ADD COLUMN role text DEFAULT 'viewer';

-- Exemplo: Policy para permitir apenas admin deletar eventos
CREATE POLICY "Admins podem deletar eventos"
ON events
FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');

-- Policy para permitir apenas admin inserir/editar inventário
CREATE POLICY "Admins podem inserir inventário"
ON inventory_items
FOR INSERT
USING (auth.jwt() ->> 'role' = 'admin');
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins podem editar inventário"
ON inventory_items
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy para leitura liberada para todos autenticados
CREATE POLICY "Usuários autenticados podem ler inventário"
ON inventory_items
FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy para permitir admin criar usuários pelo painel
-- (Se usar tabela customizada de usuários)
-- CREATE POLICY "Admins podem criar usuários"
-- ON users
-- FOR INSERT
-- USING (auth.jwt() ->> 'role' = 'admin');
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');
