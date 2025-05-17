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
  }[];
}