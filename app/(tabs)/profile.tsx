
import React from 'react';
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
import { getRoleDisplayName } from '@/utils/permissions';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout, language, setLanguage, settings, updateSettings, darkMode, setDarkMode } = useApp();
  const t = translations[language];
  const colors = getColors(darkMode);

  const handleLogout = async () => {
    Alert.alert(
      t.logout || 'Logout',
      t.logoutConfirm || 'Are you sure you want to logout?',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.logout || 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleSwitchAccount = () => {
    Alert.alert(
      t.switchAccount || 'Switch Account',
      t.switchAccountConfirm || 'You will be logged out and redirected to the login screen.',
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.confirm || 'Confirm',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'mm' : 'en';
    await setLanguage(newLanguage);
  };

  const toggleDarkMode = async () => {
    await setDarkMode(!darkMode);
  };

  const buttonStyles = {
    primary: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    danger: {
      backgroundColor: colors.danger,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t.profile || 'Profile',
          headerShown: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info */}
          <View style={[styles.userCard, { backgroundColor: colors.card }]}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>
            <Text style={[styles.userName, { color: colors.text }]}>{currentUser?.name || 'User'}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{currentUser?.email || 'user@example.com'}</Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.roleText}>
                {currentUser ? getRoleDisplayName(currentUser.role, language) : 'User'}
              </Text>
            </View>
            {currentUser?.role === 'admin' && (
              <View style={[styles.adminBadge, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
                <IconSymbol name="checkmark.shield.fill" size={16} color={colors.success} />
                <Text style={[styles.adminBadgeText, { color: colors.success }]}>
                  {language === 'en' ? 'Full Access' : 'အပြည့်အဝ ဝင်ရောက်ခွင့်'}
                </Text>
              </View>
            )}
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.settings || 'Settings'}</Text>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingInfo}>
                <IconSymbol name="globe" size={24} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t.language || 'Language'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.languageButton, { backgroundColor: colors.border }]}
                onPress={toggleLanguage}
              >
                <Text style={[styles.languageButtonText, { color: colors.text }]}>
                  {language === 'en' ? 'English' : 'မြန်မာ'}
                </Text>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingInfo}>
                <IconSymbol name="moon.fill" size={24} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t.darkMode || 'Dark Mode'}
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingInfo}>
                <IconSymbol name="bell.fill" size={24} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t.notifications || 'Notifications'}
                </Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSettings({ notifications: value })}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
              <View style={styles.settingInfo}>
                <IconSymbol name="printer.fill" size={24} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t.autoPrint || 'Auto Print'}
                </Text>
              </View>
              <Switch
                value={settings.autoPrint}
                onValueChange={(value) => updateSettings({ autoPrint: value })}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>App Name:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>H.M POS</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Build:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>2024.01</Text>
              </View>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
            
            {/* Switch Account Button */}
            <TouchableOpacity
              style={[buttonStyles.primary, styles.actionButton]}
              onPress={handleSwitchAccount}
            >
              <IconSymbol name="arrow.left.arrow.right" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.actionButtonText]}>
                {t.switchAccount || 'Switch Account'}
              </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={[buttonStyles.danger, styles.actionButton]}
              onPress={handleLogout}
            >
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.actionButtonText]}>
                {t.logout || 'Logout'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  userCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonText: {
    marginLeft: 0,
  },
});
