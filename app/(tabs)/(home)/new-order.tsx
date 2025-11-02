
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { Order, OrderItem, OrderStatus } from '@/types';

export default function NewOrderScreen() {
  const router = useRouter();
  const { menuItems, addOrder, language, currentUser, darkMode } = useApp();
  const t = translations[language];
  const colors = getColors(darkMode);

  const [tableNumber, setTableNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

  // Number of tables available (you can make this configurable later)
  const totalTables = 10;

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
    tableSelectionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 8,
    },
    tableButton: {
      width: Platform.select({ ios: 70, android: 70, default: 80 }),
      height: Platform.select({ ios: 70, android: 70, default: 80 }),
      backgroundColor: '#FF4444',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#CC0000',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    tableButtonSelected: {
      backgroundColor: '#00CC00',
      borderColor: '#009900',
      transform: [{ scale: 1.05 }],
    },
    tableButtonContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tableButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      marginTop: 4,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    menuItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    menuItemInfo: {
      flex: 1,
    },
    menuItemName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    menuItemPrice: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    menuItemUnavailable: {
      opacity: 0.5,
    },
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      minWidth: 24,
      textAlign: 'center',
    },
    selectedItemsCard: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    selectedItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    selectedItemLast: {
      borderBottomWidth: 0,
    },
    selectedItemName: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    selectedItemPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 8,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 2,
      borderTopColor: colors.border,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    totalValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: Platform.OS === 'ios' ? 20 : 100,
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 20,
    },
  });

  const filteredMenuItems = menuItems.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      (item.nameMM && item.nameMM.includes(searchQuery))
    );
  });

  const addItemToOrder = (menuItemId: string) => {
    const item = menuItems.find(m => m.id === menuItemId);
    if (!item || !item.available) return;

    const newSelected = new Map(selectedItems);
    const currentQty = newSelected.get(menuItemId) || 0;
    newSelected.set(menuItemId, currentQty + 1);
    setSelectedItems(newSelected);
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    const newSelected = new Map(selectedItems);
    const currentQty = newSelected.get(menuItemId) || 0;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      newSelected.delete(menuItemId);
    } else {
      newSelected.set(menuItemId, newQty);
    }

    setSelectedItems(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach((quantity, menuItemId) => {
      const item = menuItems.find(m => m.id === menuItemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  };

  const handleTableSelect = (tableNum: number) => {
    setTableNumber(tableNum.toString());
  };

  const handleSubmitOrder = async () => {
    if (!tableNumber.trim()) {
      Alert.alert(t.error, language === 'en' ? 'Please select a table' : 'စားပွဲရွေးပါ');
      return;
    }

    if (selectedItems.size === 0) {
      Alert.alert(t.error, language === 'en' ? 'Please select at least one item' : 'အနည်းဆုံးပစ္စည်းတစ်ခုရွေးပါ');
      return;
    }

    try {
      const orderItems: OrderItem[] = [];
      selectedItems.forEach((quantity, menuItemId) => {
        const menuItem = menuItems.find(m => m.id === menuItemId);
        if (menuItem) {
          orderItems.push({
            menuItemId: menuItem.id,
            menuItem: menuItem,
            name: menuItem.name,
            quantity,
            price: menuItem.price,
          });
        }
      });

      const order: Order = {
        id: Date.now().toString(),
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        tableNumber: tableNumber,
        items: orderItems,
        total: calculateTotal(),
        status: 'pending' as OrderStatus,
        paymentStatus: 'unpaid',
        paymentMethod: undefined,
        createdBy: currentUser?.id || 'unknown',
        createdAt: new Date().toISOString(),
      };

      await addOrder(order);

      Alert.alert(
        t.success,
        language === 'en' ? 'Order placed successfully' : 'အော်ဒါအောင်မြင်စွာတင်ပြီးပါပြီ',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert(t.error, language === 'en' ? 'Failed to place order' : 'အော်ဒါတင်ရန်မအောင်မြင်ပါ');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Table Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Select Table' : 'စားပွဲရွေးပါ'}
          </Text>
          <View style={styles.tableSelectionContainer}>
            {Array.from({ length: totalTables }, (_, i) => i + 1).map((tableNum) => {
              const isSelected = tableNumber === tableNum.toString();
              return (
                <TouchableOpacity
                  key={tableNum}
                  style={[
                    styles.tableButton,
                    isSelected && styles.tableButtonSelected,
                  ]}
                  onPress={() => handleTableSelect(tableNum)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tableButtonContent}>
                    <IconSymbol 
                      name="table.furniture" 
                      color="#FFFFFF" 
                      size={28} 
                    />
                    <Text style={styles.tableButtonText}>T-{tableNum}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Items Summary */}
        {selectedItems.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.selectedItems}</Text>
            <View style={styles.selectedItemsCard}>
              {Array.from(selectedItems.entries()).map(([menuItemId, quantity], index) => {
                const item = menuItems.find(m => m.id === menuItemId);
                if (!item) return null;

                const itemTotal = item.price * quantity;
                const isLast = index === selectedItems.size - 1;

                return (
                  <View
                    key={menuItemId}
                    style={[styles.selectedItem, isLast && styles.selectedItemLast]}
                  >
                    <Text style={styles.selectedItemName}>
                      {quantity}x {language === 'mm' && item.nameMM ? item.nameMM : item.name}
                    </Text>
                    <Text style={styles.selectedItemPrice}>
                      {itemTotal.toLocaleString()} {t.currencySymbol}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t.total}:</Text>
                <Text style={styles.totalValue}>
                  {calculateTotal().toLocaleString()} {t.currencySymbol}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.menu}</Text>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.search}
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Menu Items List */}
          {filteredMenuItems.length === 0 ? (
            <Text style={styles.emptyText}>{t.empty}</Text>
          ) : (
            filteredMenuItems.map(item => {
              const quantity = selectedItems.get(item.id) || 0;
              const isSelected = quantity > 0;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    isSelected && styles.menuItemSelected,
                    !item.available && styles.menuItemUnavailable,
                  ]}
                  onPress={() => addItemToOrder(item.id)}
                  disabled={!item.available}
                >
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>
                      {language === 'mm' && item.nameMM ? item.nameMM : item.name}
                    </Text>
                    <Text style={styles.menuItemPrice}>
                      {item.price.toLocaleString()} {t.currencySymbol}
                    </Text>
                  </View>

                  {isSelected ? (
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <IconSymbol name="minus" color="#FFFFFF" size={16} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <IconSymbol name="plus" color="#FFFFFF" size={16} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <IconSymbol
                      name={item.available ? 'plus.circle' : 'xmark.circle'}
                      color={item.available ? colors.primary : colors.secondary}
                      size={28}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (selectedItems.size === 0 || !tableNumber.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitOrder}
          disabled={selectedItems.size === 0 || !tableNumber.trim()}
        >
          <Text style={styles.submitButtonText}>{t.submitOrder}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
