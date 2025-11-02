
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export default function ReportsScreen() {
  const { orders, language } = useApp();
  const t = translations[language];
  const [period, setPeriod] = useState<ReportPeriod>('daily');

  const reportData = useMemo(() => {
    const now = new Date();
    let filteredOrders = orders;

    // Filter orders based on period
    if (period === 'daily') {
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= weekAgo;
      });
    } else if (period === 'monthly') {
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === now.getMonth() && 
               orderDate.getFullYear() === now.getFullYear();
      });
    }

    // Calculate totals
    const totalOrders = filteredOrders.length;
    const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / paidOrders.length : 0;

    // Item breakdown
    const itemMap = new Map<string, { name: string; nameMM: string; quantity: number; revenue: number }>();
    paidOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = itemMap.get(item.menuItemId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          itemMap.set(item.menuItemId, {
            name: item.menuItem.name,
            nameMM: item.menuItem.nameMM,
            quantity: item.quantity,
            revenue: item.subtotal,
          });
        }
      });
    });

    const itemBreakdown = Array.from(itemMap.values())
      .sort((a, b) => b.revenue - a.revenue);

    // Payment method breakdown
    const paymentMap = new Map<string, { count: number; total: number }>();
    paidOrders.forEach(order => {
      if (order.paymentMethod) {
        const existing = paymentMap.get(order.paymentMethod);
        if (existing) {
          existing.count += 1;
          existing.total += order.total;
        } else {
          paymentMap.set(order.paymentMethod, { count: 1, total: order.total });
        }
      }
    });

    const paymentBreakdown = Array.from(paymentMap.entries()).map(([method, data]) => ({
      method,
      ...data,
    }));

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      itemBreakdown,
      paymentBreakdown,
    };
  }, [orders, period]);

  const periods: Array<{ key: ReportPeriod; label: string }> = [
    { key: 'daily', label: t.daily },
    { key: 'weekly', label: t.weekly },
    { key: 'monthly', label: t.monthly },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t.salesReport,
          }}
        />
      )}
      <View style={commonStyles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            Platform.OS !== 'ios' && styles.contentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodTab, period === p.key && styles.periodTabActive]}
                onPress={() => setPeriod(p.key)}
              >
                <Text style={[styles.periodTabText, period === p.key && styles.periodTabTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
              <IconSymbol name="cart.fill" color="#FFFFFF" size={32} />
              <Text style={styles.summaryValue}>{reportData.totalOrders}</Text>
              <Text style={styles.summaryLabel}>{t.totalOrders}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: colors.accent }]}>
              <IconSymbol name="dollarsign.circle.fill" color="#FFFFFF" size={32} />
              <Text style={styles.summaryValue}>{reportData.totalRevenue.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>{t.totalRevenue}</Text>
            </View>
          </View>

          <View style={commonStyles.card}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Order Value:</Text>
              <Text style={styles.statValue}>
                {reportData.averageOrderValue.toLocaleString()} MMK
              </Text>
            </View>
          </View>

          {/* Item Breakdown */}
          <Text style={styles.sectionTitle}>{t.itemBreakdown}</Text>
          {reportData.itemBreakdown.length > 0 ? (
            <View style={commonStyles.card}>
              {reportData.itemBreakdown.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>
                      {language === 'mm' ? item.nameMM : item.name}
                    </Text>
                    <Text style={styles.itemQuantity}>{item.quantity} sold</Text>
                  </View>
                  <Text style={styles.itemRevenue}>{item.revenue.toLocaleString()} MMK</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={commonStyles.card}>
              <Text style={styles.emptyText}>{t.empty}</Text>
            </View>
          )}

          {/* Payment Method Breakdown */}
          {reportData.paymentBreakdown.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <View style={commonStyles.card}>
                {reportData.paymentBreakdown.map((payment, index) => (
                  <View key={index} style={styles.paymentRow}>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentMethod}>{t[payment.method]}</Text>
                      <Text style={styles.paymentCount}>{payment.count} transactions</Text>
                    </View>
                    <Text style={styles.paymentTotal}>{payment.total.toLocaleString()} MMK</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  contentWithTabBar: {
    paddingBottom: 100,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: colors.primary,
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: colors.text,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  paymentCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
