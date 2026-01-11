import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { userData } = useAuth();
  const isHRD = userData?.role === 'hrd';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      }}>
      {isHRD ? (
        <Tabs.Screen
          name="hrd"
          options={{
            title: 'Dashboard HRD',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="business" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="index"
          options={{
            title: 'Absensi',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
