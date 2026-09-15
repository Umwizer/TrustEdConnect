// app/(tabs)/teacher/explore.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Discover resources, tips, and more.</Text>

      <View style={styles.card}>
        <Ionicons name="bulb-outline" size={28} color="#1A237E" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.cardTitle}>Teaching Tips</Text>
          <Text style={styles.cardSub}>Coming soon</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="library-outline" size={28} color="#7C3AED" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.cardTitle}>Resources</Text>
          <Text style={styles.cardSub}>Coming soon</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="people-outline" size={28} color="#16A34A" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.cardTitle}>Community</Text>
          <Text style={styles.cardSub}>Coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E' },
  sub: { fontSize: 14, color: '#666', marginTop: 6, marginBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  cardSub: { fontSize: 12, color: '#999' },
});