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
  red: '#EF4444',
};

const STUDENT_INFO = {
  name: 'John Doe',
  class: 'S4',
  term: 'Term 2',
};

const ATTENDANCE_SUMMARY = {
  percentage: '95%',
  present: 57,
  absent: 3,
  late: 2,
  totalDays: 60,
};

const ABSENCE_HISTORY = [
  {
    id: 1,
    date: '12 Sept 2026',
    day: 'Thursday',
    reason: 'Medical appointment',
    status: 'Excused',
    color: Colors.blue,
    bg: '#E0E7FF',
  },
  {
    id: 2,
    date: '05 Sept 2026',
    day: 'Friday',
    reason: 'Family emergency',
    status: 'Excused',
    color: Colors.blue,
    bg: '#E0E7FF',
  },
  {
    id: 3,
    date: '28 Aug 2026',
    day: 'Thursday',
    reason: 'No reason provided',
    status: 'Unexcused',
    color: Colors.red,
    bg: '#FEE2E2',
  },
];

const LATE_ARRIVALS = [
  {
    id: 1,
    date: '18 Sept 2026',
    time: '08:25 AM',
    reason: 'Transport delay',
  },
  {
    id: 2,
    date: '02 Sept 2026',
    time: '08:15 AM',
    reason: 'Overslept',
  },
];

export default function AttendanceScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Attendance</Text>
            <Text style={styles.headerSubtitle}>
              {STUDENT_INFO.name} - {STUDENT_INFO.class}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Big Percentage Card */}
        <View style={styles.percentageCard}>
          <View style={styles.percentageCircleOuter}>
            <View style={styles.percentageCircleInner}>
              <Text style={styles.percentageValue}>{ATTENDANCE_SUMMARY.percentage}</Text>
              <Text style={styles.percentageLabel}>Attendance</Text>
            </View>
          </View>
          <Text style={styles.percentageTerm}>{STUDENT_INFO.term}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.green} />
            </View>
            <Text style={styles.statValue}>{ATTENDANCE_SUMMARY.present}</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="close-circle" size={20} color={Colors.red} />
            </View>
            <Text style={styles.statValue}>{ATTENDANCE_SUMMARY.absent}</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color={Colors.orange} />
            </View>
            <Text style={styles.statValue}>{ATTENDANCE_SUMMARY.late}</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
        </View>

        {/* Absence History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Absence History</Text>
        </View>

        {ABSENCE_HISTORY.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={[styles.historyIcon, { backgroundColor: item.bg }]}>
              <Ionicons name="calendar-outline" size={20} color={item.color} />
            </View>
            <View style={styles.historyContent}>
              <View style={styles.historyTopRow}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.bg }]}>
                  <Text style={[styles.statusText, { color: item.color }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDay}>{item.day}</Text>
              <Text style={styles.historyReason}>{item.reason}</Text>
            </View>
          </View>
        ))}

        {/* Late Arrivals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Late Arrivals</Text>
        </View>

        {LATE_ARRIVALS.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={[styles.historyIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time-outline" size={20} color={Colors.orange} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyDay}>Arrived at {item.time}</Text>
              <Text style={styles.historyReason}>{item.reason}</Text>
            </View>
          </View>
        ))}

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  headerSubtitle: { fontSize: 13, color: Colors.textGray, marginTop: 2 },
  percentageCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  percentageCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  percentageCircleInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.blue,
  },
  percentageValue: { fontSize: 36, fontWeight: '900', color: Colors.white },
  percentageLabel: { fontSize: 13, color: '#BFDBFE', fontWeight: '600', marginTop: 4 },
  percentageTerm: { color: '#BFDBFE', fontSize: 13, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  statLabel: { fontSize: 12, color: Colors.textGray, fontWeight: '600', marginTop: 2 },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  historyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: { flex: 1 },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyDate: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  historyDay: { fontSize: 12, color: Colors.textGray, marginBottom: 4 },
  historyReason: { fontSize: 13, color: Colors.textDark, fontWeight: '500' },
});