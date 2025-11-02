
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

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems.filter(item => item.available)
    : menuItems.filter(item => item.category === selectedCategory && item.available);

  const addItemToOrder = (menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (!menuItem) return;

    const existingItem = selectedItems.find(item => item.menuItemId === menuItemId);
    
    if (existingItem) {
      setSelectedItems(
        selectedItems.map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map(item =>
          item.menuItemId === menuItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      Alert.alert(t.error || 'Error', 'Please add items to the order');
      return;
    }

    if (!tableNumber.trim()) {
      Alert.alert(t.error || 'Error', 'Please enter a table number');
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: selectedItems,
      total: calculateTotal(),
      status: 'pending' as OrderStatus,
      tableNumber: tableNumber.trim(),
      createdAt: new Date().toISOString(),
      paymentStatus: 'unpaid',
      paymentMethod: undefined,
      createdBy: currentUser?.id || 'unknown',
    };

    try {
      await addOrder(newOrder);
      Alert.alert(
        t.success || 'Success',
        'Order created successfully',
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/(tabs)/orders'),
          },
          {
            text: 'New Order',
            onPress: () => {
              setSelectedItems([]);
              setTableNumber('');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert(t.error || 'Error', 'Failed to create order');
    }
  };

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
      paddingBottom: 120,
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
    tableInput: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    categoryContainer: {
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
    },
    categoryButtonTextActive: {
      color: '#FFFFFF',
    },
    menuGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    menuItem: {
      width: '48%',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItemSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    menuItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    menuItemName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    quantityBadge: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 4,
    },
    quantityBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    menuItemPrice: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    selectedItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    selectedItemInfo: {
      flex: 1,
    },
    selectedItemName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    selectedItemPrice: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.border,
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
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
      elevation: 8,
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    totalLabel: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    submitButton: {
      width: '100%',
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Table Number Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.tableNumber || 'Table Number'}</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter table number"
            placeholderTextColor={colors.textSecondary}
            value={tableNumber}
            onChangeText={setTableNumber}
            keyboardType="number-pad"
          />
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.category || 'Category'}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.menu || 'Menu'}</Text>
          <View style={styles.menuGrid}>
            {filteredMenuItems.map((item) => {
              const selectedItem = selectedItems.find(si => si.menuItemId === item.id);
              const quantity = selectedItem?.quantity || 0;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    quantity > 0 && styles.menuItemSelected,
                  ]}
                  onPress={() => addItemToOrder(item.id)}
                >
                  <View style={styles.menuItemHeader}>
                    <Text style={styles.menuItemName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    {quantity > 0 && (
                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityBadgeText}>{quantity}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.menuItemPrice}>
                    {item.price.toLocaleString()} {t.currencySymbol || 'Ks'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.selectedItems || 'Selected Items'}</Text>
            {selectedItems.map((item) => (
              <View key={item.menuItemId} style={styles.selectedItem}>
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemName}>{item.name}</Text>
                  <Text style={styles.selectedItemPrice}>
                    {item.price.toLocaleString()} × {item.quantity} = {(item.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.menuItemId, -1)}
                  >
                    <IconSymbol name="minus" size={16} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.menuItemId, 1)}
                  >
                    <IconSymbol name="plus" size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      {selectedItems.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{t.total || 'Total'}:</Text>
            <Text style={styles.totalAmount}>
              {calculateTotal().toLocaleString()} {t.currencySymbol || 'Ks'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitOrder}
          >
            <Text style={styles.buttonText}>{t.submitOrder || 'Submit Order'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
