// app/(tabs)/teacher/dashboard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '../../../services/firebase';
import {
  getDashboardStats,
  DashboardStats,
  getRecentActivity,
  ActivityItem,
} from '../../../services/dashboardService';
import { getUnreadCount } from '../../../services/notificationService';
import { useTheme } from '../../../contexts/ThemeContext';

export default function TeacherDashboardScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    attendanceToday: 0,
    pendingResults: 0,
  });

  const displayName = auth.currentUser?.displayName || 'Teacher';
  const firstName = displayName.split(' ')[0];

  const loadDashboard = async () => {
    try {
      const teacherId = auth.currentUser?.uid;
      if (!teacherId) {
        setLoading(false);
        return;
      }
      const [data, unread, activity] = await Promise.all([
        getDashboardStats(teacherId),
        getUnreadCount(teacherId),
        getRecentActivity(teacherId),
      ]);
      setStats(data);
      setUnreadCount(unread);
      setRecentActivity(activity);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const statCards = [
    { id: 1, value: stats.totalClasses.toString(), label: 'My Classes', icon: 'book-outline', bg: '#E0E7FF', color: '#1A237E' },
    { id: 2, value: stats.totalStudents.toString(), label: 'Total Students', icon: 'people-outline', bg: '#EDE9FE', color: '#7C3AED' },
    { id: 3, value: `${stats.attendanceToday}%`, label: 'Attendance Today', icon: 'calendar-outline', bg: '#FEF3C7', color: '#D97706' },
    { id: 4, value: stats.pendingResults.toString(), label: 'Pending Results', icon: 'document-text-outline', bg: '#FCE7F3', color: '#DB2777' },
  ];

  const quickActions = [
    { id: '2', label: 'Take Attendance', icon: 'checkbox-outline', bg: '#DCFCE7', color: '#16A34A', route: '/teacher/attendance' },
    { id: '3', label: 'Enter Results', icon: 'document-text-outline', bg: '#FEF3C7', color: '#D97706', route: '/teacher/academic?action=results' },
    { id: '4', label: 'Send Message', icon: 'chatbubble-outline', bg: '#FCE7F3', color: '#DB2777', route: '/teacher/messages' },
    { id: '5', label: 'Create Event', icon: 'calendar-outline', bg: '#EDE9FE', color: '#7C3AED', route: '/teacher/events?action=create' },
    { id: 6, label: 'Notify Parents', icon: 'alert-circle-outline', bg: '#FEE2E2', color: '#DC2626', route: '/teacher/notifications?action=alert' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: c.header, borderBottomColor: c.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: c.headerText }]} numberOfLines={1}>Dashboard</Text>
            <Text style={[styles.headerSubtitle, { color: c.textSecondary }]} numberOfLines={1}>Welcome back, {firstName}</Text>
          </View>

          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: c.input }]}
            onPress={() => router.push('/teacher/notifications' as any)}
          >
            <Ionicons name="notifications-outline" size={22} color={c.primary} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.profileChip, { backgroundColor: c.input }]}
            onPress={() => router.push('/teacher/settings' as any)}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{firstName.charAt(0)}</Text>
            </View>
            <Text style={[styles.profileName, { color: c.text }]} numberOfLines={1}>{firstName.toUpperCase()}</Text>
            <Ionicons name="chevron-down" size={16} color={c.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* WELCOME CARD */}
        <View style={styles.welcomeCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeTitle}>Welcome to your{'\n'}Teacher Portal</Text>
            <Text style={styles.welcomeSubtitle}>Manage your classes, students, attendance and results from one place.</Text>
            <TouchableOpacity style={styles.welcomeBtn} onPress={() => router.push('/teacher/classes' as any)}>
              <Text style={styles.welcomeBtnText}>View my classes</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeIcon}>
            <Ionicons name="school-outline" size={56} color="#FFFFFF" />
          </View>
        </View>

        {/* OVERVIEW */}
        <Text style={[styles.sectionTitle, { color: c.text }]}>My Overview</Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={c.primary} />
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {statCards.map(s => (
              <View key={s.id} style={[styles.statCard, { backgroundColor: c.card }]}>
                <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon as any} size={22} color={s.color} />
                </View>
                <Text style={[styles.statValue, { color: c.text }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: c.textSecondary }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* TWO COLUMNS */}
        <View style={styles.twoColumnRow}>
          <View style={styles.leftColumn}>
            <Text style={[styles.columnTitle, { color: c.text }]}>Recent Activity</Text>
            <View style={[styles.card, { backgroundColor: c.card }]}>
              {recentActivity.length === 0 ? (
                <View style={styles.emptyActivity}>
                  <Ionicons name="time-outline" size={28} color="#B8C4E0" />
                  <Text style={styles.emptyActivityText}>No recent activity yet</Text>
                </View>
              ) : (
                recentActivity.map((item, i) => (
                  <View
                    key={item.id}
                    style={[
                      styles.activityItem,
                      { borderBottomColor: c.border },
                      i === recentActivity.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon as any} size={16} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.activityTitle, { color: c.text }]} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.activitySub} numberOfLines={1}>{item.subtitle} · {item.time}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.rightColumn}>
            <Text style={[styles.columnTitle, { color: c.text }]}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map(a => (
                <TouchableOpacity
                  key={a.id}
                  style={[styles.actionTile, { backgroundColor: c.card }]}
                  onPress={() => router.push(a.route as any)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                    <Ionicons name={a.icon as any} size={18} color={a.color} />
                  </View>
                  <Text style={[styles.actionLabel, { color: c.text }]} numberOfLines={2}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 8,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  badge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#EF4444', borderRadius: 8,
    minWidth: 16, height: 16, paddingHorizontal: 4,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  profileChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20,
    maxWidth: 140,
  },
  profileAvatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#1A237E',
    justifyContent: 'center', alignItems: 'center',
  },
  profileAvatarText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  profileName: { fontSize: 12, fontWeight: '700', maxWidth: 80 },

  welcomeCard: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: '#0B2A5B', borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  welcomeTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', lineHeight: 26 },
  welcomeSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 10, lineHeight: 19 },
  welcomeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1555E8', alignSelf: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, marginTop: 16,
  },
  welcomeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  welcomeIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },

  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 24, marginHorizontal: 16 },
  loadingBox: { paddingVertical: 40, alignItems: 'center' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, marginTop: 14, justifyContent: 'space-between',
  },
  statCard: { width: '48%', borderRadius: 16, padding: 14, marginBottom: 12 },
  statIcon: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },

  twoColumnRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 12 },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1 },
  columnTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10 },

  card: { borderRadius: 16, padding: 8 },
  emptyActivity: { paddingVertical: 24, alignItems: 'center' },
  emptyActivityText: { fontSize: 11, color: '#999', marginTop: 6, textAlign: 'center' },
  activityItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, gap: 8,
  },
  activityIcon: {
    width: 30, height: 30, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  activityTitle: { fontSize: 12, fontWeight: '700' },
  activitySub: { fontSize: 10, color: '#999', marginTop: 2 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionTile: {
    width: '48%', borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 6,
    alignItems: 'center', marginBottom: 8,
  },
  actionIcon: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  actionLabel: { fontSize: 10, fontWeight: '700', textAlign: 'center', paddingHorizontal: 2 },
});