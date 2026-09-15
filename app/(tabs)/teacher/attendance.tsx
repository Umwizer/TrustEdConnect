// app/(tabs)/teacher/attendance.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import { getTeacherClasses, ClassData } from '../../../services/classService';
import { getTeacherStudents, StudentData } from '../../../services/studentService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';

type Status = 'present' | 'absent' | 'late' | 'excused';

export default function AttendanceScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  const today = new Date().toISOString().split('T')[0];

  const loadClasses = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }
      const data = await getTeacherClasses(uid);
      setClasses(data);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classId: string) => {
    setLoading(true);
    try {
      const data = await getTeacherStudents([classId]);
      setStudents(data);
      // Default everyone to "present"
      const initial: Record<string, Status> = {};
      data.forEach(s => { initial[s.id] = 'present'; });
      setStatuses(initial);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClasses();
    if (selectedClass) await loadStudents(selectedClass.id);
    setRefreshing(false);
  };

  const handleSelectClass = (cls: ClassData) => {
    setSelectedClass(cls);
    setShowClassPicker(false);
    loadStudents(cls.id);
  };

  const setStatus = (studentId: string, status: Status) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const counts = {
    present: Object.values(statuses).filter(v => v === 'present').length,
    absent: Object.values(statuses).filter(v => v === 'absent').length,
    late: Object.values(statuses).filter(v => v === 'late').length,
    excused: Object.values(statuses).filter(v => v === 'excused').length,
  };

  const handleSave = async () => {
    if (!selectedClass) {
      Alert.alert('Select a class', 'Please choose a class first.');
      return;
    }
    if (students.length === 0) {
      Alert.alert('No students', 'No students in this class yet.');
      return;
    }
    try {
      setSaving(true);
      const uid = auth.currentUser!.uid;
      const promises = students.map(s =>
        addDoc(collection(db, 'attendance'), {
          studentId: s.id,
          studentName: s.fullName,
          classId: selectedClass.id,
          className: selectedClass.className,
          date: today,
          status: statuses[s.id] || 'present',
          markedBy: uid,
          markedAt: serverTimestamp(),
        })
      );
      await Promise.all(promises);
      Alert.alert('Success', 'Attendance saved.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Take Attendance</Text>

        {/* Class selector */}
        <View style={styles.card}>
          <Text style={styles.label}>Class</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setShowClassPicker(!showClassPicker)}
          >
            <Text style={styles.selectText}>
              {selectedClass ? `${selectedClass.className} - ${selectedClass.subject}` : 'Select Class'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showClassPicker && (
            <View style={styles.pickerDropdown}>
              {classes.length === 0 ? (
                <Text style={styles.noClassText}>No classes assigned</Text>
              ) : (
                classes.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.pickerItem}
                    onPress={() => handleSelectClass(c)}
                  >
                    <Text style={styles.pickerItemText}>
                      {c.className} - {c.subject}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          <Text style={[styles.label, { marginTop: 12 }]}>Date</Text>
          <View style={styles.select}>
            <Text style={styles.selectText}>{today}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </View>
        </View>

        {/* Counts */}
        <View style={styles.countsRow}>
          <View style={styles.countItem}>
            <View style={[styles.dot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.countText}>Present ({counts.present})</Text>
          </View>
          <View style={styles.countItem}>
            <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.countText}>Absent ({counts.absent})</Text>
          </View>
          <View style={styles.countItem}>
            <View style={[styles.dot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.countText}>Late ({counts.late})</Text>
          </View>
          <View style={styles.countItem}>
            <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.countText}>Excused ({counts.excused})</Text>
          </View>
        </View>

        {/* Students */}
        <View style={styles.studentsCard}>
          <View style={styles.studentsHeader}>
            <Text style={styles.studentsTitle}>Students</Text>
            <Text style={styles.studentsCount}>{students.length} enrolled</Text>
          </View>

          {loading ? (
            <View style={{ paddingVertical: 30, alignItems: 'center' }}>
              <ActivityIndicator color="#1A237E" />
            </View>
          ) : students.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={40} color="#B8C4E0" />
              <Text style={styles.emptyText}>
                {selectedClass
                  ? 'No students in this class yet'
                  : 'Select a class to see students'}
              </Text>
            </View>
          ) : (
            students.map(s => {
              const st = statuses[s.id] || 'present';
              return (
                <View key={s.id} style={styles.studentRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{s.fullName.charAt(0)}</Text>
                  </View>
                  <Text style={styles.studentName}>{s.fullName}</Text>
                  <View style={styles.statusBtns}>
                    {(['present', 'absent', 'late', 'excused'] as Status[]).map(k => {
                      const active = st === k;
                      const color =
                        k === 'present' ? '#16A34A' :
                        k === 'absent' ? '#DC2626' :
                        k === 'late' ? '#D97706' : '#2563EB';
                      return (
                        <TouchableOpacity
                          key={k}
                          style={[
                            styles.statusBtn,
                            { borderColor: color },
                            active && { backgroundColor: color },
                          ]}
                          onPress={() => setStatus(s.id, k)}
                        >
                          <Text
                            style={[
                              styles.statusBtnText,
                              { color: active ? '#FFFFFF' : color },
                            ]}
                          >
                            {k[0].toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Save */}
        {selectedClass && students.length > 0 && (
          <TouchableOpacity
            style={[styles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Attendance</Text>
            )}
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E', marginTop: 8, marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 6 },
  select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectText: { fontSize: 14, color: '#1A1A2E' },
  pickerDropdown: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 6 },
  pickerItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  pickerItemText: { fontSize: 14, color: '#1A1A2E' },
  noClassText: { padding: 14, fontSize: 13, color: '#999', fontStyle: 'italic' },
  countsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  countItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  countText: { fontSize: 12, color: '#666' },
  studentsCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, marginBottom: 12 },
  studentsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  studentsTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  studentsCount: { fontSize: 12, color: '#999' },
  emptyBox: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#999', marginTop: 8, textAlign: 'center' },
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F7FA' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#1A237E' },
  studentName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  statusBtns: { flexDirection: 'row', gap: 6 },
  statusBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  statusBtnText: { fontSize: 13, fontWeight: '800' },
  saveBtn: { backgroundColor: '#1A237E', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});