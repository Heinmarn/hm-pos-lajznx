
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
    menuGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'flex-start',
    },
    menuItemCard: {
      width: Platform.select({ ios: 100, android: 100, default: 110 }),
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      minHeight: 120,
    },
    menuItemCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
      transform: [{ scale: 1.02 }],
    },
    menuItemCardUnavailable: {
      opacity: 0.4,
      backgroundColor: colors.border,
    },
    menuItemIcon: {
      marginBottom: 8,
    },
    menuItemName: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
      lineHeight: 16,
    },
    menuItemPrice: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
      textAlign: 'center',
    },
    quantityBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: colors.primary,
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    quantityBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
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
    selectedItemLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
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
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginRight: 8,
    },
    quantityButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      minWidth: 20,
      textAlign: 'center',
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

  // Get icon name based on menu item category or name
  const getMenuItemIcon = (item: any) => {
    const name = item.name.toLowerCase();
    const category = item.category?.toLowerCase() || '';

    if (name.includes('salad') || name.includes('ဆလပ်')) return 'leaf.fill';
    if (name.includes('mala') || name.includes('မာလာ')) return 'flame.fill';
    if (name.includes('drink') || name.includes('water') || name.includes('ရေ')) return 'drop.fill';
    if (name.includes('tea') || name.includes('လက်ဖက်')) return 'cup.and.saucer.fill';
    if (name.includes('coffee') || name.includes('ကော်ဖီ')) return 'mug.fill';
    if (name.includes('rice') || name.includes('ထမင်း')) return 'takeoutbag.and.cup.and.straw.fill';
    if (name.includes('noodle') || name.includes('ခေါက်ဆွဲ')) return 'fork.knife';
    if (category.includes('drink')) return 'drop.fill';
    if (category.includes('food')) return 'fork.knife';
    
    return 'cart.fill';
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
                    <View style={styles.selectedItemLeft}>
                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(menuItemId, -1)}
                        >
                          <IconSymbol name="minus" color="#FFFFFF" size={14} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(menuItemId, 1)}
                        >
                          <IconSymbol name="plus" color="#FFFFFF" size={14} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.selectedItemName}>
                        {language === 'mm' && item.nameMM ? item.nameMM : item.name}
                      </Text>
                    </View>
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

        {/* Menu Items Grid */}
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

          {/* Menu Items Grid */}
          {filteredMenuItems.length === 0 ? (
            <Text style={styles.emptyText}>{t.empty}</Text>
          ) : (
            <View style={styles.menuGridContainer}>
              {filteredMenuItems.map(item => {
                const quantity = selectedItems.get(item.id) || 0;
                const isSelected = quantity > 0;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItemCard,
                      isSelected && styles.menuItemCardSelected,
                      !item.available && styles.menuItemCardUnavailable,
                    ]}
                    onPress={() => addItemToOrder(item.id)}
                    disabled={!item.available}
                    activeOpacity={0.7}
                  >
                    {isSelected && (
                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{quantity}</Text>
                      </View>
                    )}
                    
                    <View style={styles.menuItemIcon}>
                      <IconSymbol
                        name={getMenuItemIcon(item)}
                        color={!item.available ? colors.textSecondary : isSelected ? colors.primary : colors.text}
                        size={36}
                      />
                    </View>
                    
                    <Text 
                      style={styles.menuItemName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {language === 'mm' && item.nameMM ? item.nameMM : item.name}
                    </Text>
                    
                    <Text style={styles.menuItemPrice}>
                      {item.price.toLocaleString()} {t.currencySymbol}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
