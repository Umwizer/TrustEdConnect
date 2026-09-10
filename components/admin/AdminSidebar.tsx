import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

type SidebarItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const sidebarItems: SidebarItem[] = [
  {
    label: 'Home',
    icon: 'home-outline',
    route: '/admin',
  },
  {
    label: 'Students',
    icon: 'people-outline',
    route: '/admin/students',
  },
  {
    label: 'Teachers',
    icon: 'school-outline',
    route: '/admin/teachers',
  },
  {
    label: 'Classes',
    icon: 'book-outline',
    route: '/admin/classes',
  },
  {
    label: 'Events',
    icon: 'calendar-outline',
    route: '/admin/events',
  },
  {
    label: 'Messages',
    icon: 'chatbubble-outline',
    route: '/admin/messages',
  },
  {
    label: 'Notifications',
    icon: 'notifications-outline',
    route: '/admin/notifications',
  },
  {
    label: 'Settings',
    icon: 'settings-outline',
    route: '/admin/settings',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const navigate = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.sidebar}>

      {/* School / App Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>👦🏽</Text>
        </View>

        <Text style={styles.logoText}>
          child PIC
        </Text>
      </View>

      {/* Sidebar Navigation */}
      <View style={styles.navigation}>

        {sidebarItems.map((item) => {
          const active =
            pathname === item.route ||
            pathname.startsWith(`${item.route}/`);

          return (
            <Pressable
              key={item.route}
              style={[
                styles.sidebarItem,
                active && styles.activeItem,
              ]}
              onPress={() => navigate(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={active ? '#FFFFFF' : '#FFFFFF'}
              />

              <Text
                style={[
                  styles.itemLabel,
                  active && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

      </View>

      {/* Logout */}
      <Pressable
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <Ionicons
          name="log-out-outline"
          size={25}
          color="#FF3B30"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 76,
    backgroundColor: '#061B5E',
    minHeight: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 18,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  logoEmoji: {
    fontSize: 27,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 8,
    marginTop: 3,
    textAlign: 'center',
  },

  navigation: {
    width: '100%',
    alignItems: 'center',
    gap: 7,
  },

  sidebarItem: {
    width: 58,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeItem: {
    backgroundColor: '#123E9B',
  },

  itemLabel: {
    color: '#FFFFFF',
    fontSize: 7,
    marginTop: 2,
    textAlign: 'center',
  },

  activeLabel: {
    fontWeight: '700',
  },

  logoutButton: {
    marginTop: 'auto',
    width: 58,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },

  logoutText: {
    color: '#FF3B30',
    fontSize: 7,
    marginTop: 2,
  },
});