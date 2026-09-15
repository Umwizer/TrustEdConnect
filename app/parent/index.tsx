import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

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
  red: '#EF4444',
};

const STATS = [
  {
    id: 1,
    title: 'Attendance',
    value: '95%',
    trend: '+2% this term',
    trendUp: true,
    icon: 'calendar-outline' as const,
    color: Colors.blue,
    bgColor: '#E0E7FF',
  },
  {
    id: 2,
    title: 'Average Grade',
    value: '81.5%',
    trend: '+4.2% improvement',
    trendUp: true,
    icon: 'school-outline' as const,
    color: Colors.purple,
    bgColor: '#EDE9FE',
  },
  {
    id: 3,
    title: 'Fees Balance',
    value: '100K',
    trend: 'Due 30 Sept',
    trendUp: false,
    icon: 'wallet-outline' as const,
    color: Colors.orange,
    bgColor: '#FEF3C7',
  },
  {
    id: 4,
    title: 'Unread Messages',
    value: '3',
    trend: 'New messages',
    trendUp: true,
    icon: 'chatbubbles-outline' as const,
    color: Colors.pink,
    bgColor: '#FCE7F3',
  },
];

const QUICK_ACTIONS = [
  { id: 1, label: 'Results', icon: 'bar-chart-outline' as const, color: Colors.purple, route: '/parent/results' },
  { id: 2, label: 'Attendance', icon: 'calendar-outline' as const, color: Colors.blue, route: '/parent/attendance' },
  { id: 3, label: 'Fees', icon: 'card-outline' as const, color: Colors.orange, route: '/parent/fees' },
  { id: 4, label: 'Messages', icon: 'chatbubble-outline' as const, color: Colors.pink, route: '/parent/messages' },
];

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Parent Meeting - Friday',
    desc: 'S5 parents are invited for a meeting this Friday at 3:00 PM in the main hall.',
    date: 'Posted 2 hours ago',
    icon: 'megaphone-outline' as const,
    color: Colors.primary,
    bg: '#E0E7FF',
  },
  {
    id: 2,
    title: 'Term 2 Results Released',
    desc: 'Academic results for Term 2 are now available in the Results section.',
    date: 'Posted 1 day ago',
    icon: 'document-text-outline' as const,
    color: Colors.orange,
    bg: '#FEF3C7',
  },
];

export default function ParentDashboard() {
  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back, Parent</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textDark} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileContainer} onPress={handleLogout}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={16} color={Colors.white} />
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>Parent</Text>
                <Text style={styles.profileRole}>Logout</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color={Colors.textGray} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroBanner}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Welcome to your Parent Portal</Text>
            <Text style={styles.heroDesc}>
              Monitor your child's academic progress, attendance, and school updates from one place.
            </Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>View Child's Profile</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroIconContainer}>
            <Ionicons name="people-outline" size={100} color="rgba(255,255,255,0.1)" />
          </View>
        </View>

        <View style={styles.childSelectorContainer}>
          <Text style={styles.childSelectorLabel}>Currently viewing:</Text>
          <TouchableOpacity style={styles.childSelector}>
            <View style={styles.childAvatar}>
              <Text style={styles.childAvatarText}>JD</Text>
            </View>
            <Text style={styles.childSelectorText}>John Doe - S4</Text>
            <Ionicons name="chevron-down" size={18} color={Colors.textGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Child Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.bgColor }]}>
                <Ionicons name={stat.icon} size={22} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.title}</Text>
              <View style={styles.trendRow}>
                {stat.trendUp && (
                  <Ionicons name="trending-up" size={12} color={Colors.green} style={styles.trendIcon} />
                )}
                <Text style={[styles.trendText, { color: stat.trendUp ? Colors.green : Colors.textGray }]}>
                  {stat.trend}
                </Text>
              </View>
            </View>
          ))}
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

        <View style={styles.announcementSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Announcements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {ANNOUNCEMENTS.map((item) => (
            <View key={item.id} style={styles.announcementCard}>
              <View style={[styles.announcementIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementDesc}>{item.desc}</Text>
                <Text style={styles.announcementDate}>{item.date}</Text>
              </View>
            </View>
          ))}
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
    backgroundColor: Colors.bg,
  },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.textDark },
  headerSubtitle: { fontSize: 13, color: Colors.textGray, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notificationBtn: { position: 'relative', padding: 4 },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
    borderWidth: 1,
    borderColor: Colors.bg,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextContainer: { marginRight: 4 },
  profileName: { fontSize: 12, fontWeight: '700', color: Colors.textDark },
  profileRole: { fontSize: 10, color: Colors.textGray },
  heroBanner: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroTextContainer: { flex: 1, zIndex: 2 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, lineHeight: 28, marginBottom: 8 },
  heroDesc: { fontSize: 13, color: '#BFDBFE', lineHeight: 20, marginBottom: 20 },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  heroBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  heroIconContainer: { position: 'absolute', right: -20, bottom: -20, opacity: 0.8 },
  childSelectorContainer: { paddingHorizontal: 20, marginBottom: 20 },
  childSelectorLabel: { fontSize: 12, fontWeight: '600', color: Colors.textGray, marginBottom: 8 },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  childAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  childAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  childSelectorText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textDark },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  seeAllText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: Colors.white,
    width: (width - 56) / 2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.textDark, marginBottom: 2 },
  statLabel: { fontSize: 13, color: Colors.textGray, marginBottom: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  trendIcon: { marginRight: 4 },
  trendText: { fontSize: 11, fontWeight: '600' },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quickActionCard: { alignItems: 'center', gap: 8 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textDark },
  announcementSection: { paddingHorizontal: 20 },
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementContent: { flex: 1 },
  announcementTitle: { fontSize: 15, fontWeight: '700', color: Colors.textDark, marginBottom: 4 },
  announcementDesc: { fontSize: 13, color: Colors.textGray, lineHeight: 18, marginBottom: 6 },
  announcementDate: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
});