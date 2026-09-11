// components/teacher/TeacherSidebar.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

type SidebarItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const sidebarItems: SidebarItem[] = [
  { label: 'Students', icon: 'people-outline',        route: '/teacher/students' },
  { label: 'Classes',  icon: 'book-outline',          route: '/teacher/classes' },
  { label: 'Academic', icon: 'school-outline',        route: '/teacher/academic' },
  { label: 'Messages', icon: 'chatbubble-outline',    route: '/teacher/messages' },
  { label: 'Events',   icon: 'calendar-outline',      route: '/teacher/events' },
  { label: 'Notifs',   icon: 'notifications-outline', route: '/teacher/notifications' },
  { label: 'Settings', icon: 'settings-outline',      route: '/teacher/settings' },
];

export default function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <View style={styles.sidebar}>

      {/* Teacher avatar at top */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>👩🏽‍🏫</Text>
        </View>
        <Text style={styles.logoText}>Teacher</Text>
      </View>

      {/* Items stacked vertically */}
      <View style={styles.navigation}>
        {sidebarItems.map((item) => {
          const active =
            pathname === item.route ||
            pathname.startsWith(`${item.route}/`);

          return (
            <Pressable
              key={item.route}
              style={[styles.sidebarItem, active && styles.activeItem]}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons name={item.icon} size={22} color="#FFFFFF" />
              <Text
                style={[styles.itemLabel, active && styles.activeLabel]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 76,
    backgroundColor: '#061B5E',
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
  },
  logoContainer: { alignItems: 'center', marginBottom: 18 },
  logoCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
  },
  logoEmoji: { fontSize: 24 },
  logoText: { color: '#FFFFFF', fontSize: 8, marginTop: 4, textAlign: 'center' },

  /* Stack vertically, no wrap */
  navigation: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  sidebarItem: {
    width: 60, height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  activeItem: { backgroundColor: '#123E9B' },
  itemLabel: {
    color: '#FFFFFF', fontSize: 7,
    marginTop: 3, textAlign: 'center',
  },
  activeLabel: { fontWeight: '700' },
});