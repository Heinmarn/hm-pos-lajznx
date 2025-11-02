
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Order, User, AppSettings, Language } from '@/types';
import { 
  getMenuItems, 
  saveMenuItems, 
  getOrders, 
  saveOrders,
  getCurrentUser,
  saveCurrentUser,
  getSettings,
  saveSettings,
  addOrder as addOrderToStorage,
  updateOrder as updateOrderInStorage,
} from '@/utils/storage';
import { sampleMenuItems, sampleUsers } from '@/utils/sampleData';

interface AppContextType {
  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  
  // User
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  
  // Loading
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    taxRate: 0,
    currency: 'MMK',
  });
  const [loading, setLoading] = useState(true);

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      
      // Load settings
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
      
      // Load menu items
      let loadedMenuItems = await getMenuItems();
      if (loadedMenuItems.length === 0) {
        // Initialize with sample data
        await saveMenuItems(sampleMenuItems);
        loadedMenuItems = sampleMenuItems;
      }
      setMenuItems(loadedMenuItems);
      
      // Load orders
      const loadedOrders = await getOrders();
      setOrders(loadedOrders);
      
      // Load current user
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  };

  // Menu operations
  const addMenuItem = async (item: MenuItem) => {
    try {
      const newItems = [...menuItems, item];
      await saveMenuItems(newItems);
      setMenuItems(newItems);
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const newItems = menuItems.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      await saveMenuItems(newItems);
      setMenuItems(newItems);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const newItems = menuItems.filter(item => item.id !== id);
      await saveMenuItems(newItems);
      setMenuItems(newItems);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  // Order operations
  const addOrder = async (order: Order) => {
    try {
      await addOrderToStorage(order);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      await updateOrderInStorage(id, updates);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  // User operations
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simple authentication for demo
      const user = sampleUsers.find(u => u.email === email);
      if (user) {
        await saveCurrentUser(user);
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await saveCurrentUser(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // Settings operations
  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      await saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const setLanguage = async (lang: Language) => {
    await updateSettings({ language: lang });
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        orders,
        addOrder,
        updateOrder,
        currentUser,
        login,
        logout,
        settings,
        updateSettings,
        language: settings.language,
        setLanguage,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
