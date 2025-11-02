
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem, Order, User, AppSettings } from '@/types';

// Storage keys
const KEYS = {
  MENU_ITEMS: '@hmpos_menu_items',
  ORDERS: '@hmpos_orders',
  CURRENT_USER: '@hmpos_current_user',
  SETTINGS: '@hmpos_settings',
  SYNC_QUEUE: '@hmpos_sync_queue',
};

// Menu Items
export const saveMenuItems = async (items: MenuItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.MENU_ITEMS, JSON.stringify(items));
    console.log('Menu items saved successfully');
  } catch (error) {
    console.error('Error saving menu items:', error);
    throw error;
  }
};

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MENU_ITEMS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
};

// Orders
export const saveOrders = async (orders: Order[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    console.log('Orders saved successfully');
  } catch (error) {
    console.error('Error saving orders:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

export const addOrder = async (order: Order): Promise<void> => {
  try {
    const orders = await getOrders();
    orders.unshift(order);
    await saveOrders(orders);
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
  try {
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
      await saveOrders(orders);
    }
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Current User
export const saveCurrentUser = async (user: User | null): Promise<void> => {
  try {
    if (user) {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error saving current user:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      language: 'en',
      taxRate: 0,
      currency: 'MMK',
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      language: 'en',
      taxRate: 0,
      currency: 'MMK',
    };
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.MENU_ITEMS,
      KEYS.ORDERS,
      KEYS.CURRENT_USER,
      KEYS.SETTINGS,
      KEYS.SYNC_QUEUE,
    ]);
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
