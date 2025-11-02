
import { Language } from '@/types';

export const translations = {
  en: {
    // App name
    appName: 'H.M POS',
    
    // Navigation
    home: 'Home',
    menu: 'Menu',
    orders: 'Orders',
    kitchen: 'Kitchen',
    reports: 'Reports',
    settings: 'Settings',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    switchAccount: 'Switch Account',
    email: 'Email',
    password: 'Password',
    loginButton: 'Login',
    loginError: 'Invalid email or password',
    
    // Menu Management
    menuManagement: 'Menu Management',
    addMenuItem: 'Add Menu Item',
    editMenuItem: 'Edit Menu Item',
    deleteMenuItem: 'Delete Menu Item',
    itemName: 'Item Name',
    itemNameMM: 'Item Name (Myanmar)',
    price: 'Price',
    category: 'Category',
    available: 'Available',
    unavailable: 'Unavailable',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    
    // Categories
    salad: 'Salad',
    mainCourse: 'Main Course',
    beverages: 'Beverages',
    desserts: 'Desserts',
    
    // Orders
    newOrder: 'New Order',
    orderNumber: 'Order #',
    tableNumber: 'Table Number',
    addItem: 'Add Item',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    tax: 'Tax',
    total: 'Total',
    placeOrder: 'Place Order',
    
    // Order Status
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Payment
    payment: 'Payment',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    kbzpay: 'KBZPay',
    wavepay: 'WavePay',
    payNow: 'Pay Now',
    paid: 'Paid',
    paymentPending: 'Payment Pending',
    
    // Kitchen
    kitchenOrders: 'Kitchen Orders',
    markPreparing: 'Mark Preparing',
    markReady: 'Mark Ready',
    
    // Reports
    salesReport: 'Sales Report',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    itemBreakdown: 'Item Breakdown',
    
    // Settings
    language: 'Language',
    english: 'English',
    myanmar: 'Myanmar',
    taxRate: 'Tax Rate',
    currency: 'Kyats',
    currencySymbol: 'Ks',
    darkMode: 'Dark Mode',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    empty: 'No items found',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    
    // Additional
    profile: 'Profile',
    welcomeBack: 'Welcome Back',
    demoAccounts: 'Demo Accounts',
    admin: 'Admin',
    cashier: 'Cashier',
    loggingIn: 'Logging in...',
    pleaseEnterCredentials: 'Please enter email and password',
    invalidCredentials: 'Invalid email or password',
    loginFailed: 'Login failed. Please try again.',
    confirmDelete: 'Confirm Delete',
    selectedItems: 'Selected Items',
    submitOrder: 'Submit Order',
    notifications: 'Notifications',
    autoPrint: 'Auto Print',
    logoutConfirm: 'Are you sure you want to logout?',
    switchAccountConfirm: 'You will be logged out and redirected to the login screen.',
  },
  mm: {
    // App name
    appName: 'H.M POS',
    
    // Navigation
    home: 'ပင်မ',
    menu: 'မီနူး',
    orders: 'အော်ဒါများ',
    kitchen: 'မီးဖိုချောင်',
    reports: 'အစီရင်ခံစာများ',
    settings: 'ဆက်တင်များ',
    
    // Auth
    login: 'ဝင်ရောက်ရန်',
    logout: 'ထွက်ရန်',
    switchAccount: 'အကောင့်ပြောင်းရန်',
    email: 'အီးမေးလ်',
    password: 'စကားဝှက်',
    loginButton: 'ဝင်ရောက်ရန်',
    loginError: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်',
    
    // Menu Management
    menuManagement: 'မီနူးစီမံခန့်ခွဲမှု',
    addMenuItem: 'မီနူးထည့်ရန်',
    editMenuItem: 'မီနူးပြင်ဆင်ရန်',
    deleteMenuItem: 'မီနူးဖျက်ရန်',
    itemName: 'အမည်',
    itemNameMM: 'အမည် (မြန်မာ)',
    price: 'စျေးနှုန်း',
    category: 'အမျိုးအစား',
    available: 'ရရှိနိုင်သည်',
    unavailable: 'မရရှိနိုင်ပါ',
    save: 'သိမ်းဆည်းရန်',
    cancel: 'ပယ်ဖျက်ရန်',
    delete: 'ဖျက်ရန်',
    
    // Categories
    salad: 'သုပ်',
    mainCourse: 'ပင်မဟင်း',
    beverages: 'အဖျော်ရည်',
    desserts: 'အချိုပွဲ',
    
    // Orders
    newOrder: 'အော်ဒါအသစ်',
    orderNumber: 'အော်ဒါနံပါတ် #',
    tableNumber: 'စားပွဲနံပါတ်',
    addItem: 'ထည့်ရန်',
    quantity: 'အရေအတွက်',
    subtotal: 'စုစုပေါင်း',
    tax: 'အခွန်',
    total: 'စုစုပေါင်း',
    placeOrder: 'အော်ဒါမှာရန်',
    
    // Order Status
    pending: 'စောင့်ဆိုင်းဆဲ',
    preparing: 'ပြင်ဆင်နေသည်',
    ready: 'အဆင်သင့်',
    completed: 'ပြီးစီးပြီ',
    cancelled: 'ပယ်ဖျက်ပြီး',
    
    // Payment
    payment: 'ငွေပေးချေမှု',
    paymentMethod: 'ငွေပေးချေမှုနည်းလမ်း',
    cash: 'ငွေသား',
    kbzpay: 'KBZPay',
    wavepay: 'WavePay',
    payNow: 'ယခုပေးချေရန်',
    paid: 'ပေးချေပြီး',
    paymentPending: 'ငွေပေးချေမှုစောင့်ဆိုင်းဆဲ',
    
    // Kitchen
    kitchenOrders: 'မီးဖိုချောင်အော်ဒါများ',
    markPreparing: 'ပြင်ဆင်နေသည်ဟုမှတ်သားရန်',
    markReady: 'အဆင်သင့်ဟုမှတ်သားရန်',
    
    // Reports
    salesReport: 'ရောင်းချမှုအစီရင်ခံစာ',
    daily: 'နေ့စဉ်',
    weekly: 'အပတ်စဉ်',
    monthly: 'လစဉ်',
    totalOrders: 'စုစုပေါင်းအော်ဒါများ',
    totalRevenue: 'စုစုပေါင်းဝင်ငွေ',
    itemBreakdown: 'ပစ္စည်းအသေးစိတ်',
    
    // Settings
    language: 'ဘာသာစကား',
    english: 'အင်္ဂလိပ်',
    myanmar: 'မြန်မာ',
    taxRate: 'အခွန်နှုန်း',
    currency: 'ကျပ်',
    currencySymbol: 'ကျပ်',
    darkMode: 'အမှောင်မုဒ်',
    
    // Common
    search: 'ရှာဖွေရန်',
    filter: 'စစ်ထုတ်ရန်',
    all: 'အားလုံး',
    today: 'ယနေ့',
    thisWeek: 'ဒီအပတ်',
    thisMonth: 'ဒီလ',
    empty: 'မတွေ့ရှိပါ',
    loading: 'တင်နေသည်...',
    error: 'အမှား',
    success: 'အောင်မြင်ပါသည်',
    confirm: 'အတည်ပြုရန်',
    back: 'နောက်သို့',
    
    // Additional
    profile: 'ကိုယ်ရေးအချက်အလက်',
    welcomeBack: 'ပြန်လည်ကြိုဆိုပါတယ်',
    demoAccounts: 'စမ်းသပ်အကောင့်များ',
    admin: 'စီမံခန့်ခွဲသူ',
    cashier: 'ငွေကောင်တာ',
    loggingIn: 'ဝင်ရောက်နေသည်...',
    pleaseEnterCredentials: 'အီးမေးလ်နှင့် စကားဝှက်ထည့်ပါ',
    invalidCredentials: 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်',
    loginFailed: 'ဝင်ရောက်မှု မအောင်မြင်ပါ။ ထပ်မံကြိုးစားပါ။',
    confirmDelete: 'ဖျက်ရန် အတည်ပြုပါ',
    selectedItems: 'ရွေးချယ်ထားသော ပစ္စည်းများ',
    submitOrder: 'အော်ဒါတင်ရန်',
    notifications: 'အသိပေးချက်များ',
    autoPrint: 'အလိုအလျောက်ပုံနှိပ်ရန်',
    logoutConfirm: 'ထွက်ရန် သေချာပါသလား?',
    switchAccountConfirm: 'သင့်အကောင့်မှ ထွက်ပြီး လော့ဂ်အင်စာမျက်နှာသို့ ပြန်သွားပါမည်။',
  },
};

export const t = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
