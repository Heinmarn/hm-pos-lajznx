
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="new-order"
        options={{
          headerShown: true,
          title: 'New Order',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="menu-management"
        options={{
          headerShown: true,
          title: 'Menu Management',
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerShown: true,
          title: 'Payment',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
