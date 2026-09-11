// app/(tabs)/class-detail/[id].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  students: number;
  averagePerformance: number;
  attendance: number;
  grade: string;
  schedule: string;
  room: string;
  description: string;
}

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const classData: ClassDetail = {
    id: id || '1',
    name: 'Class 5A',
    subject: 'Mathematics',
    teacher: 'Florence Iradukunda',
    students: 32,
    averagePerformance: 78,
    attendance: 92,
    grade: '5th Grade',
    schedule: 'Mon, Wed, Fri 8:00-9:30 AM',
    room: 'Room 201',
    description: 'Advanced mathematics covering algebra, geometry, and basic statistics.',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

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

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#FF9800';
    return '#F44336';
  };

  // ✅ Navigate to Students List
  const handleViewStudents = () => {
    router.push(`./students?classId=${classData.id}`);
  };

  // ✅ Navigate to Attendance
  const handleTakeAttendance = () => {
    router.push(`./attendance?classId=${classData.id}`);
  };

  // ✅ Navigate to Results (NEW)
  const handleEnterResults = () => {
    router.push(`./results?classId=${classData.id}`);
  };

  // Send Message (placeholder)
  const handleSendMessage = () => {
    console.log(`Sending message to class: ${classData.name}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Class Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Class Info Card */}
        <View style={styles.classInfoCard}>
          <View style={styles.classHeader}>
            <View>
              <Text style={styles.className}>{classData.name}</Text>
              <Text style={styles.classSubject}>{classData.subject}</Text>
            </View>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{classData.grade}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color="#1A237E" />
              <Text style={styles.infoLabel}>Teacher</Text>
              <Text style={styles.infoValue}>{classData.teacher}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color="#1A237E" />
              <Text style={styles.infoLabel}>Students</Text>
              <Text style={styles.infoValue}>{classData.students}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#1A237E" />
              <Text style={styles.infoLabel}>Schedule</Text>
              <Text style={styles.infoValueSmall}>{classData.schedule}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#1A237E" />
              <Text style={styles.infoLabel}>Room</Text>
              <Text style={styles.infoValue}>{classData.room}</Text>
            </View>
          </View>
        </View>

        {/* Performance Cards */}
        <View style={styles.performanceContainer}>
          <View style={[styles.performanceCard, { backgroundColor: getPerformanceColor(classData.averagePerformance) + '10' }]}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceLabel}>Average Performance</Text>
              <Text style={[styles.performanceEmoji, { color: getPerformanceColor(classData.averagePerformance) }]}>
                {getPerformanceEmoji(classData.averagePerformance)}
              </Text>
            </View>
            <Text style={[styles.performanceValue, { color: getPerformanceColor(classData.averagePerformance) }]}>
              {classData.averagePerformance}%
            </Text>
            <View style={styles.performanceBarContainer}>
              <View
                style={[
                  styles.performanceBar,
                  {
                    width: `${classData.averagePerformance}%`,
                    backgroundColor: getPerformanceColor(classData.averagePerformance),
                  },
                ]}
              />
            </View>
          </View>

          <View style={[styles.performanceCard, { backgroundColor: getAttendanceColor(classData.attendance) + '10' }]}>
            <View style={styles.performanceHeader}>
              <Text style={styles.performanceLabel}>Attendance</Text>
              <Text style={[styles.performanceEmoji, { color: getAttendanceColor(classData.attendance) }]}>
                {classData.attendance >= 90 ? '✅' : classData.attendance >= 75 ? '⚠️' : '❌'}
              </Text>
            </View>
            <Text style={[styles.performanceValue, { color: getAttendanceColor(classData.attendance) }]}>
              {classData.attendance}%
            </Text>
            <View style={styles.performanceBarContainer}>
              <View
                style={[
                  styles.performanceBar,
                  {
                    width: `${classData.attendance}%`,
                    backgroundColor: getAttendanceColor(classData.attendance),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>About this Class</Text>
          <Text style={styles.descriptionText}>{classData.description}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            {/* View Students */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewStudents}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8EAF6' }]}>
                <Ionicons name="people-outline" size={32} color="#1A237E" />
              </View>
              <Text style={styles.actionCardTitle}>View Students</Text>
              <Text style={styles.actionCardSubtext}>{classData.students} enrolled</Text>
            </TouchableOpacity>

            {/* Take Attendance */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleTakeAttendance}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="checkbox-outline" size={32} color="#0D47A1" />
              </View>
              <Text style={styles.actionCardTitle}>Take Attendance</Text>
              <Text style={styles.actionCardSubtext}>Mark today's attendance</Text>
            </TouchableOpacity>

            {/* Enter Results */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleEnterResults}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="create-outline" size={32} color="#2E7D32" />
              </View>
              <Text style={styles.actionCardTitle}>Enter Results</Text>
              <Text style={styles.actionCardSubtext}>Update student grades</Text>
            </TouchableOpacity>

            {/* Send Message */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleSendMessage}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="chatbubbles-outline" size={32} color="#E65100" />
              </View>
              <Text style={styles.actionCardTitle}>Send Message</Text>
              <Text style={styles.actionCardSubtext}>Notify all students</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 40,
  },
  classInfoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  className: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  classSubject: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A237E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 2,
  },
  infoValueSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 2,
  },
  performanceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  performanceEmoji: {
    fontSize: 20,
  },
  performanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  performanceBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  performanceBar: {
    height: '100%',
    borderRadius: 3,
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 30,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  actionCardSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
});