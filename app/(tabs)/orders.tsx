
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { Order, OrderStatus } from '@/types';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, language } = useApp();
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'preparing': return colors.info;
      case 'ready': return colors.success;
      case 'completed': return colors.textSecondary;
      case 'cancelled': return colors.secondary;
      default: return colors.text;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'refunded': return colors.secondary;
      default: return colors.text;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/order-details?id=${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
          <Text style={styles.orderTable}>Table: {item.tableNumber}</Text>
        </View>
        <View style={styles.orderBadges}>
          <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{t[item.status]}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <Text key={index} style={styles.orderItemText}>
            {orderItem.quantity}x {language === 'mm' ? orderItem.menuItem.nameMM : orderItem.menuItem.name}
          </Text>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.orderItemText}>+{item.items.length - 2} more items</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.orderTotal}>{item.total.toLocaleString()} MMK</Text>
          <Text style={[styles.paymentStatus, { color: getPaymentStatusColor(item.paymentStatus) }]}>
            {t[item.paymentStatus]}
          </Text>
        </View>
        <Text style={styles.orderTime}>
          {new Date(item.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filters: Array<{ key: 'all' | OrderStatus; label: string }> = [
    { key: 'all', label: t.all },
    { key: 'pending', label: t.pending },
    { key: 'preparing', label: t.preparing },
    { key: 'ready', label: t.ready },
    { key: 'completed', label: t.completed },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t.orders,
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => router.push('/new-order')} 
                style={styles.headerButton}
              >
                <IconSymbol name="plus.circle.fill" color={colors.primary} size={28} />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <View style={commonStyles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filters}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  filter === item.key && styles.filterTabActive,
                ]}
                onPress={() => setFilter(item.key)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filter === item.key && styles.filterTabTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          />
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="tray.fill" color={colors.textSecondary} size={64} />
              <Text style={styles.emptyText}>{t.empty}</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        {Platform.OS !== 'ios' && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push('/new-order')}
          >
            <IconSymbol name="plus" color="#FFFFFF" size={28} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  filterContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderTable: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderBadges: {
    gap: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 12,
    gap: 4,
  },
  orderItemText: {
    fontSize: 14,
    color: colors.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
});
