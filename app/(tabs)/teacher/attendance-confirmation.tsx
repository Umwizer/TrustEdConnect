// app/(tabs)/attendance-confirmation.tsx - Attendance Confirmation Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface AbsentStudent {
  id: string;
  name: string;
  daysAbsent: number;
  lastAttendance: string;
  parentNotified: boolean;
  parentContact: string;
  reason?: string;
}

export default function AttendanceConfirmationScreen() {
  const { classId, date, subject } = useLocalSearchParams<{
    classId: string;
    date: string;
    subject: string;
  }>();

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AbsentStudent | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [notificationsSent, setNotificationsSent] = useState<string[]>([]);

  // Mock Data - Replace with API call
  const summary = {
    className: 'Class 5A',
    subject: subject || 'Mathematics',
    date: date || new Date().toISOString().split('T')[0],
    totalStudents: 32,
    present: 28,
    absent: 3,
    late: 1,
    excused: 0,
  };

  const [absentStudents, setAbsentStudents] = useState<AbsentStudent[]>([
    {
      id: '1',
      name: 'Bob K',
      daysAbsent: 3,
      lastAttendance: '2024-01-12',
      parentNotified: false,
      parentContact: '+250 788 123 457',
    },
    {
      id: '2',
      name: 'Cathy R',
      daysAbsent: 2,
      lastAttendance: '2024-01-13',
      parentNotified: false,
      parentContact: '+250 788 123 458',
    },
    {
      id: '3',
      name: 'Eva W',
      daysAbsent: 1,
      lastAttendance: '2024-01-14',
      parentNotified: true,
      parentContact: '+250 788 123 460',
    },
  ]);

  // Students with 3+ days absent need parent notification
  const needsNotification = absentStudents.filter(s => s.daysAbsent >= 3 && !s.parentNotified);

  const getAttendanceRate = () => {
    return Math.round((summary.present / summary.totalStudents) * 100);
  };

  const getStatusColor = (value: number, type: 'present' | 'absent' | 'late' | 'excused') => {
    if (type === 'present') return '#4CAF50';
    if (type === 'absent') return '#F44336';
    if (type === 'late') return '#FF9800';
    return '#2196F3';
  };

  const handleNotifyParent = (student: AbsentStudent) => {
    setSelectedStudent(student);
    setCustomMessage(
      `Dear Parent/Guardian,\n\n` +
      `We noticed that ${student.name} has been absent from school for ${student.daysAbsent} consecutive days ` +
      `(last attendance: ${student.lastAttendance}).\n\n` +
      `Please let us know the reason for the absence so we can provide the necessary support.\n\n` +
      `Thank you,\nSchool Administration`
    );
    setShowNotificationModal(true);
  };

  const handleSendNotification = () => {
    if (selectedStudent) {
      // Simulate sending notification
      setAbsentStudents(prev =>
        prev.map(s =>
          s.id === selectedStudent.id ? { ...s, parentNotified: true } : s
        )
      );
      setNotificationsSent(prev => [...prev, selectedStudent.id]);
      setShowNotificationModal(false);
      Alert.alert(
        'Notification Sent ✅',
        `Absence notification has been sent to ${selectedStudent.name}'s parent/guardian.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleConfirmAttendance = () => {
    Alert.alert(
      'Attendance Confirmed ✅',
      `Attendance for ${summary.className} - ${summary.subject}\n` +
      `Date: ${summary.date}\n\n` +
      `Present: ${summary.present}\n` +
      `Absent: ${summary.absent}\n` +
      `Late: ${summary.late}\n` +
      `Excused: ${summary.excused}\n\n` +
      `Records have been updated automatically.`,
      [
        { text: 'Done', onPress: () => router.back() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Attendance</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Attendance Recorded!</Text>
          <Text style={styles.successSubtitle}>
            Records will be updated automatically
          </Text>
        </View>

        {/* Class Info */}
        <View style={styles.classInfoCard}>
          <View style={styles.classInfoRow}>
            <View style={styles.classInfoItem}>
              <Ionicons name="book-outline" size={18} color="#1A237E" />
              <Text style={styles.classInfoLabel}>Class</Text>
              <Text style={styles.classInfoValue}>{summary.className}</Text>
            </View>
            <View style={styles.classInfoItem}>
              <Ionicons name="document-text-outline" size={18} color="#1A237E" />
              <Text style={styles.classInfoLabel}>Subject</Text>
              <Text style={styles.classInfoValue}>{summary.subject}</Text>
            </View>
          </View>
          <View style={styles.classInfoDivider} />
          <View style={styles.classInfoRow}>
            <View style={styles.classInfoItem}>
              <Ionicons name="calendar-outline" size={18} color="#1A237E" />
              <Text style={styles.classInfoLabel}>Date</Text>
              <Text style={styles.classInfoValue}>{summary.date}</Text>
            </View>
            <View style={styles.classInfoItem}>
              <Ionicons name="people-outline" size={18} color="#1A237E" />
              <Text style={styles.classInfoLabel}>Total</Text>
              <Text style={styles.classInfoValue}>{summary.totalStudents} students</Text>
            </View>
          </View>
        </View>

        {/* Attendance Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: '#4CAF5015' }]}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>{summary.present}</Text>
              <Text style={styles.summaryLabel}>Present</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#F4433615' }]}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#F4433620' }]}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </View>
              <Text style={[styles.summaryValue, { color: '#F44336' }]}>{summary.absent}</Text>
              <Text style={styles.summaryLabel}>Absent</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#FF980015' }]}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#FF980020' }]}>
                <Ionicons name="time" size={24} color="#FF9800" />
              </View>
              <Text style={[styles.summaryValue, { color: '#FF9800' }]}>{summary.late}</Text>
              <Text style={styles.summaryLabel}>Late</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#2196F315' }]}>
              <View style={[styles.summaryIconContainer, { backgroundColor: '#2196F320' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#2196F3" />
              </View>
              <Text style={[styles.summaryValue, { color: '#2196F3' }]}>{summary.excused}</Text>
              <Text style={styles.summaryLabel}>Excused</Text>
            </View>
          </View>

          {/* Attendance Rate Bar */}
          <View style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Text style={styles.rateLabel}>Attendance Rate</Text>
              <Text style={[
                styles.rateValue,
                {
                  color: getAttendanceRate() >= 90 ? '#4CAF50' :
                         getAttendanceRate() >= 75 ? '#FF9800' : '#F44336'
                }
              ]}>
                {getAttendanceRate()}%
              </Text>
            </View>
            <View style={styles.rateBarContainer}>
              <View
                style={[
                  styles.rateBar,
                  {
                    width: `${getAttendanceRate()}%`,
                    backgroundColor: getAttendanceRate() >= 90 ? '#4CAF50' :
                                     getAttendanceRate() >= 75 ? '#FF9800' : '#F44336'
                  }
                ]}
              />
            </View>
          </View>
        </View>

        {/* Absent Students */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Absent Students</Text>
            {needsNotification.length > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>
                  {needsNotification.length} need{needsNotification.length === 1 ? 's' : ''} notification
                </Text>
              </View>
            )}
          </View>

          {absentStudents.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentCardHeader}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>{student.name.charAt(0)}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentMeta}>
                    {student.daysAbsent} day{student.daysAbsent !== 1 ? 's' : ''} absent
                  </Text>
                </View>
                <View style={[
                  styles.daysBadge,
                  {
                    backgroundColor: student.daysAbsent >= 3 ? '#F4433620' :
                                     student.daysAbsent >= 2 ? '#FF980020' : '#FFC10720'
                  }
                ]}>
                  <Text style={[
                    styles.daysBadgeText,
                    {
                      color: student.daysAbsent >= 3 ? '#F44336' :
                             student.daysAbsent >= 2 ? '#FF9800' : '#FFC107'
                    }
                  ]}>
                    {student.daysAbsent >= 3 ? '🔴 Critical' :
                     student.daysAbsent >= 2 ? '🟠 Warning' : '🟡 Monitor'}
                  </Text>
                </View>
              </View>

              <View style={styles.studentCardBody}>
                <View style={styles.studentDetailRow}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.studentDetailText}>
                    Last attendance: {student.lastAttendance}
                  </Text>
                </View>
                <View style={styles.studentDetailRow}>
                  <Ionicons name="call-outline" size={14} color="#666" />
                  <Text style={styles.studentDetailText}>
                    Parent: {student.parentContact}
                  </Text>
                </View>
              </View>

              {/* Notification Button */}
              {student.daysAbsent >= 3 && (
                <TouchableOpacity
                  style={[
                    styles.notifyButton,
                    student.parentNotified && styles.notifyButtonDone,
                  ]}
                  onPress={() => !student.parentNotified && handleNotifyParent(student)}
                  disabled={student.parentNotified}
                >
                  <Ionicons
                    name={student.parentNotified ? 'checkmark-circle' : 'notifications-outline'}
                    size={18}
                    color={student.parentNotified ? '#4CAF50' : '#FFFFFF'}
                  />
                  <Text style={[
                    styles.notifyButtonText,
                    student.parentNotified && styles.notifyButtonTextDone,
                  ]}>
                    {student.parentNotified ? 'Parent Notified' : 'Notify Parent'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmAttendance}
        >
          <Ionicons name="checkmark-done" size={24} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Confirm & Update Records</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notification Modal */}
      <Modal
        visible={showNotificationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Absence Notification</Text>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <>
                <View style={styles.modalStudentInfo}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>{selectedStudent.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.modalStudentName}>{selectedStudent.name}</Text>
                    <Text style={styles.modalStudentMeta}>
                      {selectedStudent.daysAbsent} days absent
                    </Text>
                  </View>
                </View>

                <Text style={styles.modalLabel}>To:</Text>
                <View style={styles.recipientContainer}>
                  <Ionicons name="call" size={16} color="#1A237E" />
                  <Text style={styles.recipientText}>{selectedStudent.parentContact}</Text>
                </View>

                <Text style={styles.modalLabel}>Message:</Text>
                <TextInput
                  style={styles.messageInput}
                  multiline
                  numberOfLines={8}
                  value={customMessage}
                  onChangeText={setCustomMessage}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendNotification}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <Text style={styles.sendButtonText}>Send Notification</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  successBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  successIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4CAF5015',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  classInfoCard: {
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
  classInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classInfoItem: {
    flex: 1,
  },
  classInfoLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  classInfoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 2,
  },
  classInfoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryCard: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  rateValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rateBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rateBar: {
    height: '100%',
    borderRadius: 4,
  },
  alertBadge: {
    backgroundColor: '#F4433615',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F44336',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  studentMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  daysBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  studentCardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  studentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  studentDetailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  notifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  notifyButtonDone: {
    backgroundColor: '#4CAF5015',
  },
  notifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  notifyButtonTextDone: {
    color: '#4CAF50',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A237E',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  modalStudentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  modalStudentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  modalStudentMeta: {
    fontSize: 13,
    color: '#666',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  recipientText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  messageInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#333',
    minHeight: 160,
    marginBottom: 16,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A237E',
    paddingVertical: 14,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});