// app/(tabs)/academic.tsx - Academic Hub
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface AcademicClass {
  id: string;
  name: string;
  subject: string;
  avgPerformance: number;
  resultsEntered: number;
  pendingResults: number;
}

export default function AcademicScreen() {
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const terms = ['Term 1', 'Term 2', 'Term 3'];

  const academicClasses: AcademicClass[] = [
    { id: '1', name: 'Class 5A', subject: 'Mathematics', avgPerformance: 78, resultsEntered: 28, pendingResults: 4 },
    { id: '2', name: 'Class 5B', subject: 'English', avgPerformance: 85, resultsEntered: 25, pendingResults: 3 },
    { id: '3', name: 'Class 6A', subject: 'Science', avgPerformance: 82, resultsEntered: 30, pendingResults: 0 },
    { id: '4', name: 'Class 4A', subject: 'Social Studies', avgPerformance: 68, resultsEntered: 20, pendingResults: 5 },
    { id: '5', name: 'Class 6B', subject: 'Mathematics', avgPerformance: 75, resultsEntered: 33, pendingResults: 2 },
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getPerformanceEmoji = (score: number) => {
    if (score >= 80) return '🌟';
    if (score >= 60) return '📈';
    return '📉';
  };

  const totalPending = academicClasses.reduce((sum, c) => sum + c.pendingResults, 0);
  const overallAvg = academicClasses.reduce((sum, c) => sum + c.avgPerformance, 0) / academicClasses.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Academic</Text>
          <Text style={styles.headerSubtitle}>
            Manage results and academic performance
          </Text>
        </View>

        {/* Term Selector */}
        <View style={styles.termContainer}>
          {terms.map((term) => (
            <TouchableOpacity
              key={term}
              style={[styles.termChip, selectedTerm === term && styles.termChipActive]}
              onPress={() => setSelectedTerm(term)}
            >
              <Text
                style={[styles.termChipText, selectedTerm === term && styles.termChipTextActive]}
              >
                {term}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#1A237E15' }]}>
              <Ionicons name="school-outline" size={24} color="#1A237E" />
            </View>
            <Text style={styles.statValue}>{academicClasses.length}</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: getPerformanceColor(overallAvg) + '15' }]}>
              <Ionicons name="stats-chart-outline" size={24} color={getPerformanceColor(overallAvg)} />
            </View>
            <Text style={[styles.statValue, { color: getPerformanceColor(overallAvg) }]}>
              {overallAvg.toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>Avg Performance</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E6510015' }]}>
              <Ionicons name="time-outline" size={24} color="#E65100" />
            </View>
            <Text style={[styles.statValue, { color: '#E65100' }]}>{totalPending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('./results')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="create-outline" size={28} color="#2E7D32" />
              </View>
              <Text style={styles.actionTitle}>Enter Results</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="document-text-outline" size={28} color="#0D47A1" />
              </View>
              <Text style={styles.actionTitle}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="analytics-outline" size={28} color="#E65100" />
              </View>
              <Text style={styles.actionTitle}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Classes List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Class Performance</Text>
            <TouchableOpacity>
              <Text style={styles.sectionSeeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {academicClasses.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.classCard}
              onPress={() => router.push(`./class-detail/${cls.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.classCardHeader}>
                <View>
                  <Text style={styles.className}>{cls.name}</Text>
                  <Text style={styles.classSubject}>{cls.subject}</Text>
                </View>
                <View style={[
                  styles.performanceBadge,
                  { backgroundColor: getPerformanceColor(cls.avgPerformance) + '15' }
                ]}>
                  <Text style={[
                    styles.performanceBadgeText,
                    { color: getPerformanceColor(cls.avgPerformance) }
                  ]}>
                    {getPerformanceEmoji(cls.avgPerformance)} {cls.avgPerformance}%
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${cls.avgPerformance}%`,
                      backgroundColor: getPerformanceColor(cls.avgPerformance),
                    },
                  ]}
                />
              </View>

              <View style={styles.classCardFooter}>
                <View style={styles.footerItem}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#4CAF50" />
                  <Text style={styles.footerText}>{cls.resultsEntered} entered</Text>
                </View>
                <View style={styles.footerItem}>
                  <Ionicons name="time-outline" size={14} color="#E65100" />
                  <Text style={styles.footerText}>{cls.pendingResults} pending</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  termContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  termChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  termChipActive: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  termChipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  termChipTextActive: { color: '#FFFFFF' },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  sectionSeeAll: { fontSize: 14, color: '#1A237E', fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { alignItems: 'center', width: '30%' },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: { fontSize: 12, color: '#1A1A2E', fontWeight: '600', textAlign: 'center' },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  className: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  classSubject: { fontSize: 13, color: '#666', marginTop: 2 },
  performanceBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  performanceBadgeText: { fontSize: 13, fontWeight: '600' },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: { height: '100%', borderRadius: 3 },
  classCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerItem: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#666', marginLeft: 4 },
});