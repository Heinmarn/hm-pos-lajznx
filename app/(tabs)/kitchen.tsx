
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { Order, OrderStatus } from '@/types';

export default function KitchenScreen() {
  const { orders, updateOrder, language, menuItems } = useApp();
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing'>('all');

  const activeOrders = orders.filter(order => 
    order.status !== 'completed' && order.status !== 'cancelled'
  );

  const filteredOrders = filter === 'all' 
    ? activeOrders 
    : activeOrders.filter(order => order.status === filter);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      console.log(`Order ${orderId} status updated to ${newStatus}`);
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
      case 'completed': return colors.textSecondary;
      case 'cancelled': return colors.secondary;
      default: return colors.text;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    // Get menu item details for each order item
    const orderItemsWithDetails = item.items.map(orderItem => {
      const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
      return {
        ...orderItem,
        menuItem: menuItem || { 
          id: orderItem.menuItemId, 
          name: orderItem.name || 'Unknown Item',
          nameMM: orderItem.name || 'Unknown Item',
          price: orderItem.price,
          category: '',
          available: true
        }
      };
    });

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>{item.orderNumber || `#${item.id.slice(0, 8)}`}</Text>
            <Text style={styles.orderTable}>
              {language === 'en' ? 'Table' : 'စားပွဲ'}: {item.tableNumber}
            </Text>
            <Text style={styles.orderTime}>
              {new Date(item.createdAt).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{t[item.status]}</Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {orderItemsWithDetails.map((orderItem, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>{orderItem.quantity}x</Text>
              </View>
              <Text style={styles.itemName}>
                {language === 'mm' && orderItem.menuItem?.nameMM 
                  ? orderItem.menuItem.nameMM 
                  : orderItem.menuItem?.name || orderItem.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.info }]}
              onPress={() => handleUpdateStatus(item.id, 'preparing')}
            >
              <IconSymbol name="flame.fill" color="#FFFFFF" size={20} />
              <Text style={styles.actionButtonText}>{t.markPreparing}</Text>
            </TouchableOpacity>
          )}

          {item.status === 'preparing' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => handleUpdateStatus(item.id, 'ready')}
            >
              <IconSymbol name="checkmark.circle.fill" color="#FFFFFF" size={20} />
              <Text style={styles.actionButtonText}>{t.markReady}</Text>
            </TouchableOpacity>
          )}

          {item.status === 'ready' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => handleUpdateStatus(item.id, 'completed')}
            >
              <IconSymbol name="checkmark.circle.fill" color="#FFFFFF" size={20} />
              <Text style={styles.actionButtonText}>
                {language === 'en' ? 'Complete' : 'ပြီးစီးပြီ'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const filters: Array<{ key: 'all' | 'pending' | 'preparing'; label: string }> = [
    { key: 'all', label: t.all },
    { key: 'pending', label: t.pending },
    { key: 'preparing', label: t.preparing },
  ];

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
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={64} />
              <Text style={styles.emptyText}>
                {language === 'en' ? 'All orders completed!' : 'အော်ဒါအားလုံးပြီးစီးပါပြီ!'}
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
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderTable: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemsList: {
    marginBottom: 16,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  actionButtons: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
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
