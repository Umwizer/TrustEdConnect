// app/(tabs)/teacher/academic.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import { getTeacherAcademicStats, AcademicStats } from '../../../services/academicService';

export default function AcademicScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AcademicStats>({
    averageScore: 0, totalResults: 0,
    gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 },
  });

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) { setLoading(false); return; }
      const data = await getTeacherAcademicStats(uid);
      setStats(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Academic</Text>
        <Text style={styles.sub}>Your class performance overview</Text>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color="#1A237E" /></View>
        ) : (
          <>
            <View style={styles.bigCard}>
              <Text style={styles.bigLabel}>Average Score</Text>
              <Text style={styles.bigValue}>{stats.averageScore}%</Text>
              <Text style={styles.bigSub}>{stats.totalResults} results recorded</Text>
            </View>

            <Text style={styles.sectionTitle}>Grade Distribution</Text>
            {(Object.keys(stats.gradeDistribution) as (keyof typeof stats.gradeDistribution)[]).map(g => (
              <View key={g} style={styles.gradeRow}>
                <Text style={styles.gradeLetter}>{g}</Text>
                <View style={styles.gradeBarBg}>
                  <View style={[styles.gradeBar, { width: `${Math.min(stats.gradeDistribution[g] * 10, 100)}%` }]} />
                </View>
                <Text style={styles.gradeCount}>{stats.gradeDistribution[g]}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E', marginTop: 8 },
  sub: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },
  center: { paddingVertical: 40, alignItems: 'center' },
  bigCard: {
    backgroundColor: '#0B2A5B', borderRadius: 20, padding: 24, alignItems: 'center',
  },
  bigLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  bigValue: { color: '#FFFFFF', fontSize: 44, fontWeight: '800', marginTop: 4 },
  bigSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E', marginTop: 24, marginBottom: 12 },
  gradeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  gradeLetter: { width: 24, fontWeight: '800', color: '#1A237E' },
  gradeBarBg: { flex: 1, height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden' },
  gradeBar: { height: '100%', backgroundColor: '#1A237E' },
  gradeCount: { width: 30, textAlign: 'right', color: '#666', fontSize: 12 },
});