
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { getRoleDisplayName } from '@/utils/permissions';

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, logout, language, menuItems, orders, hasAdminPermission } = useApp();
  const t = translations[language];
  const isAdmin = hasAdminPermission();

  const handleLogout = async () => {
    Alert.alert(
      t.logout,
      'Are you sure you want to logout?',
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const quickActions = [
    {
      title: t.newOrder,
      icon: 'plus.circle.fill',
      color: colors.primary,
      onPress: () => router.push('/new-order'),
    },
    {
      title: t.menuManagement,
      icon: 'list.bullet',
      color: colors.accent,
      onPress: () => router.push('/menu-management'),
    },
    {
      title: t.kitchenOrders,
      icon: 'flame.fill',
      color: colors.warning,
      onPress: () => router.push('/(tabs)/kitchen'),
    },
    {
      title: t.salesReport,
      icon: 'chart.bar.fill',
      color: colors.info,
      onPress: () => router.push('/(tabs)/reports'),
    },
  ];

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t.appName,
            headerRight: () => (
              <TouchableOpacity onPress={() => router.push('/settings')} style={styles.headerButton}>
                <IconSymbol name="gear" color={colors.text} size={24} />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <View style={[commonStyles.container]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {language === 'en' ? 'Welcome back,' : 'ပြန်လည်ကြိုဆိုပါတယ်,'}
              </Text>
              <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
              <Text style={styles.userRole}>
                {currentUser ? getRoleDisplayName(currentUser.role, language) : 'User'}
              </Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" color={colors.secondary} size={24} />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
              <IconSymbol name="cart.fill" color="#FFFFFF" size={32} />
              <Text style={styles.statValue}>{todayOrders.length}</Text>
              <Text style={styles.statLabel}>{t.today} {t.orders}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
              <IconSymbol name="dollarsign.circle.fill" color="#FFFFFF" size={32} />
              <Text style={styles.statValue}>{todayRevenue.toLocaleString()}</Text>
              <Text style={styles.statLabel}>{t.totalRevenue}</Text>
            </View>
          </View>

          {/* Permission Notice for Non-Admin */}
          {!isAdmin && (
            <View style={styles.permissionNotice}>
              <IconSymbol name="info.circle.fill" color={colors.info} size={20} />
              <Text style={styles.permissionNoticeText}>
                {language === 'en'
                  ? 'You have view-only access. Contact an administrator to make changes.'
                  : 'သင့်တွင် ကြည့်ရှုခွင့်သာရှိသည်။ ပြောင်းလဲမှုများပြုလုပ်ရန် စီမံခန့်ခွဲသူကို ဆက်သွယ်ပါ။'}
              </Text>
            </View>
          )}

          {/* Pending Orders Alert */}
          {pendingOrders.length > 0 && (
            <TouchableOpacity 
              style={styles.alertCard}
              onPress={() => router.push('/(tabs)/kitchen')}
            >
              <IconSymbol name="exclamationmark.triangle.fill" color={colors.warning} size={24} />
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>
                  {pendingOrders.length} {t.pending} {t.orders}
                </Text>
                <Text style={styles.alertText}>Tap to view in kitchen</Text>
              </View>
              <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <IconSymbol name={action.icon} color="#FFFFFF" size={28} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Menu Summary */}
          <Text style={styles.sectionTitle}>{t.menu} Summary</Text>
          <View style={commonStyles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items:</Text>
              <Text style={styles.summaryValue}>{menuItems.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Available:</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {menuItems.filter(item => item.available).length}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unavailable:</Text>
              <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                {menuItems.filter(item => !item.available).length}
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  logoutButton: {
    padding: 8,
  },
  permissionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.info + '40',
  },
  permissionNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
