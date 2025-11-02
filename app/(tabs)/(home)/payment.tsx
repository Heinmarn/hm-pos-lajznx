
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';
import { PaymentMethod } from '@/types';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateOrder, language, orders, darkMode, settings } = useApp();
  const t = translations[language];
  const colors = getColors(darkMode);

  const orderId = params.orderId as string;
  const order = orders.find(o => o.id === orderId);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

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
    card: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
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
    },
    paymentIcon: {
      width: 56,
      height: 56,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    paymentLogo: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
    },
    paymentLabel: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    qrDisplayCard: {
      backgroundColor: colors.card,
      padding: 24,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    qrDisplayTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    qrCodeImage: {
      width: 250,
      height: 250,
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: '#FFFFFF',
    },
    phoneNumberContainer: {
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginTop: 8,
    },
    phoneNumberLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    phoneNumber: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primary,
      letterSpacing: 1,
    },
    qrInfoNote: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 12,
      fontStyle: 'italic',
    },
    noQrWarning: {
      backgroundColor: colors.warning + '20',
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    warningText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
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
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    payButtonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  if (!order) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const paymentMethods: { method: PaymentMethod; icon?: string; logo?: any; label: string; color: string }[] = [
    {
      method: 'cash',
      icon: 'banknote',
      label: 'Cash',
      color: colors.success,
    },
    {
      method: 'kbzpay',
      logo: require('@/assets/images/b24fab8a-3896-4622-b407-f924944075a5.png'),
      label: 'KBZ Pay',
      color: '#0066CC',
    },
    {
      method: 'wavepay',
      logo: require('@/assets/images/2e9c8052-5237-484d-a850-ffa602c17f52.png'),
      label: 'Wave Pay',
      color: '#FFD700',
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

  // Get QR code and phone number for selected payment method
  const getPaymentInfo = () => {
    if (!selectedMethod || selectedMethod === 'cash') return null;

    const paymentQR = settings.paymentQR;
    if (!paymentQR) return null;

    if (selectedMethod === 'kbzpay') {
      return {
        qrCodeUri: paymentQR.kbzpay?.qrCodeUri,
        phoneNumber: paymentQR.kbzpay?.phoneNumber,
        label: 'KBZ Pay',
      };
    } else if (selectedMethod === 'wavepay') {
      return {
        qrCodeUri: paymentQR.wavepay?.qrCodeUri,
        phoneNumber: paymentQR.wavepay?.phoneNumber,
        label: 'Wave Pay',
      };
    }

    return null;
  };

  const paymentInfo = getPaymentInfo();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.card}>
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
                {order.total.toLocaleString()} {t.currencySymbol || 'Ks'}
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
              <View style={styles.paymentIcon}>
                {method.logo ? (
                  <Image source={method.logo} style={styles.paymentLogo} />
                ) : (
                  <View style={[{ backgroundColor: method.color, width: 56, height: 56, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }]}>
                    <IconSymbol name={method.icon || 'banknote'} size={28} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text style={styles.paymentLabel}>{method.label}</Text>
              {selectedMethod === method.method && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* QR Code Display for Digital Payments */}
        {selectedMethod && selectedMethod !== 'cash' && paymentInfo && (
          <View style={styles.section}>
            <View style={styles.qrDisplayCard}>
              <Text style={styles.qrDisplayTitle}>
                {language === 'en' 
                  ? `Scan ${paymentInfo.label} QR Code` 
                  : `${paymentInfo.label} QR ကုဒ်ကို စကင်န်ဖတ်ပါ`}
              </Text>

              {paymentInfo.qrCodeUri ? (
                <>
                  <Image 
                    source={{ uri: paymentInfo.qrCodeUri }} 
                    style={styles.qrCodeImage}
                  />
                  
                  {paymentInfo.phoneNumber && (
                    <View style={styles.phoneNumberContainer}>
                      <Text style={styles.phoneNumberLabel}>
                        {language === 'en' 
                          ? 'Or use phone number:' 
                          : 'သို့မဟုတ် ဖုန်းနံပါတ်ကို အသုံးပြုပါ:'}
                      </Text>
                      <Text style={styles.phoneNumber}>{paymentInfo.phoneNumber}</Text>
                    </View>
                  )}

                  <Text style={styles.qrInfoNote}>
                    {language === 'en'
                      ? 'Customer can scan this QR code or use the phone number to make payment'
                      : 'ဖောက်သည်သည် ဤ QR ကုဒ်ကို စကင်န်ဖတ်နိုင်သည် သို့မဟုတ် ဖုန်းနံပါတ်ကို အသုံးပြု၍ ငွေပေးချေနိုင်ပါသည်'}
                  </Text>
                </>
              ) : (
                <View style={styles.noQrWarning}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
                  <Text style={styles.warningText}>
                    {language === 'en'
                      ? `No QR code uploaded for ${paymentInfo.label}. Please go to Settings > Payment QR Settings to upload a QR code.`
                      : `${paymentInfo.label} အတွက် QR ကုဒ် မတင်ရသေးပါ။ ဆက်တင်များ > ငွေပေးချေမှု QR ဆက်တင်များ သို့သွား၍ QR ကုဒ်တင်ပါ။`}
                  </Text>
                  {paymentInfo.phoneNumber && (
                    <View style={[styles.phoneNumberContainer, { marginTop: 12 }]}>
                      <Text style={styles.phoneNumberLabel}>
                        {language === 'en' ? 'Phone number:' : 'ဖုန်းနံပါတ်:'}
                      </Text>
                      <Text style={styles.phoneNumber}>{paymentInfo.phoneNumber}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.payButton,
            !selectedMethod && styles.payButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedMethod}
        >
          <Text style={styles.buttonText}>
            Complete Payment - {order.total.toLocaleString()} {t.currencySymbol || 'Ks'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
