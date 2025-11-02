
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { Order, OrderStatus } from '@/types';

export default function KitchenScreen() {
  const { orders, updateOrder, language } = useApp();
  const t = translations[language];
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  const activeOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'preparing'
  );

  const displayOrders = filter === 'active' ? activeOrders : orders;

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      Alert.alert(t.success, `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert(t.error, 'Failed to update order status');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'preparing': return colors.info;
      case 'ready': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const canMarkPreparing = item.status === 'pending';
    const canMarkReady = item.status === 'preparing';

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderTable}>Table: {item.tableNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{t[item.status]}</Text>
          </View>
        </View>

        <View style={styles.orderTime}>
          <IconSymbol name="clock.fill" color={colors.textSecondary} size={16} />
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((orderItem, index) => {
            // Safe access to menuItem properties with fallback to orderItem.name
            const itemName = orderItem.menuItem 
              ? (language === 'mm' ? orderItem.menuItem.nameMM || orderItem.menuItem.name : orderItem.menuItem.name)
              : orderItem.name;

            return (
              <View key={index} style={styles.itemRow}>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>{orderItem.quantity}x</Text>
                </View>
                <Text style={styles.itemName}>
                  {itemName}
                </Text>
              </View>
            );
          })}
        </View>

        {(canMarkPreparing || canMarkReady) && (
          <View style={styles.actionButtons}>
            {canMarkPreparing && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.info }]}
                onPress={() => handleUpdateStatus(item.id, 'preparing')}
              >
                <IconSymbol name="flame.fill" color="#FFFFFF" size={20} />
                <Text style={styles.actionButtonText}>{t.markPreparing}</Text>
              </TouchableOpacity>
            )}
            {canMarkReady && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={() => handleUpdateStatus(item.id, 'ready')}
              >
                <IconSymbol name="checkmark.circle.fill" color="#FFFFFF" size={20} />
                <Text style={styles.actionButtonText}>{t.markReady}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: t.kitchenOrders,
          }}
        />
      )}
      <View style={commonStyles.container}>
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterTabText, filter === 'active' && styles.filterTabTextActive]}>
              Active ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              {t.all} ({orders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orders List */}
        <FlatList
          data={displayOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={64} />
              <Text style={styles.emptyText}>
                {filter === 'active' ? 'No active orders' : t.empty}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.highlight,
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderTable: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  orderTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemsList: {
    gap: 12,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
});
