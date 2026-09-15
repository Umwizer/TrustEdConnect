// app/(tabs)/teacher/notifications.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import { getMyNotifications, NotificationData } from '../../../services/notificationService';

export default function NotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationData[]>([]);

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) { setLoading(false); return; }
      const data = await getMyNotifications(uid);
      setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.sub}>{items.length} notifications</Text>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color="#1A237E" /></View>
        ) : items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-off-outline" size={48} color="#B8C4E0" />
            <Text style={styles.emptyTitle}>All caught up</Text>
            <Text style={styles.emptySub}>New notifications will appear here.</Text>
          </View>
        ) : (
          items.map(n => (
            <View key={n.id} style={styles.card}>
              <View style={styles.iconBox}>
                <Ionicons name="notifications-outline" size={20} color="#1A237E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{n.title}</Text>
                <Text style={styles.msg} numberOfLines={2}>{n.message}</Text>
              </View>
            </View>
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
  emptySub: { fontSize: 13, color: '#999', marginTop: 6 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
  },
  iconBox: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  name: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  msg: { fontSize: 12, color: '#666', marginTop: 2 },
});