
// Type definitions for H.M POS System

export type UserRole = 'admin' | 'cashier' | 'kitchen';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameMM: string; // Myanmar name
  price: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'kbzpay' | 'wavepay';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface SalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  itemBreakdown: {
    menuItemId: string;
    menuItemName: string;
    quantity: number;
    revenue: number;
  }[];
  paymentMethodBreakdown: {
    method: PaymentMethod;
    count: number;
    total: number;
  }[];
}

export type Language = 'en' | 'mm';

export interface AppSettings {
  language: Language;
  taxRate: number;
  currency: string;
}
