
import { MenuItem, Order, User } from '@/types';

// Sample menu items with Myanmar names
export const sampleMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Wet Salad',
    nameMM: 'ဝက်ဆလပ်',
    price: 3000,
    category: 'Salad',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Mala Shan Kaut',
    nameMM: 'မာလာရှမ်းကော',
    price: 4500,
    category: 'Main Course',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mala Mok Chauk',
    nameMM: 'မာလာမောက်ချိုက်',
    price: 4000,
    category: 'Main Course',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Cold Drink',
    nameMM: 'အအေးဖျော်ရည်',
    price: 1000,
    category: 'Beverages',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Purified Water',
    nameMM: 'သန့်ရှင်းသောရေ',
    price: 500,
    category: 'Beverages',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Shan Noodles',
    nameMM: 'ရှမ်းခေါက်ဆွဲ',
    price: 3500,
    category: 'Main Course',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Tea',
    nameMM: 'လက်ဖက်ရည်',
    price: 800,
    category: 'Beverages',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Coffee',
    nameMM: 'ကော်ဖီ',
    price: 1200,
    category: 'Beverages',
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample users for testing
export const sampleUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@hmpos.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cashier-1',
    email: 'cashier@hmpos.com',
    name: 'Cashier User',
    role: 'cashier',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'kitchen-1',
    email: 'kitchen@hmpos.com',
    name: 'Kitchen Staff',
    role: 'kitchen',
    createdAt: new Date().toISOString(),
  },
];

// Generate sample order
export const generateSampleOrder = (orderNumber: number): Order => {
  const items = sampleMenuItems.slice(0, 3).map((item, index) => ({
    menuItemId: item.id,
    menuItem: item,
    quantity: index + 1,
    price: item.price,
    subtotal: item.price * (index + 1),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = 0;
  const total = subtotal + tax;

  return {
    id: `order-${orderNumber}`,
    orderNumber: `#${String(orderNumber).padStart(4, '0')}`,
    tableNumber: `T${Math.floor(Math.random() * 20) + 1}`,
    items,
    subtotal,
    tax,
    total,
    status: 'pending',
    paymentStatus: 'pending',
    createdBy: 'cashier-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
