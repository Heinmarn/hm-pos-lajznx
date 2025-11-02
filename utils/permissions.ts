
import { User, UserRole } from '@/types';

/**
 * Permission utilities for role-based access control
 */

export const hasAdminPermission = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const canEditMenu = (user: User | null): boolean => {
  return hasAdminPermission(user);
};

export const canDeleteMenu = (user: User | null): boolean => {
  return hasAdminPermission(user);
};

export const canAddMenuItem = (user: User | null): boolean => {
  return hasAdminPermission(user);
};

export const canUpdateMenuItem = (user: User | null): boolean => {
  return hasAdminPermission(user);
};

export const canManageSettings = (user: User | null): boolean => {
  return hasAdminPermission(user);
};

export const canViewReports = (user: User | null): boolean => {
  // All users can view reports, but this can be restricted if needed
  return true;
};

export const canCreateOrder = (user: User | null): boolean => {
  // Admin and cashier can create orders
  return user?.role === 'admin' || user?.role === 'cashier';
};

export const canUpdateOrderStatus = (user: User | null): boolean => {
  // Admin, cashier, and kitchen staff can update order status
  return user?.role === 'admin' || user?.role === 'cashier' || user?.role === 'kitchen';
};

export const canProcessPayment = (user: User | null): boolean => {
  // Admin and cashier can process payments
  return user?.role === 'admin' || user?.role === 'cashier';
};

export const getRoleDisplayName = (role: UserRole, language: 'en' | 'mm' = 'en'): string => {
  const roleNames = {
    en: {
      admin: 'Administrator',
      cashier: 'Cashier',
      kitchen: 'Kitchen Staff',
    },
    mm: {
      admin: 'စီမံခန့်ခွဲသူ',
      cashier: 'ငွေကိုင်',
      kitchen: 'မီးဖိုမှူး',
    },
  };

  return roleNames[language][role] || role;
};

export const getPermissionDeniedMessage = (language: 'en' | 'mm' = 'en'): string => {
  return language === 'en'
    ? 'You do not have permission to perform this action. Only administrators can make changes.'
    : 'သင့်တွင် ဤလုပ်ဆောင်ချက်ကို လုပ်ဆောင်ရန် ခွင့်ပြုချက်မရှိပါ။ စီမံခန့်ခွဲသူများသာ ပြောင်းလဲမှုများ ပြုလုပ်နိုင်ပါသည်။';
};
