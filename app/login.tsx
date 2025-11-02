
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { translations } from '@/utils/translations';

export default function LoginScreen() {
  const router = useRouter();
  const { login, currentUser, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.replace('/(tabs)/(home)/');
    }
  }, [currentUser]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t.error || 'Error', t.pleaseEnterCredentials || 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(tabs)/(home)/');
      } else {
        Alert.alert(t.error || 'Error', t.invalidCredentials || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t.error || 'Error', t.loginFailed || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'cashier' | 'kitchen') => {
    const credentials = {
      admin: { email: 'admin@hmpos.com', password: 'admin123' },
      cashier: { email: 'cashier@hmpos.com', password: 'cashier123' },
      kitchen: { email: 'kitchen@hmpos.com', password: 'kitchen123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconSymbol name="cart.fill" size={80} color={colors.primary} />
          <Text style={styles.title}>H.M POS</Text>
          <Text style={styles.subtitle}>{t.welcomeBack || 'Welcome Back'}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t.email || 'Email'}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={t.password || 'Password'}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[buttonStyles.primary, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={commonStyles.buttonText}>
              {loading ? (t.loggingIn || 'Logging in...') : (t.login || 'Login')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>{t.demoAccounts || 'Demo Accounts'}</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('admin')}
            >
              <IconSymbol name="person.badge.key.fill" size={24} color={colors.accent} />
              <Text style={styles.demoButtonText}>{t.admin || 'Admin'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('cashier')}
            >
              <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
              <Text style={styles.demoButtonText}>{t.cashier || 'Cashier'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => fillDemoCredentials('kitchen')}
            >
              <IconSymbol name="flame.fill" size={24} color={colors.warning} />
              <Text style={styles.demoButtonText}>{t.kitchen || 'Kitchen'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  demoSection: {
    marginTop: 48,
  },
  demoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  demoButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
});
