
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // Define the tabs configuration for POS system
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'orders',
      route: '/(tabs)/orders',
      icon: 'list.bullet.clipboard.fill',
      label: 'Orders',
    },
    {
      name: 'kitchen',
      route: '/(tabs)/kitchen',
      icon: 'flame.fill',
      label: 'Kitchen',
    },
    {
      name: 'reports',
      route: '/(tabs)/reports',
      icon: 'chart.bar.fill',
      label: 'Reports',
    },
  ];

  // Use NativeTabs for iOS, custom FloatingTabBar for Android and Web
  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="orders">
          <Icon sf="list.bullet.clipboard.fill" drawable="ic_orders" />
          <Label>Orders</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="kitchen">
          <Icon sf="flame.fill" drawable="ic_kitchen" />
          <Label>Kitchen</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="reports">
          <Icon sf="chart.bar.fill" drawable="ic_reports" />
          <Label>Reports</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="kitchen" />
        <Stack.Screen name="reports" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
