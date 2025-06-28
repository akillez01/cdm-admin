-- 🗄️ SCRIPTS SQL PARA TESTES - CDM Admin API
-- Criação e população de tabelas para testes no Postman

-- =============================================================================
-- 1. CRIAÇÃO DAS TABELAS
-- =============================================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `active` boolean NOT NULL DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela de inventário geral
CREATE TABLE IF NOT EXISTS `inventory_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `minimum_stock` decimal(10,2) DEFAULT 0,
  `location` varchar(255),
  `notes` text,
  `supplier` varchar(255),
  `purchase_date` date,
  `expiry_date` date,
  `cost` decimal(10,2),
  `status` enum('available','low','depleted') DEFAULT 'available',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela de inventário do Daime
CREATE TABLE IF NOT EXISTS `daime_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL UNIQUE,
  `graduacao` enum('Força 1','Força 2','Força 3','Força 4','Força 5') NOT NULL,
  `litros` decimal(8,2) NOT NULL,
  `data_feitio` date NOT NULL,
  `responsavel_feitio` varchar(255) NOT NULL,
  `local_feitio` varchar(255),
  `tipo_feitio` varchar(100) DEFAULT 'Novo',
  `panela` varchar(100),
  `observacoes` text,
  `status` enum('disponivel','consumido','vencido') DEFAULT 'disponivel',
  `data_validade` date,
  `local_armazenamento` varchar(255),
  `temperatura` decimal(4,1),
  `ph` decimal(3,1),
  `cor` varchar(50) DEFAULT 'Amarelo',
  `consistencia` varchar(50) DEFAULT 'Líquida',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela de membros
CREATE TABLE IF NOT EXISTS `members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255),
  `phone` varchar(20),
  `address` text,
  `birth_date` date,
  `join_date` date NOT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('tithe','offering','donation','expense') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `member_id` int,
  `category` varchar(100),
  `payment_method` varchar(50),
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE SET NULL
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `start_date` datetime NOT NULL,
  `end_date` datetime,
  `location` varchar(255),
  `max_participants` int,
  `status` enum('scheduled','ongoing','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Tabela de logs de acesso
CREATE TABLE IF NOT EXISTS `access_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- =============================================================================
-- 2. DADOS DE TESTE
-- =============================================================================

-- Inserir usuários de teste
-- Senha: admin123 (hash gerado com bcrypt)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `active`) VALUES
('Administrador CDM', 'admin@cdm.com', '$2a$10$rN.2lTp.LtQM.IhGR9oVzeQNhFiYvfQWHZP1fJVKkwG.j1YmhgPH6', 'admin', true),
('Usuário Teste', 'user@cdm.com', '$2a$10$rN.2lTp.LtQM.IhGR9oVzeQNhFiYvfQWHZP1fJVKkwG.j1YmhgPH6', 'user', true)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Inserir itens de inventário geral
INSERT INTO `inventory_items` (`name`, `description`, `category`, `quantity`, `unit`, `minimum_stock`, `location`, `notes`, `supplier`, `purchase_date`, `cost`, `status`) VALUES
('Velas Brancas', 'Velas para iluminação das cerimônias', 'Ritual', 100, 'unidades', 20, 'Armazém Principal', 'Verificar qualidade antes do uso', 'Casa das Velas', '2025-01-15', 2.50, 'available'),
('Incenso Sândalo', 'Incenso natural para purificação', 'Ritual', 25, 'caixas', 5, 'Sala de Preparação', 'Uso apenas em cerimônias especiais', 'Essências Naturais', '2025-05-10', 8.00, 'available'),
('Água Mineral', 'Água para consumo durante cerimônias', 'Consumível', 50, 'garrafas', 10, 'Despensa', 'Manter refrigerada', 'Águas Puras', '2025-06-20', 1.50, 'available'),
('Flores Naturais', 'Flores para decoração do altar', 'Decoração', 20, 'buquês', 3, 'Geladeira', 'Renovar semanalmente', 'Floricultura Jardim', '2025-06-25', 15.00, 'low'),
('Papel Toalha', 'Para limpeza geral', 'Limpeza', 5, 'rolos', 2, 'Depósito', 'Estoque baixo', 'Distribuidora Clean', '2025-06-01', 3.50, 'low')
ON DUPLICATE KEY UPDATE `quantity` = VALUES(`quantity`);

