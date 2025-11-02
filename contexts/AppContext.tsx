
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
import { setColorScheme } from '@/styles/commonStyles';
import { 
  hasAdminPermission, 
  canEditMenu, 
  canDeleteMenu, 
  canAddMenuItem,
  canUpdateMenuItem,
  canCreateOrder,
  canUpdateOrderStatus,
  canProcessPayment,
  canManageSettings,
} from '@/utils/permissions';

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
  updateUserPermissions: (role: string, permissions: any) => Promise<void>;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => Promise<void>;
  
  // Permissions
  hasAdminPermission: () => boolean;
  canEditMenu: () => boolean;
  canDeleteMenu: () => boolean;
  canAddMenuItem: () => boolean;
  canUpdateMenuItem: () => boolean;
  canCreateOrder: () => boolean;
  canUpdateOrderStatus: () => boolean;
  canProcessPayment: () => boolean;
  canManageSettings: () => boolean;
  
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
    notifications: true,
    autoPrint: false,
    darkMode: false,
  });
  const [loading, setLoading] = useState(true);

  // Initialize app data
  useEffect(() => {
    initializeApp();
  }, []);

  // Update color scheme when dark mode changes
  useEffect(() => {
    setColorScheme(settings.darkMode || false);
  }, [settings.darkMode]);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      
      // Load settings
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
      setColorScheme(loadedSettings.darkMode || false);
      
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

  // Permission check functions
  const checkHasAdminPermission = () => hasAdminPermission(currentUser);
  const checkCanEditMenu = () => canEditMenu(currentUser);
  const checkCanDeleteMenu = () => canDeleteMenu(currentUser);
  const checkCanAddMenuItem = () => canAddMenuItem(currentUser);
  const checkCanUpdateMenuItem = () => canUpdateMenuItem(currentUser);
  const checkCanCreateOrder = () => canCreateOrder(currentUser);
  const checkCanUpdateOrderStatus = () => canUpdateOrderStatus(currentUser);
  const checkCanProcessPayment = () => canProcessPayment(currentUser);
  const checkCanManageSettings = () => canManageSettings(currentUser);

  // Menu operations
  const addMenuItemHandler = async (item: MenuItem) => {
    if (!checkCanAddMenuItem()) {
      throw new Error('PERMISSION_DENIED');
    }
    
    try {
      const newItems = [...menuItems, item];
      await saveMenuItems(newItems);
      setMenuItems(newItems);
      console.log('Menu item added by:', currentUser?.name);
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateMenuItemHandler = async (id: string, updates: Partial<MenuItem>) => {
    if (!checkCanUpdateMenuItem()) {
      throw new Error('PERMISSION_DENIED');
    }
    
    try {
      const newItems = menuItems.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      await saveMenuItems(newItems);
      setMenuItems(newItems);
      console.log('Menu item updated by:', currentUser?.name);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItemHandler = async (id: string) => {
    if (!checkCanDeleteMenu()) {
      throw new Error('PERMISSION_DENIED');
    }
    
    try {
      const newItems = menuItems.filter(item => item.id !== id);
      await saveMenuItems(newItems);
      setMenuItems(newItems);
      console.log('Menu item deleted by:', currentUser?.name);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  // Order operations
  const addOrderHandler = async (order: Order) => {
    if (!checkCanCreateOrder()) {
      throw new Error('PERMISSION_DENIED');
    }
    
    try {
      await addOrderToStorage(order);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      console.log('Order created by:', currentUser?.name);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderHandler = async (id: string, updates: Partial<Order>) => {
    if (!checkCanUpdateOrderStatus()) {
      throw new Error('PERMISSION_DENIED');
    }
    
    try {
      await updateOrderInStorage(id, updates);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      console.log('Order updated by:', currentUser?.name);
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
        console.log('User logged in:', user.name, 'Role:', user.role);
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
      console.log('User logged out:', currentUser?.name);
      await saveCurrentUser(null);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // Settings operations
  const updateSettingsHandler = async (updates: Partial<AppSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      await saveSettings(newSettings);
      setSettings(newSettings);
      
      // Update color scheme if dark mode changed
      if (updates.darkMode !== undefined) {
        setColorScheme(updates.darkMode);
      }
      
      console.log('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const setLanguage = async (lang: Language) => {
    await updateSettingsHandler({ language: lang });
  };

  const setDarkMode = async (enabled: boolean) => {
    await updateSettingsHandler({ darkMode: enabled });
  };

  const updateUserPermissions = async (role: string, permissions: any) => {
    try {
      console.log('Updating permissions for role:', role, permissions);
      // In a real app, this would update the backend
      // For now, we just log the changes
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        menuItems,
        addMenuItem: addMenuItemHandler,
        updateMenuItem: updateMenuItemHandler,
        deleteMenuItem: deleteMenuItemHandler,
        orders,
        addOrder: addOrderHandler,
        updateOrder: updateOrderHandler,
        currentUser,
        login,
        logout,
        updateUserPermissions,
        settings,
        updateSettings: updateSettingsHandler,
        language: settings.language,
        setLanguage,
        darkMode: settings.darkMode || false,
        setDarkMode,
        hasAdminPermission: checkHasAdminPermission,
        canEditMenu: checkCanEditMenu,
        canDeleteMenu: checkCanDeleteMenu,
        canAddMenuItem: checkCanAddMenuItem,
        canUpdateMenuItem: checkCanUpdateMenuItem,
        canCreateOrder: checkCanCreateOrder,
        canUpdateOrderStatus: checkCanUpdateOrderStatus,
        canProcessPayment: checkCanProcessPayment,
        canManageSettings: checkCanManageSettings,
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
