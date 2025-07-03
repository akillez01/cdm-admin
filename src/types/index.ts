// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: string;
}

// Member types
export interface Member {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  baptismDate?: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'visitor';
  groups: string[];
  ministries: string[];
  skills: string[];
  photo?: string;
  notes?: string;
}

// Financial types
export interface Transaction {
  id: string;
  memberId?: string;
  memberName?: string;
  type: 'tithe' | 'offering' | 'donation' | 'expense';
  amount: number;
  date: string;
  category: string;
  description?: string;
  paymentMethod: 'cash' | 'check' | 'card' | 'pix' | 'transfer';
}

// Inventory types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  value: number;
  supplier?: string;
  purchaseDate?: string;
  minQuantity?: number;
  status: 'available' | 'low' | 'depleted';
  notes?: string;
  photo?: string; // URL da imagem do item
}

// Santo Daime Inventory types
export interface DaimeInventoryItem {
  id: string;
  codigo: string; // Código único para rastreamento
  graduacao: 'Força 1' | 'Força 2' | 'Força 3' | 'Força 4' | 'Força 5'; // Graduação do Daime
  litros: number; // Quantidade em litros
  dataFeitio: string; // Data do feitio (data_feitio no banco)
  responsavelFeitio: string; // Responsável pelo feitio (responsavel_feitio no banco)
  localFeitio?: string; // Local onde foi feito o feitio (local_feitio no banco)
  tipoFeitio: 'Concentração' | 'Novo' | 'Reforço'; // Tipo do feitio (tipo_feitio no banco)
  panela?: string; // Número/nome da panela
  observacoes?: string; // Observações adicionais
  status: 'disponivel' | 'reservado' | 'consumido' | 'vencido'; // Status do sacramento
  dataValidade?: string; // Data de validade (data_validade no banco)
  localArmazenamento?: string; // Local de armazenamento (local_armazenamento no banco)
  temperatura?: number; // Temperatura de armazenamento
  ph?: number; // pH do sacramento
  cor: 'Amarelo' | 'Marrom Claro' | 'Marrom' | 'Marrom Escuro' | 'Roxo'; // Cor do sacramento
  consistencia: 'Líquida' | 'Densa' | 'Muito Densa'; // Consistência
  photo?: string; // URL da imagem do sacramento
  created_at?: string;
  updated_at?: string;
}

// Tipo para inserção (sem campos obrigatórios gerados pelo banco)
export interface DaimeInventoryInsert {
  codigo: string;
  graduacao: 'Força 1' | 'Força 2' | 'Força 3' | 'Força 4' | 'Força 5';
  litros: number;
  dataFeitio: string;
  responsavelFeitio: string;
  localFeitio?: string;
  tipoFeitio?: 'Concentração' | 'Novo' | 'Reforço';
  panela?: string;
  observacoes?: string;
  status?: 'disponivel' | 'reservado' | 'consumido' | 'vencido';
  dataValidade?: string;
  localArmazenamento?: string;
  temperatura?: number;
  ph?: number;
  cor?: 'Amarelo' | 'Marrom Claro' | 'Marrom' | 'Marrom Escuro' | 'Roxo';
  consistencia?: 'Líquida' | 'Densa' | 'Muito Densa';
  photo?: string;
}

// Tipo para atualização (todos os campos opcionais exceto id)
export interface DaimeInventoryUpdate {
  codigo?: string;
  graduacao?: 'Força 1' | 'Força 2' | 'Força 3' | 'Força 4' | 'Força 5';
  litros?: number;
  dataFeitio?: string;
  responsavelFeitio?: string;
  localFeitio?: string;
  tipoFeitio?: 'Concentração' | 'Novo' | 'Reforço';
  panela?: string;
  observacoes?: string;
  status?: 'disponivel' | 'reservado' | 'consumido' | 'vencido';
  dataValidade?: string;
  localArmazenamento?: string;
  temperatura?: number;
  ph?: number;
  cor?: 'Amarelo' | 'Marrom Claro' | 'Marrom' | 'Marrom Escuro' | 'Roxo';
  consistencia?: 'Líquida' | 'Densa' | 'Muito Densa';
  photo?: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  location: string;
  budget?: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  organizer?: string;
  participants?: string[];
  resources?: EventResource[];
}

export interface EventResource {
  id: string;
  name: string;
  type: 'equipment' | 'space' | 'personnel';
  quantity: number;
}

// Dashboard types
export interface DashboardStats {
  totalMembers: number;
  activeMembersPercentage: number;
  newMembersThisMonth: number;
  totalIncome: number;
  totalExpenses: number;
  upcomingEvents: number;
  lowStockItems: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'system' | 'member' | 'financial' | 'inventory' | 'general';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  systemUpdates: boolean;
  memberUpdates: boolean;
  financialAlerts: boolean;
  inventoryAlerts: boolean;
}