import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Sidebar
    'menu.dashboard': 'Dashboard',
    'menu.customers': 'All Customers',
    'menu.customerGroups': 'Customer Groups',
    'menu.reviews': 'Reviews',
    'menu.chatSupport': 'Chat Support',
    'menu.orders': 'All Orders',
    'menu.products': 'Products',
    'menu.inventory': 'Inventory',
    'menu.warehouse': 'Warehouse',
    'menu.marketing': 'Marketing',
    'menu.promotions': 'Promotions',
    'menu.posts': 'Posts',
    'menu.reports': 'Reports',
    'menu.warranty': 'Warranty',
    'menu.departments': 'Departments',
    'menu.userProfile': 'User Profile',
    'menu.settings': 'Settings',
    'menu.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': "Here's what's happening with your business today.",
    'dashboard.totalUsers': 'Total Users',
    'dashboard.revenue': 'Revenue',
    'dashboard.orders': 'Orders',
    'dashboard.products': 'Products',
    'dashboard.fromLastMonth': 'from last month',
    
    // Settings
    'settings.general': 'General Settings',
    'settings.appName': 'Application Name',
    'settings.language': 'Language',
    'settings.timezone': 'Timezone',
    'settings.notifications': 'Notifications',
    'settings.emailNotifications': 'Email Notifications',
    'settings.emailNotificationsDesc': 'Receive email notifications for important updates',
    'settings.pushNotifications': 'Push Notifications',
    'settings.pushNotificationsDesc': 'Receive push notifications in your browser',
    'settings.saveChanges': 'Save Changes',
  },
  vi: {
    // Sidebar
    'menu.dashboard': 'Trang chủ',
    'menu.customers': 'Khách hàng',
    'menu.customerGroups': 'Nhóm khách hàng',
    'menu.reviews': 'Đánh giá',
    'menu.chatSupport': 'Hỗ trợ Chat',
    'menu.orders': 'Đơn hàng',
    'menu.products': 'Sản phẩm',
    'menu.inventory': 'Kho hàng',
    'menu.warehouse': 'Nhà kho',
    'menu.marketing': 'Marketing',
    'menu.promotions': 'Khuyến mãi',
    'menu.posts': 'Bài viết',
    'menu.reports': 'Báo cáo',
    'menu.warranty': 'Bảo hành',
    'menu.departments': 'Phòng ban',
    'menu.userProfile': 'Hồ sơ',
    'menu.settings': 'Cài đặt',
    'menu.logout': 'Đăng xuất',
    
    // Dashboard
    'dashboard.welcome': 'Chào mừng trở lại',
    'dashboard.subtitle': 'Đây là những gì đang diễn ra với doanh nghiệp của bạn hôm nay.',
    'dashboard.totalUsers': 'Tổng người dùng',
    'dashboard.revenue': 'Doanh thu',
    'dashboard.orders': 'Đơn hàng',
    'dashboard.products': 'Sản phẩm',
    'dashboard.fromLastMonth': 'so với tháng trước',
    
    // Settings
    'settings.general': 'Cài đặt chung',
    'settings.appName': 'Tên ứng dụng',
    'settings.language': 'Ngôn ngữ',
    'settings.timezone': 'Múi giờ',
    'settings.notifications': 'Thông báo',
    'settings.emailNotifications': 'Thông báo Email',
    'settings.emailNotificationsDesc': 'Nhận thông báo qua email cho các cập nhật quan trọng',
    'settings.pushNotifications': 'Thông báo đẩy',
    'settings.pushNotificationsDesc': 'Nhận thông báo đẩy trên trình duyệt của bạn',
    'settings.saveChanges': 'Lưu thay đổi',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
