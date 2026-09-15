// app/(tabs)/student-detail/[id].tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface StudentDetail {
  id: string;
  name: string;
  studentId: string;
  class: string;
  grade: string;
  gender: string;
  attendance: number;
  academicAverage: number;
  performanceTrend: 'improving' | 'stable' | 'declining';
  teacherComments: string[];
  parentContact: string;
  email: string;
  address: string;
  subjects: { name: string; score: number; grade: string }[];
  importantNotes: {
    date: string;
    note: string;
    type: 'academic' | 'behavioral' | 'attendance' | 'other';
  }[];
}

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'academic' | 'behavioral' | 'attendance' | 'other'>('academic');

  const studentData: StudentDetail = {
    id: id || '1',
    name: 'Alice M',
    studentId: 'STU-2024-001',
    class: 'Class 5A',
    grade: '5th Grade',
    gender: 'Female',
    attendance: 92,
    academicAverage: 85,
    performanceTrend: 'improving',
    teacherComments: [
      'Alice is a bright student who actively participates in class discussions.',
      'She has shown significant improvement in Mathematics this term.',
      'Needs to work on time management during exams.',
    ],
    parentContact: '+250 788 123 456',
    email: 'alice@email.com',
    address: 'KG 123 St, Kigali, Rwanda',
    subjects: [
      { name: 'Mathematics', score: 88, grade: 'A' },
      { name: 'English', score: 82, grade: 'B+' },
      { name: 'Science', score: 90, grade: 'A-' },
      { name: 'Social Studies', score: 78, grade: 'B' },
      { name: 'Kinyarwanda', score: 85, grade: 'B+' },
    ],
    importantNotes: [
      { date: '2024-01-15', note: 'Parent-teacher meeting scheduled', type: 'other' },
      { date: '2024-01-10', note: 'Excellent performance in Science project', type: 'academic' },
      { date: '2024-01-05', note: 'Attendance improved this month', type: 'attendance' },
    ],
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getTrendInfo = (trend: string) => {
    if (trend === 'improving') return { label: 'Improving 📈', color: '#4CAF50' };
    if (trend === 'stable') return { label: 'Stable ➡️', color: '#FF9800' };
    if (trend === 'declining') return { label: 'Declining 📉', color: '#F44336' };
    return { label: 'Unknown', color: '#999' };
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#FF9800';
    return '#F44336';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#4CAF50';
    if (grade.startsWith('B')) return '#FF9800';
    return '#F44336';
  };

  const getNoteTypeIcon = (type: string) => {
    if (type === 'academic') return 'school-outline';
    if (type === 'behavioral') return 'people-outline';
    if (type === 'attendance') return 'calendar-outline';
    return 'information-circle-outline';
  };

  const getNoteTypeColor = (type: string) => {
    if (type === 'academic') return '#1A237E';
    if (type === 'behavioral') return '#E65100';
    if (type === 'attendance') return '#00695C';
    return '#666';
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      Alert.alert('Success', 'Comment added successfully');
      setNewComment('');
      setShowCommentModal(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      Alert.alert('Success', 'Note added successfully');
      setNewNote('');
      setShowNoteModal(false);
    }
  };

  const trendInfo = getTrendInfo(studentData.performanceTrend);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>{studentData.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{studentData.name}</Text>
          <Text style={styles.profileClass}>{studentData.class}</Text>
          <View style={styles.profileBadges}>
            <View style={styles.profileBadge}>
              <Ionicons name="id-card-outline" size={14} color="#666" />
              <Text style={styles.profileBadgeText}>{studentData.studentId}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Ionicons name="person-outline" size={14} color="#666" />
              <Text style={styles.profileBadgeText}>{studentData.gender}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: getAttendanceColor(studentData.attendance) + '20' }]}>
              <Ionicons name="calendar-outline" size={24} color={getAttendanceColor(studentData.attendance)} />
            </View>
            <Text style={styles.statValue}>{studentData.attendance}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: getScoreColor(studentData.academicAverage) + '20' }]}>
              <Ionicons name="stats-chart-outline" size={24} color={getScoreColor(studentData.academicAverage)} />
            </View>
            <Text style={styles.statValue}>{studentData.academicAverage}%</Text>
            <Text style={styles.statLabel}>Academic Avg</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: trendInfo.color + '20' }]}>
              <Ionicons name="trending-up-outline" size={24} color={trendInfo.color} />
            </View>
            <Text style={[styles.statValue, { color: trendInfo.color }]}>{trendInfo.label}</Text>
            <Text style={styles.statLabel}>Performance</Text>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subject Performance</Text>
            <TouchableOpacity>
              <Text style={styles.sectionSeeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subjectsContainer}>
            {studentData.subjects.map((subject, index) => (
              <View key={index} style={styles.subjectItem}>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <View style={[styles.subjectGradeBadge, { backgroundColor: getGradeColor(subject.grade) + '20' }]}>
                    <Text style={[styles.subjectGrade, { color: getGradeColor(subject.grade) }]}>{subject.grade}</Text>
                  </View>
                </View>
                <View style={styles.subjectScoreContainer}>
                  <View style={styles.subjectScoreBar}>
                    <View
                      style={[
                        styles.subjectScoreFill,
                        { width: `${subject.score}%`, backgroundColor: getScoreColor(subject.score) },
                      ]}
                    />
                  </View>
                  <Text style={[styles.subjectScoreText, { color: getScoreColor(subject.score) }]}>
                    {subject.score}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Teacher Comments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Teacher Comments</Text>
            <TouchableOpacity onPress={() => setShowCommentModal(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#1A237E" />
            </TouchableOpacity>
          </View>
          <View style={styles.commentsContainer}>
            {studentData.teacherComments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>T</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentText}>{comment}</Text>
                  <Text style={styles.commentDate}>Teacher - 2 days ago</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Important Notes */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Important Notes</Text>
            <TouchableOpacity onPress={() => setShowNoteModal(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#1A237E" />
            </TouchableOpacity>
          </View>
          <View style={styles.notesContainer}>
            {studentData.importantNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={[styles.noteIconContainer, { backgroundColor: getNoteTypeColor(note.type) + '20' }]}>
                  <Ionicons name={getNoteTypeIcon(note.type) as any} size={20} color={getNoteTypeColor(note.type)} />
                </View>
                <View style={styles.noteContent}>
                  <Text style={styles.noteText}>{note.note}</Text>
                  <Text style={styles.noteDate}>{note.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Comment Modal */}
      <Modal visible={showCommentModal} transparent animationType="slide" onRequestClose={() => setShowCommentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Comment</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your comment here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
              <Text style={styles.modalButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Note Modal */}
      <Modal visible={showNoteModal} transparent animationType="slide" onRequestClose={() => setShowNoteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Important Note</Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Note Type</Text>
            <View style={styles.noteTypeContainer}>
              {['academic', 'behavioral', 'attendance', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.noteTypeButton, noteType === type && styles.noteTypeButtonActive]}
                  onPress={() => setNoteType(type as any)}
                >
                  <Text style={[styles.noteTypeText, noteType === type && styles.noteTypeTextActive]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your note here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={newNote}
              onChangeText={setNewNote}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddNote}>
              <Text style={styles.modalButtonText}>Add Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  editButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  profileSection: { alignItems: 'center', marginTop: -20, paddingHorizontal: 20 },
  profileImageContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
  },
  profileImageText: { fontSize: 40, fontWeight: 'bold', color: '#1A237E' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E', marginTop: 12 },
  profileClass: { fontSize: 16, color: '#666', marginTop: 4 },
  profileBadges: { flexDirection: 'row', marginTop: 10, gap: 8 },
  profileBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  profileBadgeText: { fontSize: 12, color: '#666', marginLeft: 4 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  statIconContainer: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  lastSection: { marginBottom: 30 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  sectionSeeAll: { fontSize: 14, color: '#1A237E', fontWeight: '600' },
  subjectsContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  subjectItem: { marginBottom: 12 },
  subjectInfo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
  },
  subjectName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  subjectGradeBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 8 },
  subjectGrade: { fontSize: 12, fontWeight: '600' },
  subjectScoreContainer: { flexDirection: 'row', alignItems: 'center' },
  subjectScoreBar: {
    flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, overflow: 'hidden', marginRight: 10,
  },
  subjectScoreFill: { height: '100%', borderRadius: 3 },
  subjectScoreText: { fontSize: 14, fontWeight: '600', width: 40, textAlign: 'right' },
  commentsContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  commentItem: { flexDirection: 'row', marginBottom: 12 },
  commentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  commentAvatarText: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  commentContent: { flex: 1 },
  commentText: { fontSize: 14, color: '#1A1A2E', lineHeight: 20 },
  commentDate: { fontSize: 11, color: '#999', marginTop: 4 },
  notesContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  noteItem: { flexDirection: 'row', marginBottom: 12 },
  noteIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  noteContent: { flex: 1 },
  noteText: { fontSize: 14, color: '#1A1A2E', lineHeight: 20 },
  noteDate: { fontSize: 11, color: '#999', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E' },
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  modalInput: {
    backgroundColor: '#F5F7FA', borderRadius: 12, padding: 16, fontSize: 16, color: '#333',
    minHeight: 100, textAlignVertical: 'top', marginBottom: 16,
  },
  modalButton: { backgroundColor: '#1A237E', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  noteTypeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  noteTypeButton: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E8E8E8',
  },
  noteTypeButtonActive: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  noteTypeText: { fontSize: 14, color: '#666' },
  noteTypeTextActive: { color: '#FFFFFF' },
});