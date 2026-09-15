// app/(tabs)/teacher/_layout.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TeacherSidebar from '../../../components/teacher/TeacherSidebar';
import { useTheme } from '../../../contexts/ThemeContext';

export default function TeacherLayout() {
  const { theme } = useTheme();
  const c = theme.colors;
  const pathname = usePathname();

  const bottomItems = [
    { label: 'Home', icon: 'home-outline', route: '/teacher/dashboard' },
    { label: 'Explore', icon: 'compass-outline', route: '/teacher/explore' },
  ];

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={styles.body}>
        <TeacherSidebar />
        <View style={[styles.content, { backgroundColor: c.background }]}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        </View>
      </View>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: c.card, borderTopColor: c.border },
        ]}
      >
        {bottomItems.map(item => {
          const active = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.bottomItem}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={active ? c.primary : c.textSecondary}
              />
              <Text
                style={[
                  styles.bottomLabel,
                  {
                    color: active ? c.primary : c.textSecondary,
                    fontWeight: active ? '700' : '600',
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, flexDirection: 'row' },
  content: { flex: 1, minWidth: 0 },
  bottomBar: {
    flexDirection: 'row',
    height: 62,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  bottomLabel: { fontSize: 11, marginTop: 2 },
});