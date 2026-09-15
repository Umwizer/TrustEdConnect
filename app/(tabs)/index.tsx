import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Colors = {
  primary: '#1E3A8A',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGray: '#64748B',
  border: '#E2E8F0',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  pink: '#EC4899',
  green: '#10B981',
};

const QUICK_ACTIONS = [
  { id: 1, label: 'My Classes', icon: 'school-outline' as const, color: Colors.blue, route: '/(tabs)/classes' },
  { id: 2, label: 'Students', icon: 'people-outline' as const, color: Colors.purple, route: '/(tabs)/students' },
  { id: 3, label: 'Attendance', icon: 'calendar-outline' as const, color: Colors.orange, route: '/(tabs)/attendance' },
  { id: 4, label: 'Results', icon: 'bar-chart-outline' as const, color: Colors.pink, route: '/(tabs)/results' },
];

export default function HomeTabScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Home</Text>
            <Text style={styles.headerSubtitle}>Welcome back</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace('/login')}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Welcome to TrustEdConnect</Text>
            <Text style={styles.heroDesc}>
              Your teaching tools, all in one place.
            </Text>
          </View>
          <View style={styles.heroIconContainer}>
            <Ionicons name="school-outline" size={90} color="rgba(255,255,255,0.1)" />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={[styles.activityIcon, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>Attendance marked</Text>
            <Text style={styles.activityDesc}>S4 Computer Science • Today</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={[styles.activityIcon, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="document-text" size={20} color={Colors.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>Grades submitted</Text>
            <Text style={styles.activityDesc}>S5 Mathematics • Yesterday</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  contentContainer: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.textDark },
  headerSubtitle: { fontSize: 13, color: Colors.textGray, marginTop: 2 },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroTextContainer: { zIndex: 2 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 8 },
  heroDesc: { fontSize: 13, color: '#BFDBFE', lineHeight: 20 },
  heroIconContainer: { position: 'absolute', right: -10, bottom: -20, opacity: 0.8 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionCard: { alignItems: 'center', gap: 8, flex: 1 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark, marginBottom: 2 },
  activityDesc: { fontSize: 12, color: Colors.textGray },
});