
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { MenuItem } from '@/types';
import { getPermissionDeniedMessage, getRoleDisplayName } from '@/utils/permissions';

export default function MenuManagementScreen() {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    language,
    currentUser,
    canAddMenuItem: checkCanAdd,
    canEditMenu: checkCanEdit,
    canDeleteMenu: checkCanDelete,
  } = useApp();
  const t = translations[language];

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    available: true,
  });

  const categories = [...new Set(menuItems.map(item => item.category))];

  const openAddModal = () => {
    if (!checkCanAdd()) {
      Alert.alert(
        t.permissionDenied || 'Permission Denied',
        getPermissionDeniedMessage(language)
      );
      return;
    }

    setEditingItem(null);
    setFormData({
      name: '',
      price: '',
      category: categories[0] || 'food',
      available: true,
    });
    setModalVisible(true);
  };

  const openEditModal = (item: MenuItem) => {
    if (!checkCanEdit()) {
      Alert.alert(
        t.permissionDenied || 'Permission Denied',
        getPermissionDeniedMessage(language)
      );
      return;
    }

    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert(t.error || 'Error', 'Please enter item name');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert(t.error || 'Error', 'Please enter a valid price');
      return;
    }

    if (!formData.category.trim()) {
      Alert.alert(t.error || 'Error', 'Please enter a category');
      return;
    }

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, {
          name: formData.name.trim(),
          price,
          category: formData.category.trim().toLowerCase(),
          available: formData.available,
        });
        Alert.alert(t.success || 'Success', 'Menu item updated successfully');
      } else {
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: formData.name.trim(),
          price,
          category: formData.category.trim().toLowerCase(),
          available: formData.available,
        };
        await addMenuItem(newItem);
        Alert.alert(t.success || 'Success', 'Menu item added successfully');
      }
      setModalVisible(false);
    } catch (error: any) {
      console.error('Error saving menu item:', error);
      if (error.message === 'PERMISSION_DENIED') {
        Alert.alert(
          t.permissionDenied || 'Permission Denied',
          getPermissionDeniedMessage(language)
        );
      } else {
        Alert.alert(t.error || 'Error', 'Failed to save menu item');
      }
    }
  };

  const handleDelete = (item: MenuItem) => {
    if (!checkCanDelete()) {
      Alert.alert(
        t.permissionDenied || 'Permission Denied',
        getPermissionDeniedMessage(language)
      );
      return;
    }

    Alert.alert(
      t.confirmDelete || 'Confirm Delete',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: t.cancel || 'Cancel', style: 'cancel' },
        {
          text: t.delete || 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMenuItem(item.id);
              Alert.alert(t.success || 'Success', 'Menu item deleted successfully');
            } catch (error: any) {
              console.error('Error deleting menu item:', error);
              if (error.message === 'PERMISSION_DENIED') {
                Alert.alert(
                  t.permissionDenied || 'Permission Denied',
                  getPermissionDeniedMessage(language)
                );
              } else {
                Alert.alert(t.error || 'Error', 'Failed to delete menu item');
              }
            }
          },
        },
      ]
    );
  };

  const toggleAvailability = async (item: MenuItem) => {
    if (!checkCanEdit()) {
      Alert.alert(
        t.permissionDenied || 'Permission Denied',
        getPermissionDeniedMessage(language)
      );
      return;
    }

    try {
      await updateMenuItem(item.id, { available: !item.available });
    } catch (error: any) {
      console.error('Error updating availability:', error);
      if (error.message === 'PERMISSION_DENIED') {
        Alert.alert(
          t.permissionDenied || 'Permission Denied',
          getPermissionDeniedMessage(language)
        );
      } else {
        Alert.alert(t.error || 'Error', 'Failed to update availability');
      }
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const canModify = checkCanEdit() || checkCanDelete() || checkCanAdd();

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Permission Notice */}
        {!canModify && (
          <View style={styles.permissionNotice}>
            <IconSymbol name="lock.fill" size={20} color={colors.warning} />
            <Text style={styles.permissionNoticeText}>
              {language === 'en'
                ? `You are logged in as ${getRoleDisplayName(currentUser?.role || 'cashier', language)}. Only administrators can modify menu items.`
                : `သင်သည် ${getRoleDisplayName(currentUser?.role || 'cashier', language)} အဖြစ် ဝင်ရောက်ထားသည်။ စီမံခန့်ခွဲသူများသာ မီနူးပစ္စည်းများကို ပြုပြင်နိုင်ပါသည်။`}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{menuItems.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {menuItems.filter(item => item.available).length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.secondary }]}>
              {menuItems.filter(item => !item.available).length}
            </Text>
            <Text style={styles.statLabel}>Unavailable</Text>
          </View>
        </View>

        {/* Menu Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
            {items.map((item) => (
              <View key={item.id} style={styles.menuItemCard}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemPrice}>
                    {item.price.toLocaleString()} {t.currency || 'MMK'}
                  </Text>
                  <View style={styles.availabilityContainer}>
                    <Switch
                      value={item.available}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ false: colors.border, true: colors.success }}
                      thumbColor="#FFFFFF"
                      disabled={!checkCanEdit()}
                    />
                    <Text style={styles.availabilityText}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                </View>
                {canModify && (
                  <View style={styles.menuItemActions}>
                    {checkCanEdit() && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(item)}
                      >
                        <IconSymbol name="pencil" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                    {checkCanDelete() && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDelete(item)}
                      >
                        <IconSymbol name="trash" size={20} color={colors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Add Button - Only show for admin */}
      {checkCanAdd() && (
        <TouchableOpacity style={styles.fab} onPress={openAddModal}>
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                placeholderTextColor={colors.textSecondary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.label}>Price (MMK)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                placeholderTextColor={colors.textSecondary}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category"
                placeholderTextColor={colors.textSecondary}
                value={formData.category}
                onChangeText={(text) => setFormData({ ...formData, category: text })}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Available</Text>
                <Switch
                  value={formData.available}
                  onValueChange={(value) => setFormData({ ...formData, available: value })}
                  trackColor={{ false: colors.border, true: colors.success }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[buttonStyles.secondary, styles.modalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[commonStyles.buttonText, { color: colors.text }]}>
                  {t.cancel || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, styles.modalButton]}
                onPress={handleSave}
              >
                <Text style={commonStyles.buttonText}>
                  {editingItem ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  permissionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.warning + '40',
  },
  permissionNoticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalForm: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalButton: {
    flex: 1,
  },
});
