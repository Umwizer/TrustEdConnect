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

// HARDCODED DATA - Replace with Firestore fetch later
const STUDENT_INFO = {
  name: 'John Doe',
  class: 'S4',
  term: 'Term 2',
  academicYear: '2025-2026',
};

const OVERALL_STATS = {
  average: '81.5%',
  position: '5th out of 45',
  attendance: '95%',
};

const SUBJECTS = [
  {
    id: 1,
    name: 'Computer Science',
    mark: 91,
    grade: 'A',
    comment: 'Outstanding work. Top of the class.',
    color: Colors.green,
  },
  {
    id: 2,
    name: 'English',
    mark: 82,
    grade: 'A-',
    comment: 'Excellent essay writing skills.',
    color: Colors.green,
  },
  {
    id: 3,
    name: 'Mathematics',
    mark: 78,
    grade: 'B+',
    comment: 'Good progress. Keep practicing.',
    color: Colors.blue,
  },
  {
    id: 4,
    name: 'Physics',
    mark: 75,
    grade: 'B',
    comment: 'Needs improvement in practicals.',
    color: Colors.orange,
  },
];

export default function ResultsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Academic Results</Text>
            <Text style={styles.headerSubtitle}>
              {STUDENT_INFO.name} - {STUDENT_INFO.class}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTerm}>{STUDENT_INFO.term} - {STUDENT_INFO.academicYear}</Text>
          </View>
          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{OVERALL_STATS.average}</Text>
              <Text style={styles.summaryStatLabel}>Average</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{OVERALL_STATS.position}</Text>
              <Text style={styles.summaryStatLabel}>Position</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{OVERALL_STATS.attendance}</Text>
              <Text style={styles.summaryStatLabel}>Attendance</Text>
            </View>
          </View>
        </View>

        {/* Subject List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
        </View>

        {SUBJECTS.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <View style={styles.subjectLeft}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectComment}>{subject.comment}</Text>
              </View>
              <View style={styles.subjectRight}>
                <Text style={[styles.subjectGrade, { color: subject.color }]}>
                  {subject.grade}
                </Text>
                <Text style={styles.subjectMark}>{subject.mark}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${subject.mark}%`,
                    backgroundColor: subject.color,
                  },
                ]}
              />
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
  summaryCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  summaryHeader: { marginBottom: 20 },
  summaryTerm: { color: '#BFDBFE', fontSize: 13, fontWeight: '600' },
  summaryStatsRow: { flexDirection: 'row', alignItems: 'center' },
  summaryStatItem: { flex: 1, alignItems: 'center' },
  summaryStatValue: { color: Colors.white, fontSize: 20, fontWeight: '800', marginBottom: 4 },
  summaryStatLabel: { color: '#BFDBFE', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  summaryDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  subjectCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  subjectLeft: { flex: 1, marginRight: 16 },
  subjectName: { fontSize: 16, fontWeight: '700', color: Colors.textDark, marginBottom: 4 },
  subjectComment: { fontSize: 12, color: Colors.textGray, lineHeight: 18 },
  subjectRight: { alignItems: 'flex-end' },
  subjectGrade: { fontSize: 22, fontWeight: '800' },
  subjectMark: { fontSize: 13, fontWeight: '600', color: Colors.textGray, marginTop: 2 },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 3 },
});