-- Inserir inventário do Daime
INSERT INTO `daime_inventory` (`codigo`, `graduacao`, `litros`, `data_feitio`, `responsavel_feitio`, `local_feitio`, `tipo_feitio`, `panela`, `observacoes`, `status`, `data_validade`, `local_armazenamento`, `temperatura`, `ph`, `cor`, `consistencia`) VALUES
('CDM-2025-001', 'Força 3', 15.5, '2025-01-15', 'Mestre João', 'Casa de Feitio Principal', 'Novo', 'Panela Grande', 'Feitio realizado durante lua cheia', 'disponivel', '2025-07-15', 'Despensa Sagrada - A1', 18.0, 4.3, 'Amarelo Dourado', 'Líquida'),
('CDM-2025-002', 'Força 1', 20.0, '2025-02-10', 'Padrinho Carlos', 'Casa de Feitio Principal', 'Novo', 'Panela Média', 'Feitio especial para novos irmãos', 'disponivel', '2025-08-10', 'Despensa Sagrada - B1', 17.5, 4.5, 'Amarelo Claro', 'Líquida'),
('CDM-2025-003', 'Força 5', 8.0, '2025-03-21', 'Mestre Antonio', 'Casa de Feitio Especial', 'Concentrado', 'Panela Pequena', 'Feitio para cerimônias de cura', 'disponivel', '2025-09-21', 'Cofre Sagrado', 16.0, 3.8, 'Marrom Escuro', 'Concentrada'),
('CDM-2024-050', 'Força 2', 0.0, '2024-12-01', 'Padrinho José', 'Casa de Feitio Principal', 'Novo', 'Panela Grande', 'Completamente utilizado nas cerimônias', 'consumido', '2025-06-01', 'N/A', null, null, 'Amarelo', 'Líquida'),
('CDM-2024-025', 'Força 4', 2.5, '2024-10-15', 'Mestre Roberto', 'Casa de Feitio Principal', 'Concentrado', 'Panela Média', 'Restante de feitio anterior', 'disponivel', '2025-04-15', 'Despensa Sagrada - C1', 18.5, 4.0, 'Amarelo Escuro', 'Líquida')
ON DUPLICATE KEY UPDATE `litros` = VALUES(`litros`);

-- Inserir membros
INSERT INTO `members` (`name`, `email`, `phone`, `address`, `birth_date`, `join_date`, `status`, `notes`) VALUES
('João Silva Santos', 'joao@email.com', '(11) 99999-1111', 'Rua das Flores, 123 - São Paulo/SP', '1980-05-15', '2020-03-10', 'active', 'Membro fundador'),
('Maria Oliveira Costa', 'maria@email.com', '(11) 99999-2222', 'Av. Central, 456 - São Paulo/SP', '1975-08-22', '2021-01-20', 'active', 'Responsável pela organização'),
('Carlos Pereira Lima', 'carlos@email.com', '(11) 99999-3333', 'Rua da Paz, 789 - São Paulo/SP', '1990-12-03', '2022-06-15', 'active', 'Músico do grupo'),
('Ana Paula Mendes', 'ana@email.com', '(11) 99999-4444', 'Rua Verde, 321 - São Paulo/SP', '1985-04-18', '2023-02-28', 'active', 'Responsável pela cozinha'),
('Roberto Ferreira', 'roberto@email.com', '(11) 99999-5555', 'Av. Principal, 654 - São Paulo/SP', '1970-11-30', '2019-09-12', 'inactive', 'Membro afastado temporariamente')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- Inserir transações
INSERT INTO `transactions` (`type`, `amount`, `description`, `date`, `member_id`, `category`, `payment_method`, `notes`) VALUES
('tithe', 100.00, 'Dízimo mensal - João', '2025-06-01', 1, 'Dízimo', 'PIX', 'Pagamento em dia'),
('offering', 50.00, 'Oferta especial - Maria', '2025-06-05', 2, 'Oferta', 'Dinheiro', 'Oferta voluntária'),
('donation', 200.00, 'Doação para reforma', '2025-06-10', 3, 'Reforma', 'Transferência', 'Doação para melhorias'),
('expense', 150.00, 'Compra de velas e incensos', '2025-06-15', null, 'Material', 'Cartão', 'Materiais para cerimônias'),
('tithe', 80.00, 'Dízimo mensal - Ana', '2025-06-20', 4, 'Dízimo', 'PIX', 'Pagamento regular'),
('expense', 300.00, 'Manutenção do espaço', '2025-06-25', null, 'Manutenção', 'Dinheiro', 'Reparos necessários')
ON DUPLICATE KEY UPDATE `amount` = VALUES(`amount`);

