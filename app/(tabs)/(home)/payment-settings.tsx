
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
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';
import { useApp } from '@/contexts/AppContext';
import { translations } from '@/utils/translations';

export default function PaymentSettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, language, darkMode, hasAdminPermission } = useApp();
  const t = translations[language];
  const colors = getColors(darkMode);

  const [kbzQrUri, setKbzQrUri] = useState(settings.paymentQR?.kbzpay?.qrCodeUri || '');
  const [kbzPhone, setKbzPhone] = useState(settings.paymentQR?.kbzpay?.phoneNumber || '');
  const [waveQrUri, setWaveQrUri] = useState(settings.paymentQR?.wavepay?.qrCodeUri || '');
  const [wavePhone, setWavePhone] = useState(settings.paymentQR?.wavepay?.phoneNumber || '');

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
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    paymentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    paymentLogo: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 4,
    },
    paymentTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      marginBottom: 12,
    },
    qrPreviewContainer: {
      alignItems: 'center',
      marginBottom: 12,
    },
    qrPreview: {
      width: 200,
      height: 200,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    qrPlaceholder: {
      width: 200,
      height: 200,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 12,
    },
    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.danger,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 8,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    saveButton: {
      backgroundColor: colors.success,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 2,
      marginTop: 8,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    infoBox: {
      backgroundColor: colors.info + '20',
      borderLeftWidth: 4,
      borderLeftColor: colors.info,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 20,
    },
  });

  // Check admin permission
  if (!hasAdminPermission()) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 16 }]}>
        <Stack.Screen
          options={{
            title: language === 'en' ? 'Payment Settings' : 'ငွေပေးချေမှု ဆက်တင်များ',
            headerShown: Platform.OS === 'ios',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        />
        <IconSymbol name="lock.fill" size={48} color={colors.danger} />
        <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 16 }]}>
          {language === 'en' ? 'Access Denied' : 'ဝင်ရောက်ခွင့် မရှိပါ'}
        </Text>
        <Text style={[styles.infoText, { textAlign: 'center', marginTop: 8 }]}>
          {language === 'en' 
            ? 'Only administrators can access payment settings.' 
            : 'စီမံခန့်ခွဲသူများသာ ငွေပေးချေမှု ဆက်တင်များကို ဝင်ရောက်နိုင်ပါသည်။'}
        </Text>
      </View>
    );
  }

  const pickImage = async (paymentMethod: 'kbzpay' | 'wavepay') => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'en' ? 'Permission Required' : 'ခွင့်ပြုချက် လိုအပ်သည်',
          language === 'en' 
            ? 'Please grant permission to access your photo library.' 
            : 'သင့်ဓာတ်ပုံစာကြည့်ခန်းကို ဝင်ရောက်ရန် ခွင့်ပြုချက်ပေးပါ။'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        if (paymentMethod === 'kbzpay') {
          setKbzQrUri(result.assets[0].uri);
        } else {
          setWaveQrUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'အမှား',
        language === 'en' ? 'Failed to pick image' : 'ဓာတ်ပုံရွေးချယ်ခြင်း မအောင်မြင်ပါ'
      );
    }
  };

  const removeImage = (paymentMethod: 'kbzpay' | 'wavepay') => {
    Alert.alert(
      language === 'en' ? 'Remove QR Code' : 'QR ကုဒ်ကို ဖယ်ရှားမည်',
      language === 'en' 
        ? 'Are you sure you want to remove this QR code?' 
        : 'ဤ QR ကုဒ်ကို ဖယ်ရှားလိုသည်မှာ သေချာပါသလား?',
      [
        { text: language === 'en' ? 'Cancel' : 'မလုပ်တော့', style: 'cancel' },
        {
          text: language === 'en' ? 'Remove' : 'ဖယ်ရှားမည်',
          style: 'destructive',
          onPress: () => {
            if (paymentMethod === 'kbzpay') {
              setKbzQrUri('');
            } else {
              setWaveQrUri('');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        paymentQR: {
          kbzpay: {
            qrCodeUri: kbzQrUri,
            phoneNumber: kbzPhone,
          },
          wavepay: {
            qrCodeUri: waveQrUri,
            phoneNumber: wavePhone,
          },
        },
      });

      Alert.alert(
        language === 'en' ? 'Success' : 'အောင်မြင်ပါသည်',
        language === 'en' 
          ? 'Payment settings saved successfully' 
          : 'ငွေပေးချေမှု ဆက်တင်များကို သိမ်းဆည်းပြီးပါပြီ',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving payment settings:', error);
      Alert.alert(
        language === 'en' ? 'Error' : 'အမှား',
        language === 'en' 
          ? 'Failed to save payment settings' 
          : 'ငွေပေးချေမှု ဆက်တင်များကို သိမ်းဆည်းခြင်း မအောင်မြင်ပါ'
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: language === 'en' ? 'Payment Settings' : 'ငွေပေးချေမှု ဆက်တင်များ',
          headerShown: Platform.OS === 'ios',
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {language === 'en'
                ? 'Upload QR codes and phone numbers for KBZ Pay and Wave Pay. These will be displayed to customers during payment.'
                : 'KBZ Pay နှင့် Wave Pay အတွက် QR ကုဒ်များနှင့် ဖုန်းနံပါတ်များကို တင်ပါ။ ငွေပေးချေစဉ်အတွင်း ဖောက်သည်များကို ပြသပါမည်။'}
            </Text>
          </View>

          {/* KBZ Pay Section */}
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.paymentHeader}>
                <Image
                  source={require('@/assets/images/b24fab8a-3896-4622-b407-f924944075a5.png')}
                  style={styles.paymentLogo}
                />
                <Text style={styles.paymentTitle}>KBZ Pay</Text>
              </View>

              {/* QR Code Upload */}
              <Text style={styles.label}>
                {language === 'en' ? 'QR Code' : 'QR ကုဒ်'}
              </Text>
              <View style={styles.qrPreviewContainer}>
                {kbzQrUri ? (
                  <Image source={{ uri: kbzQrUri }} style={styles.qrPreview} />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <IconSymbol name="qrcode" size={48} color={colors.textSecondary} />
                    <Text style={styles.placeholderText}>
                      {language === 'en' ? 'No QR code uploaded' : 'QR ကုဒ် မတင်ရသေးပါ'}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage('kbzpay')}
              >
                <IconSymbol name="photo" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {kbzQrUri
                    ? (language === 'en' ? 'Change QR Code' : 'QR ကုဒ် ပြောင်းမည်')
                    : (language === 'en' ? 'Upload QR Code' : 'QR ကုဒ် တင်မည်')}
                </Text>
              </TouchableOpacity>

              {kbzQrUri && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage('kbzpay')}
                >
                  <IconSymbol name="trash" size={18} color="#FFFFFF" />
                  <Text style={styles.buttonText}>
                    {language === 'en' ? 'Remove' : 'ဖယ်ရှားမည်'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Phone Number */}
              <Text style={styles.label}>
                {language === 'en' ? 'Phone Number' : 'ဖုန်းနံပါတ်'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Enter phone number' : 'ဖုန်းနံပါတ် ထည့်ပါ'}
                placeholderTextColor={colors.textSecondary}
                value={kbzPhone}
                onChangeText={setKbzPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Wave Pay Section */}
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.paymentHeader}>
                <Image
                  source={require('@/assets/images/2e9c8052-5237-484d-a850-ffa602c17f52.png')}
                  style={styles.paymentLogo}
                />
                <Text style={styles.paymentTitle}>Wave Pay</Text>
              </View>

              {/* QR Code Upload */}
              <Text style={styles.label}>
                {language === 'en' ? 'QR Code' : 'QR ကုဒ်'}
              </Text>
              <View style={styles.qrPreviewContainer}>
                {waveQrUri ? (
                  <Image source={{ uri: waveQrUri }} style={styles.qrPreview} />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <IconSymbol name="qrcode" size={48} color={colors.textSecondary} />
                    <Text style={styles.placeholderText}>
                      {language === 'en' ? 'No QR code uploaded' : 'QR ကုဒ် မတင်ရသေးပါ'}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickImage('wavepay')}
              >
                <IconSymbol name="photo" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>
                  {waveQrUri
                    ? (language === 'en' ? 'Change QR Code' : 'QR ကုဒ် ပြောင်းမည်')
                    : (language === 'en' ? 'Upload QR Code' : 'QR ကုဒ် တင်မည်')}
                </Text>
              </TouchableOpacity>

              {waveQrUri && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage('wavepay')}
                >
                  <IconSymbol name="trash" size={18} color="#FFFFFF" />
                  <Text style={styles.buttonText}>
                    {language === 'en' ? 'Remove' : 'ဖယ်ရှားမည်'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Phone Number */}
              <Text style={styles.label}>
                {language === 'en' ? 'Phone Number' : 'ဖုန်းနံပါတ်'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={language === 'en' ? 'Enter phone number' : 'ဖုန်းနံပါတ် ထည့်ပါ'}
                placeholderTextColor={colors.textSecondary}
                value={wavePhone}
                onChangeText={setWavePhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {language === 'en' ? 'Save Settings' : 'ဆက်တင်များကို သိမ်းမည်'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}
