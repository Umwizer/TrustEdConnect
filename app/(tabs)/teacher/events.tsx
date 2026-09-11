// app/(tabs)/teacher/events.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator,
  TouchableOpacity, Modal, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../../services/firebase';
import { getAllEvents, createEvent, EventData } from '../../../services/eventService';

export default function EventsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const reset = () => {
    setTitle(''); setDate(''); setTime('');
    setLocation(''); setDescription('');
  };

  const handleSave = async () => {
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      Alert.alert('Missing fields', 'Title, date, time, location required.');
      return;
    }
    try {
      setSaving(true);
      await createEvent({
        title, date, time, location, description,
        createdBy: auth.currentUser!.uid,
        createdByName: auth.currentUser?.displayName || 'Teacher',
      });
      Alert.alert('Success', 'Event created.');
      setShowModal(false);
      reset();
      await load();
    } catch (err) {
      Alert.alert('Error', 'Could not create event.');
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
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Events</Text>
            <Text style={styles.sub}>{events.length} events</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Create</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color="#1A237E" /></View>
        ) : events.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={48} color="#B8C4E0" />
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptySub}>Tap "Create" to add your first event.</Text>
          </View>
        ) : (
          events.map(e => (
            <View key={e.id} style={styles.card}>
              <View style={styles.dateBox}>
                <Ionicons name="calendar-outline" size={20} color="#1A237E" />
                <Text style={styles.dateText}>{e.date || '—'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Text style={styles.eventMeta}>
                  {e.time} · {e.location}
                </Text>
                {e.description ? (
                  <Text style={styles.eventDesc} numberOfLines={2}>
                    {e.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Event</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Parent Meeting"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Date *</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="2026-09-15"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Time *</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="3:00 PM"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Hall A"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Optional details..."
                multiline
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Create Event</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E' },
  sub: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1A237E', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  center: { paddingVertical: 40, alignItems: 'center' },
  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10 },
  dateBox: { alignItems: 'center' },
  dateText: { fontSize: 10, fontWeight: '700', color: '#1A237E', marginTop: 4 },
  eventTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  eventMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  eventDesc: { fontSize: 12, color: '#666', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A237E' },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 6, marginTop: 8 },
  input: { backgroundColor: '#F5F7FA', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1A1A2E', marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  saveBtn: { backgroundColor: '#1A237E', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16, marginBottom: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});