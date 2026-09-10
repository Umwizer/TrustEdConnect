// app/(tabs)/results.tsx - Academic Results Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface StudentResult {
  id: string;
  name: string;
  score: string;
  grade: string;
}

interface ClassOption {
  id: string;
  name: string;
}

export default function ResultsScreen() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [showAssessmentPicker, setShowAssessmentPicker] = useState(false);
  const [showTermPicker, setShowTermPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const classes: ClassOption[] = [
    { id: '1', name: 'Class 5A' },
    { id: '2', name: 'Class 5B' },
    { id: '3', name: 'Class 6A' },
    { id: '4', name: 'Class 4A' },
    { id: '5', name: 'Class 6B' },
  ];

  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda'];
  const assessments = ['Quiz', 'Test', 'Assignment', 'Mid-Term Exam', 'Final Exam'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  const [students, setStudents] = useState<StudentResult[]>([
    { id: '1', name: 'Alice M', score: '', grade: '' },
    { id: '2', name: 'Bob K', score: '', grade: '' },
    { id: '3', name: 'Cathy R', score: '', grade: '' },
    { id: '4', name: 'David N', score: '', grade: '' },
    { id: '5', name: 'Eva W', score: '', grade: '' },
    { id: '6', name: 'Frank M', score: '', grade: '' },
    { id: '7', name: 'Grace T', score: '', grade: '' },
  ]);

  const calculateGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    if (grade === 'A') return '#4CAF50';
    if (grade === 'B') return '#8BC34A';
    if (grade === 'C') return '#FF9800';
    if (grade === 'D') return '#FF5722';
    if (grade === 'F') return '#F44336';
    return '#999';
  };

  const handleScoreChange = (studentId: string, score: string) => {
    if (score !== '' && (!/^\d{0,3}$/.test(score) || parseInt(score) > 100)) {
      return;
    }
    const grade = score ? calculateGrade(parseInt(score)) : '';
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, score, grade } : student
      )
    );
  };

  const handleSaveResults = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    if (!selectedAssessment) {
      Alert.alert('Error', 'Please select an assessment type');
      return;
    }
    if (!selectedTerm) {
      Alert.alert('Error', 'Please select a term');
      return;
    }

    const filledCount = students.filter(s => s.score !== '').length;
    if (filledCount === 0) {
      Alert.alert('Error', 'Please enter at least one student score');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const average = students.reduce((sum, s) => sum + (parseInt(s.score) || 0), 0) / filledCount;
      Alert.alert(
        'Results Saved ✅',
        `Class: ${selectedClass}\n` +
        `Subject: ${selectedSubject}\n` +
        `Assessment: ${selectedAssessment}\n` +
        `Term: ${selectedTerm}\n\n` +
        `Students Graded: ${filledCount}/${students.length}\n` +
        `Class Average: ${average.toFixed(1)}%\n\n` +
        `Results have been saved successfully.`,
        [{ text: 'Done', onPress: () => router.back() }]
      );
    }, 1500);
  };

  const getAverage = () => {
    const filled = students.filter(s => s.score !== '');
    if (filled.length === 0) return 0;
    return filled.reduce((sum, s) => sum + (parseInt(s.score) || 0), 0) / filled.length;
  };

  const renderStudentItem = ({ item }: { item: StudentResult }) => (
    <View style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>

      <View style={styles.scoreInputContainer}>
        <TextInput
          style={styles.scoreInput}
          placeholder="0"
          placeholderTextColor="#BBB"
          keyboardType="numeric"
          maxLength={3}
          value={item.score}
          onChangeText={(text) => handleScoreChange(item.id, text)}
        />
        <Text style={styles.scoreMax}>/100</Text>
      </View>

      <View style={[
        styles.gradeBadge,
        { backgroundColor: item.grade ? getGradeColor(item.grade) + '20' : '#F0F0F0' }
      ]}>
        <Text style={[
          styles.gradeBadgeText,
          { color: item.grade ? getGradeColor(item.grade) : '#999' }
        ]}>
          {item.grade || '—'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Results</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.filtersContainer}>
          {/* Class Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Class</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => {
                setShowClassPicker(!showClassPicker);
                setShowSubjectPicker(false);
                setShowAssessmentPicker(false);
                setShowTermPicker(false);
              }}
            >
              <Text style={[styles.filterText, !selectedClass && styles.placeholderText]}>
                {selectedClass || 'Select Class'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showClassPicker && (
              <View style={styles.pickerDropdown}>
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls.id}
                    style={[styles.pickerItem, selectedClass === cls.name && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedClass(cls.name);
                      setShowClassPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedClass === cls.name && styles.pickerItemTextActive]}>
                      {cls.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Subject Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Subject</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => {
                setShowSubjectPicker(!showSubjectPicker);
                setShowClassPicker(false);
                setShowAssessmentPicker(false);
                setShowTermPicker(false);
              }}
            >
              <Text style={[styles.filterText, !selectedSubject && styles.placeholderText]}>
                {selectedSubject || 'Select Subject'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showSubjectPicker && (
              <View style={styles.pickerDropdown}>
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={[styles.pickerItem, selectedSubject === subject && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedSubject(subject);
                      setShowSubjectPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedSubject === subject && styles.pickerItemTextActive]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Assessment Type Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Assessment Type</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => {
                setShowAssessmentPicker(!showAssessmentPicker);
                setShowClassPicker(false);
                setShowSubjectPicker(false);
                setShowTermPicker(false);
              }}
            >
              <Text style={[styles.filterText, !selectedAssessment && styles.placeholderText]}>
                {selectedAssessment || 'Select Assessment'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showAssessmentPicker && (
              <View style={styles.pickerDropdown}>
                {assessments.map((assessment) => (
                  <TouchableOpacity
                    key={assessment}
                    style={[styles.pickerItem, selectedAssessment === assessment && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedAssessment(assessment);
                      setShowAssessmentPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedAssessment === assessment && styles.pickerItemTextActive]}>
                      {assessment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Term Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Term</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => {
                setShowTermPicker(!showTermPicker);
                setShowClassPicker(false);
                setShowSubjectPicker(false);
                setShowAssessmentPicker(false);
              }}
            >
              <Text style={[styles.filterText, !selectedTerm && styles.placeholderText]}>
                {selectedTerm || 'Select Term'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {showTermPicker && (
              <View style={styles.pickerDropdown}>
                {terms.map((term) => (
                  <TouchableOpacity
                    key={term}
                    style={[styles.pickerItem, selectedTerm === term && styles.pickerItemActive]}
                    onPress={() => {
                      setSelectedTerm(term);
                      setShowTermPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerItemText, selectedTerm === term && styles.pickerItemTextActive]}>
                      {term}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {selectedClass && selectedSubject && (
          <View style={styles.averageCard}>
            <View style={styles.averageHeader}>
              <View>
                <Text style={styles.averageLabel}>Class Average</Text>
                <Text style={styles.averageSubtext}>
                  {students.filter(s => s.score !== '').length} of {students.length} graded
                </Text>
              </View>
              <Text style={[
                styles.averageValue,
                {
                  color: getAverage() >= 80 ? '#4CAF50' :
                         getAverage() >= 60 ? '#FF9800' : '#F44336'
                }
              ]}>
                {getAverage().toFixed(1)}%
              </Text>
            </View>
            <View style={styles.averageBarContainer}>
              <View
                style={[
                  styles.averageBar,
                  {
                    width: `${getAverage()}%`,
                    backgroundColor: getAverage() >= 80 ? '#4CAF50' :
                                     getAverage() >= 60 ? '#FF9800' : '#F44336',
                  },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.studentListContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Student Scores</Text>
            <Text style={styles.listHeaderSubtitle}>Score / 100</Text>
          </View>

          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveResults}
          disabled={isSaving}
        >
          <Ionicons name="save-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Results'}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 24,
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
  headerRight: { width: 40 },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  filterGroup: { marginBottom: 12 },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 4 },
  filterInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  filterText: { fontSize: 15, color: '#1A1A2E' },
  placeholderText: { color: '#999' },
  pickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerItemActive: { backgroundColor: '#E8EAF6' },
  pickerItemText: { fontSize: 14, color: '#333' },
  pickerItemTextActive: { color: '#1A237E', fontWeight: '600' },
  averageCard: {
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
  averageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  averageLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  averageSubtext: { fontSize: 12, color: '#999', marginTop: 2 },
  averageValue: { fontSize: 28, fontWeight: 'bold' },
  averageBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  averageBar: { height: '100%', borderRadius: 4 },
  studentListContainer: {
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E' },
  listHeaderSubtitle: { fontSize: 12, color: '#999' },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  studentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  studentAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  studentAvatarText: { fontSize: 14, fontWeight: 'bold', color: '#1A237E' },
  studentName: { fontSize: 15, fontWeight: '500', color: '#1A1A2E', flex: 1 },
  scoreInputContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  scoreInput: {
    width: 56, height: 40,
    borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10,
    textAlign: 'center', fontSize: 15, fontWeight: '600',
    color: '#1A1A2E', backgroundColor: '#FAFAFA',
  },
  scoreMax: { fontSize: 12, color: '#999', marginLeft: 4 },
  gradeBadge: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  gradeBadgeText: { fontSize: 14, fontWeight: 'bold' },
  saveButton: {
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
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});