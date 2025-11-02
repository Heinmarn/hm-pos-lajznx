
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { UserRole } from '@/types';
import { getRoleDisplayName } from '@/utils/permissions';

interface RolePermissions {
  canCreateOrder: boolean;
  canUpdateOrderStatus: boolean;
  canProcessPayment: boolean;
  canViewReports: boolean;
  canEditMenu: boolean;
  canDeleteMenu: boolean;
  canManageSettings: boolean;
}

export default function PermissionManagementScreen() {
  const router = useRouter();
  const { currentUser, language, darkMode, hasAdminPermission, updateUserPermissions } = useApp();
  const t = translations[language];
  const colors = getColors(darkMode);

  // Default permissions for each role
  const [cashierPermissions, setCashierPermissions] = useState<RolePermissions>({
    canCreateOrder: true,
    canUpdateOrderStatus: true,
    canProcessPayment: true,
    canViewReports: true,
    canEditMenu: false,
    canDeleteMenu: false,
    canManageSettings: false,
  });

  const [kitchenPermissions, setKitchenPermissions] = useState<RolePermissions>({
    canCreateOrder: false,
    canUpdateOrderStatus: true,
    canProcessPayment: false,
    canViewReports: false,
    canEditMenu: false,
    canDeleteMenu: false,
    canManageSettings: false,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: Platform.OS !== 'ios' ? 100 : 20,
    },
    header: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 24,
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      elevation: 3,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    permissionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    permissionItemLast: {
      borderBottomWidth: 0,
    },
    permissionInfo: {
      flex: 1,
      marginRight: 12,
    },
    permissionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    permissionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    deniedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    deniedIcon: {
      marginBottom: 16,
    },
    deniedTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    deniedText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  // Check if user has admin permission
  if (!hasAdminPermission()) {
    return (
      <>
        <Stack.Screen
          options={{
            title: language === 'en' ? 'Permission Management' : 'ခွင့်ပြုချက်စီမံခန့်ခွဲမှု',
            headerShown: Platform.OS === 'ios',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        />
        <View style={[styles.container, styles.deniedContainer]}>
          <View style={styles.deniedIcon}>
            <IconSymbol name="lock.shield.fill" size={80} color={colors.danger} />
          </View>
          <Text style={styles.deniedTitle}>
            {language === 'en' ? 'Access Denied' : 'ဝင်ရောက်ခွင့်မရှိပါ'}
          </Text>
          <Text style={styles.deniedText}>
            {language === 'en'
              ? 'Only administrators can manage user permissions.'
              : 'စီမံခန့်ခွဲသူများသာ အသုံးပြုသူခွင့်ပြုချက်များကို စီမံခန့်ခွဲနိုင်ပါသည်။'}
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>
              {language === 'en' ? 'Go Back' : 'နောက်သို့'}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const toggleCashierPermission = (key: keyof RolePermissions) => {
    setCashierPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleKitchenPermission = (key: keyof RolePermissions) => {
    setKitchenPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    Alert.alert(
      t.success || 'Success',
      language === 'en'
        ? 'Permissions have been updated successfully.'
        : 'ခွင့်ပြုချက်များကို အောင်မြင်စွာ အပ်ဒိတ်လုပ်ပြီးပါပြီ။',
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Cashier Permissions:', cashierPermissions);
            console.log('Kitchen Permissions:', kitchenPermissions);
            // In a real app, you would save these to the backend
          },
        },
      ]
    );
  };

  const permissionsList = [
    {
      key: 'canCreateOrder' as keyof RolePermissions,
      label: language === 'en' ? 'Create Orders' : 'အော်ဒါများ ဖန်တီးရန်',
      description: language === 'en' ? 'Allow creating new orders' : 'အော်ဒါအသစ်များ ဖန်တီးခွင့်ပြုရန်',
    },
    {
      key: 'canUpdateOrderStatus' as keyof RolePermissions,
      label: language === 'en' ? 'Update Order Status' : 'အော်ဒါအခြေအနေ အပ်ဒိတ်လုပ်ရန်',
      description: language === 'en' ? 'Allow updating order status' : 'အော်ဒါအခြေအနေ ပြောင်းလဲခွင့်ပြုရန်',
    },
    {
      key: 'canProcessPayment' as keyof RolePermissions,
      label: language === 'en' ? 'Process Payments' : 'ငွေပေးချေမှု စီမံရန်',
      description: language === 'en' ? 'Allow processing payments' : 'ငွေပေးချေမှု လုပ်ဆောင်ခွင့်ပြုရန်',
    },
    {
      key: 'canViewReports' as keyof RolePermissions,
      label: language === 'en' ? 'View Reports' : 'အစီရင်ခံစာများ ကြည့်ရှုရန်',
      description: language === 'en' ? 'Allow viewing sales reports' : 'ရောင်းချမှုအစီရင်ခံစာများ ကြည့်ရှုခွင့်ပြုရန်',
    },
    {
      key: 'canEditMenu' as keyof RolePermissions,
      label: language === 'en' ? 'Edit Menu' : 'မီနူး ပြင်ဆင်ရန်',
      description: language === 'en' ? 'Allow editing menu items' : 'မီနူးပစ္စည်းများ ပြင်ဆင်ခွင့်ပြုရန်',
    },
    {
      key: 'canDeleteMenu' as keyof RolePermissions,
      label: language === 'en' ? 'Delete Menu Items' : 'မီနူးပစ္စည်းများ ဖျက်ရန်',
      description: language === 'en' ? 'Allow deleting menu items' : 'မီနူးပစ္စည်းများ ဖျက်ခွင့်ပြုရန်',
    },
    {
      key: 'canManageSettings' as keyof RolePermissions,
      label: language === 'en' ? 'Manage Settings' : 'ဆက်တင်များ စီမံရန်',
      description: language === 'en' ? 'Allow managing app settings' : 'အက်ပ်ဆက်တင်များ စီမံခွင့်ပြုရန်',
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: language === 'en' ? 'Permission Management' : 'ခွင့်ပြုချက်စီမံခန့်ခွဲမှု',
          headerShown: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {language === 'en' ? 'Permission Management' : 'ခွင့်ပြုချက်စီမံခန့်ခွဲမှု'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {language === 'en'
                ? 'Control access permissions for different user roles'
                : 'အသုံးပြုသူအမျိုးအစားများအတွက် ဝင်ရောက်ခွင့်များကို ထိန်းချုပ်ပါ'}
            </Text>
          </View>

          {/* Cashier Permissions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="person.fill" size={24} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>
                {getRoleDisplayName('cashier', language)}
              </Text>
            </View>
            <View style={styles.card}>
              {permissionsList.map((permission, index) => (
                <View
                  key={permission.key}
                  style={[
                    styles.permissionItem,
                    index === permissionsList.length - 1 && styles.permissionItemLast,
                  ]}
                >
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionLabel}>{permission.label}</Text>
                    <Text style={styles.permissionDescription}>{permission.description}</Text>
                  </View>
                  <Switch
                    value={cashierPermissions[permission.key]}
                    onValueChange={() => toggleCashierPermission(permission.key)}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Kitchen Permissions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="flame.fill" size={24} color={colors.warning} />
              </View>
              <Text style={styles.sectionTitle}>
                {getRoleDisplayName('kitchen', language)}
              </Text>
            </View>
            <View style={styles.card}>
              {permissionsList.map((permission, index) => (
                <View
                  key={permission.key}
                  style={[
                    styles.permissionItem,
                    index === permissionsList.length - 1 && styles.permissionItemLast,
                  ]}
                >
                  <View style={styles.permissionInfo}>
                    <Text style={styles.permissionLabel}>{permission.label}</Text>
                    <Text style={styles.permissionDescription}>{permission.description}</Text>
                  </View>
                  <Switch
                    value={kitchenPermissions[permission.key]}
                    onValueChange={() => toggleKitchenPermission(permission.key)}
                    trackColor={{ false: colors.border, true: colors.success }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {language === 'en' ? 'Save Changes' : 'ပြောင်းလဲမှုများ သိမ်းဆည်းရန်'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}
