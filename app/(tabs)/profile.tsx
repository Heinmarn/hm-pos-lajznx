
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
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout, language, setLanguage, settings, updateSettings } = useApp();
  const t = translations[language];

  const handleLogout = async () => {
    Alert.alert(
      t.logout || 'Logout',
      'Are you sure you want to logout?',
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

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'mm' : 'en';
    await setLanguage(newLanguage);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t.profile || 'Profile',
          headerShown: Platform.OS === 'ios',
        }}
      />
      <View style={commonStyles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            </View>
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'user@example.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}
              </Text>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.settings || 'Settings'}</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="globe" size={24} color={colors.primary} />
                <Text style={styles.settingLabel}>
                  {t.language || 'Language'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={toggleLanguage}
              >
                <Text style={styles.languageButtonText}>
                  {language === 'en' ? 'English' : 'မြန်မာ'}
                </Text>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="bell.fill" size={24} color={colors.primary} />
                <Text style={styles.settingLabel}>
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

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <IconSymbol name="printer.fill" size={24} color={colors.primary} />
                <Text style={styles.settingLabel}>
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
            <Text style={styles.sectionTitle}>About</Text>
            <View style={commonStyles.card}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App Name:</Text>
                <Text style={styles.infoValue}>H.M POS</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version:</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Build:</Text>
                <Text style={styles.infoValue}>2024.01</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[buttonStyles.danger, styles.logoutButton]}
            onPress={handleLogout}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FFFFFF" />
            <Text style={[commonStyles.buttonText, styles.logoutButtonText]}>
              {t.logout || 'Logout'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.card,
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
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.primary,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
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
    color: colors.text,
    fontWeight: '500',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.border,
    borderRadius: 8,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    marginLeft: 0,
  },
});
