
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { PaymentMethod } from '@/types';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateOrder, language, orders } = useApp();
  const t = translations[language];

  const orderId = params.orderId as string;
  const order = orders.find(o => o.id === orderId);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  if (!order) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={buttonStyles.primary}
          onPress={() => router.back()}
        >
          <Text style={commonStyles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const paymentMethods: { method: PaymentMethod; icon: string; label: string; color: string }[] = [
    {
      method: 'cash',
      icon: 'banknote',
      label: 'Cash',
      color: colors.success,
    },
    {
      method: 'kbzpay',
      icon: 'creditcard.fill',
      label: 'KBZ Pay',
      color: '#FF6B00',
    },
    {
      method: 'wavepay',
      icon: 'wave.3.right',
      label: 'Wave Pay',
      color: '#00A3FF',
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert(t.error || 'Error', 'Please select a payment method');
      return;
    }

    try {
      await updateOrder(order.id, {
        paymentStatus: 'paid',
        paymentMethod: selectedMethod,
      });

      Alert.alert(
        t.success || 'Success',
        'Payment completed successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert(t.error || 'Error', 'Failed to process payment');
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={commonStyles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Order ID:</Text>
              <Text style={styles.summaryValue}>{order.id}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Table:</Text>
              <Text style={styles.summaryValue}>{order.tableNumber}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items:</Text>
              <Text style={styles.summaryValue}>{order.items.length}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {order.total.toLocaleString()} {t.currency || 'MMK'}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemDetails}>
                  {item.price.toLocaleString()} × {item.quantity}
                </Text>
              </View>
              <Text style={styles.orderItemTotal}>
                {(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.method}
              style={[
                styles.paymentMethod,
                selectedMethod === method.method && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.method)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: method.color }]}>
                <IconSymbol name={method.icon} size={28} color="#FFFFFF" />
              </View>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              {selectedMethod === method.method && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* QR Code Info for Digital Payments */}
        {selectedMethod && selectedMethod !== 'cash' && (
          <View style={styles.section}>
            <View style={styles.qrInfoCard}>
              <IconSymbol name="qrcode" size={48} color={colors.primary} />
              <Text style={styles.qrInfoTitle}>Scan QR Code</Text>
              <Text style={styles.qrInfoText}>
                Show the {selectedMethod === 'kbzpay' ? 'KBZ Pay' : 'Wave Pay'} QR code to the customer
              </Text>
              <Text style={styles.qrInfoNote}>
                Note: QR code scanning feature will be available in the next update
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            styles.payButton,
            !selectedMethod && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text style={commonStyles.buttonText}>
            Complete Payment - {order.total.toLocaleString()} {t.currency || 'MMK'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    marginBottom: 16,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
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
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  orderItemDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 12,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight || colors.card,
  },
  paymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  qrInfoCard: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qrInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  qrInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  qrInfoNote: {
    fontSize: 12,
    color: colors.info,
    textAlign: 'center',
    fontStyle: 'italic',
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
  payButton: {
    width: '100%',
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
});