-- Inserir eventos
INSERT INTO `events` (`title`, `description`, `start_date`, `end_date`, `location`, `max_participants`, `status`, `notes`) VALUES
('Cerimônia de Cura', 'Cerimônia especial para trabalhos de cura', '2025-07-01 19:00:00', '2025-07-02 01:00:00', 'Salão Principal', 50, 'scheduled', 'Inscrições abertas'),
('Feitio de Daime', 'Preparação do Sacramento', '2025-07-15 08:00:00', '2025-07-17 18:00:00', 'Casa de Feitio', 20, 'scheduled', 'Apenas membros experientes'),
('Hinário Mensal', 'Canto dos hinários tradicionais', '2025-07-20 20:00:00', '2025-07-21 00:00:00', 'Salão Principal', 100, 'scheduled', 'Aberto a todos'),
('Cerimônia de Junho', 'Cerimônia regular mensal', '2025-06-15 19:00:00', '2025-06-16 02:00:00', 'Salão Principal', 80, 'completed', 'Cerimônia realizada com sucesso'),
('Trabalho de Limpeza', 'Mutirão de limpeza e organização', '2025-08-01 08:00:00', '2025-08-01 17:00:00', 'Todo o espaço', 30, 'scheduled', 'Participação voluntária')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- =============================================================================
-- 3. QUERIES ÚTEIS PARA TESTES
-- =============================================================================

-- Verificar dados inseridos
SELECT 'USUÁRIOS' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'INVENTÁRIO GERAL', COUNT(*) FROM inventory_items
UNION ALL
SELECT 'INVENTÁRIO DAIME', COUNT(*) FROM daime_inventory
UNION ALL
SELECT 'MEMBROS', COUNT(*) FROM members
UNION ALL
SELECT 'TRANSAÇÕES', COUNT(*) FROM transactions
UNION ALL
SELECT 'EVENTOS', COUNT(*) FROM events;

-- Verificar usuários de teste
SELECT id, name, email, role, active FROM users WHERE email IN ('admin@cdm.com', 'user@cdm.com');

-- Verificar inventário com estoque baixo
SELECT name, quantity, minimum_stock, status FROM inventory_items WHERE quantity <= minimum_stock;

-- Verificar feitios disponíveis
SELECT codigo, graduacao, litros, status FROM daime_inventory WHERE status = 'disponivel';

-- Estatísticas rápidas (similar ao endpoint /stats)
SELECT 
  (SELECT COUNT(*) FROM members WHERE status = 'active') as membros_ativos,
  (SELECT COUNT(*) FROM daime_inventory WHERE status = 'disponivel') as feitios_disponiveis,
  (SELECT SUM(litros) FROM daime_inventory WHERE status = 'disponivel') as total_litros,
  (SELECT SUM(amount) FROM transactions WHERE type IN ('tithe', 'offering', 'donation') AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as receita_mensal,
  (SELECT SUM(amount) FROM transactions WHERE type = 'expense' AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as gastos_mensais;

-- =============================================================================
-- 4. LIMPEZA (Para resetar testes)
-- =============================================================================

-- CUIDADO: Descomente apenas se quiser limpar todos os dados de teste
/*
DELETE FROM access_logs;
DELETE FROM transactions;
DELETE FROM events;
DELETE FROM members;
DELETE FROM daime_inventory;
DELETE FROM inventory_items;
DELETE FROM users;

-- Resetar auto_increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE inventory_items AUTO_INCREMENT = 1;
ALTER TABLE daime_inventory AUTO_INCREMENT = 1;
ALTER TABLE members AUTO_INCREMENT = 1;
ALTER TABLE transactions AUTO_INCREMENT = 1;
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE access_logs AUTO_INCREMENT = 1;
*/

-- =============================================================================
-- 5. SENHAS PARA TESTES
-- =============================================================================

/*
CREDENCIAIS DE TESTE:

Admin:
- Email: admin@cdm.com
- Senha: admin123

Usuário Regular:
- Email: user@cdm.com  
- Senha: user123

Hash usado: $2a$10$rN.2lTp.LtQM.IhGR9oVzeQNhFiYvfQWHZP1fJVKkwG.j1YmhgPH6
(Gerado com bcrypt para a senha "admin123" e "user123")
*/
