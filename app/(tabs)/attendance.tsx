// app/(tabs)/attendance.tsx - Attendance Screen
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

interface ClassOption {
  id: string;
  name: string;
  subject: string;
}

export default function AttendanceScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const classes: ClassOption[] = [
    { id: '1', name: 'Class 5A', subject: 'Mathematics' },
    { id: '2', name: 'Class 5B', subject: 'English' },
    { id: '3', name: 'Class 6A', subject: 'Science' },
    { id: '4', name: 'Class 4A', subject: 'Social Studies' },
    { id: '5', name: 'Class 6B', subject: 'Mathematics' },
  ];

  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Kinyarwanda'];

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice M', status: 'present' },
    { id: '2', name: 'Bob K', status: 'present' },
    { id: '3', name: 'Cathy R', status: 'present' },
    { id: '4', name: 'David N', status: 'present' },
    { id: '5', name: 'Eva W', status: 'present' },
    { id: '6', name: 'Frank M', status: 'present' },
    { id: '7', name: 'Grace T', status: 'present' },
  ]);

  const statusOptions = [
    { label: 'Present', value: 'present', color: '#4CAF50' },
    { label: 'Absent', value: 'absent', color: '#F44336' },
    { label: 'Late', value: 'late', color: '#FF9800' },
    { label: 'Excused', value: 'excused', color: '#2196F3' },
  ];

  const handleStatusChange = (studentId: string, newStatus: Student['status']) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }
    if (!selectedSubject) {
      Alert.alert('Error', 'Please select a subject/lesson');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push(
        `./attendance-confirmation?classId=${selectedClass}&date=${selectedDate}&subject=${selectedSubject}`
      );
    }, 1000);
  };

  const getStatusCount = (status: string) => {
    return students.filter(s => s.status === status).length;
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <View style={styles.studentAvatar}>
          <Text style={styles.studentAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <View style={styles.statusButtons}>
        {statusOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              item.status === option.value && {
                backgroundColor: option.color,
                borderColor: option.color,
              },
              { borderColor: option.color },
            ]}
            onPress={() => handleStatusChange(item.id, option.value as Student['status'])}
          >
            <Text
              style={[
                styles.statusButtonText,
                {
                  color: item.status === option.value ? '#FFFFFF' : option.color,
                },
              ]}
            >
              {option.value === 'present' ? 'P' :
               option.value === 'absent' ? 'A' :
               option.value === 'late' ? 'L' : 'E'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Take Attendance</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {/* Class Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Class</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => setShowClassPicker(!showClassPicker)}
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
                    style={[
                      styles.pickerItem,
                      selectedClass === cls.name && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setSelectedClass(cls.name);
                      setSelectedSubject(cls.subject);
                      setShowClassPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedClass === cls.name && styles.pickerItemTextActive,
                      ]}
                    >
                      {cls.name} - {cls.subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Date</Text>
            <View style={styles.filterInput}>
              <Text style={styles.filterText}>{selectedDate}</Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </View>
          </View>

          {/* Subject Selector */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Subject / Lesson</Text>
            <TouchableOpacity
              style={styles.filterInput}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
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
                    style={[
                      styles.pickerItem,
                      selectedSubject === subject && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setSelectedSubject(subject);
                      setShowSubjectPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedSubject === subject && styles.pickerItemTextActive,
                      ]}
                    >
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {statusOptions.map((option) => (
            <View key={option.value} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: option.color }]} />
              <Text style={styles.legendText}>
                {option.label} ({getStatusCount(option.value)})
              </Text>
            </View>
          ))}
        </View>

        {/* Students */}
        <View style={styles.studentListContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Students</Text>
            <Text style={styles.listHeaderSubtitle}>{students.length} enrolled</Text>
          </View>
          <FlatList
            data={students}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveAttendance}
          disabled={isSaving}
        >
          <Ionicons name="save-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </Text>
        </TouchableOpacity>
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
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
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
  filterText: {
    fontSize: 15,
    color: '#1A1A2E',
  },
  placeholderText: {
    color: '#999',
  },
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
  pickerItemActive: {
    backgroundColor: '#E8EAF6',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#333',
  },
  pickerItemTextActive: {
    color: '#1A237E',
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
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
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  listHeaderSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  studentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A2E',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  statusButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
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
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});