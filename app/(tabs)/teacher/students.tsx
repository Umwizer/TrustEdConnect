// app/(tabs)/teacher/students.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import { getTeacherClasses } from '../../../services/classService';
import { getTeacherStudents, StudentData } from '../../../services/studentService';
import { useTheme } from '../../../contexts/ThemeContext';

export default function StudentsScreen() {
  const { theme } = useTheme();
  const c = theme.colors;

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentData[]>([]);

  const load = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }
      const cls = await getTeacherClasses(uid);
      const data = await getTeacherStudents(cls.map(c => c.id));
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.title, { color: c.text }]}>Students</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          {students.length} students in your classes
        </Text>
        <Text style={[styles.note, { color: c.textSecondary }]}>
          Students are added by school administration.
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={c.primary} />
          </View>
        ) : students.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={48} color="#B8C4E0" />
            <Text style={[styles.emptyTitle, { color: c.text }]}>
              No students yet
            </Text>
            <Text style={[styles.emptySub, { color: c.textSecondary }]}>
              Students assigned to your classes will appear here.
            </Text>
          </View>
        ) : (
          students.map(s => (
            <View key={s.id} style={[styles.card, { backgroundColor: c.card }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{s.fullName.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: c.text }]}>
                  {s.fullName}
                </Text>
                <Text style={[styles.studentMeta, { color: c.textSecondary }]}>
                  {s.studentId} · {s.parentPhone || 'No phone'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  s.status === 'active'
                    ? styles.activeBadge
                    : styles.inactiveBadge,
                ]}
              >
                <Text style={styles.statusText}>{s.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  sub: { fontSize: 14, marginTop: 4 },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6,
    marginBottom: 16,
  },
  center: { paddingVertical: 40, alignItems: 'center' },
  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySub: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#1A237E' },
  name: { fontSize: 15, fontWeight: '700' },
  studentMeta: { fontSize: 12, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeBadge: { backgroundColor: '#DCFCE7' },
  inactiveBadge: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
});