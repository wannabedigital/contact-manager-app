import { colors } from '@/src/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTintColor: '#000',
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name='contacts'
        options={{
          title: 'Контакты',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='people-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='documents'
        options={{
          title: 'Договоры',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='document-text-outline' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='more'
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.divider,
  },
  header: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontWeight: '600',
  },
});
