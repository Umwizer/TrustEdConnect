// app/(tabs)/teacher/classes.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '../../../services/firebase';
import { getTeacherClasses, ClassData } from '../../../services/classService';

export default function ClassesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<ClassData[]>([]);

  const load = async () => {
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

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>My Classes</Text>
        <Text style={styles.sub}>
          {classes.length} classes assigned by administration
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#1A237E" />
          </View>
        ) : classes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="book-outline" size={48} color="#B8C4E0" />
            <Text style={styles.emptyTitle}>No classes assigned</Text>
            <Text style={styles.emptySub}>
              Contact school administration to be assigned to classes.
            </Text>
          </View>
        ) : (
          classes.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.card}
              onPress={() => router.push(`/teacher/class-detail/${c.id}` as any)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.className}>{c.className}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{c.gradeLevel}</Text>
                </View>
              </View>
              <Text style={styles.subject}>{c.subject}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>
                    {c.studentCount} students
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{c.room}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E', marginTop: 8 },
  sub: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  center: { paddingVertical: 40, alignItems: 'center' },
  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 12 },
  emptySub: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  className: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  badge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#1A237E' },
  subject: { fontSize: 14, color: '#666', marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#666' },
});