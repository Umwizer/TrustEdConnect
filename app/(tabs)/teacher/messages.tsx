// app/(tabs)/teacher/messages.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { auth } from '../../../services/firebase';
import { getTeacherClasses } from '../../../services/classService';
import { getTeacherStudents, StudentData } from '../../../services/studentService';
import { getMyMessages, sendMessage, MessageData } from '../../../services/messageService';

export default function MessagesScreen() {
  const params = useLocalSearchParams<{ action?: string }>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [showModal, setShowModal] = useState(params.action === 'send');
  const [saving, setSaving] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [content, setContent] = useState('');

  const load = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setLoading(false);
        return;
      }
      const [msgs, cls] = await Promise.all([
        getMyMessages(uid),
        getTeacherClasses(uid),
      ]);
      setMessages(msgs);
      const studs = await getTeacherStudents(cls.map(c => c.id));
      setStudents(studs);
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

  const handleSend = async () => {
    if (!selectedStudent) {
      Alert.alert('Select student', 'Please pick a student to identify the parent.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Empty message', 'Please write your message.');
      return;
    }

    // ✅ IMPORTANT: send to the PARENT, not the student
    const recipientName = `Parent of ${selectedStudent.fullName}`;

    // If we have parentId, use it. Otherwise fallback to studentId for linking.
    const recipientId = (selectedStudent as any).parentId || selectedStudent.id;

    try {
      setSaving(true);
      await sendMessage({
        senderId: auth.currentUser!.uid,
        recipientId,
        recipientName,
        content,
      });
      Alert.alert(
        'Message sent',
        `Sent to ${recipientName}`
      );
      setShowModal(false);
      setSelectedStudent(null);
      setContent('');
      await load();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not send message.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ SMS fallback — if parent has a phone number
  const handleSMS = () => {
    if (!selectedStudent) {
      Alert.alert('Select student', 'Please pick a student first.');
      return;
    }
    if (!selectedStudent.parentPhone) {
      Alert.alert('No phone', 'No parent phone number on file.');
      return;
    }
    const url = `sms:${selectedStudent.parentPhone}?body=${encodeURIComponent(content || '')}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Cannot open SMS', 'Your device cannot send SMS.')
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.sub}>{messages.length} messages to parents</Text>
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.newBtnText}>New</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}><ActivityIndicator color="#1A237E" /></View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="chatbubble-outline" size={48} color="#B8C4E0" />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySub}>
              Tap "New" to send a message to a parent.
            </Text>
          </View>
        ) : (
          messages.map(m => (
            <View key={m.id} style={styles.card}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={20} color="#1A237E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.msgTo} numberOfLines={1}>{m.recipientName}</Text>
                <Text style={styles.msgContent} numberOfLines={2}>{m.content}</Text>
              </View>
              {!m.isRead && <View style={styles.dot} />}
            </View>
          ))
        )}
      </ScrollView>

      {/* SEND MESSAGE MODAL */}
      <Modal visible={showModal} animationType="slide" transparent onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send to Parent</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setSelectedStudent(null); setContent(''); }}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Which student? *</Text>
              <Text style={styles.hint}>
                The message goes to this student's parent/guardian.
              </Text>

              {students.length === 0 ? (
                <Text style={styles.noClassText}>No students in your classes yet.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  {students.map(s => (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.chip, selectedStudent?.id === s.id && styles.chipActive]}
                      onPress={() => setSelectedStudent(s)}
                    >
                      <Text style={[styles.chipText, selectedStudent?.id === s.id && styles.chipTextActive]}>
                        {s.fullName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {selectedStudent && (
                <View style={styles.recipientBox}>
                  <Ionicons name="person-outline" size={16} color="#1A237E" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.recipientText}>
                      Parent of {selectedStudent.fullName}
                    </Text>
                    {selectedStudent.parentPhone ? (
                      <Text style={styles.recipientSub}>
                        📞 {selectedStudent.parentPhone}
                      </Text>
                    ) : (
                      <Text style={styles.recipientSub}>
                        No phone on file
                      </Text>
                    )}
                  </View>
                </View>
              )}

              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                placeholder="Write your message to the parent..."
                value={content}
                onChangeText={setContent}
                multiline
                placeholderTextColor="#999"
              />

              {/* Send in-app */}
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSend}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>  Send in App</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* SMS fallback */}
              {selectedStudent?.parentPhone ? (
                <TouchableOpacity
                  style={styles.smsBtn}
                  onPress={handleSMS}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#1A237E" />
                  <Text style={styles.smsBtnText}>  Send via SMS</Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A237E' },
  sub: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#1A237E', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10,
  },
  newBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  center: { paddingVertical: 40, alignItems: 'center' },
  emptyBox: { paddingVertical: 60, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#999', marginTop: 6, textAlign: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  msgTo: { fontSize: 13, fontWeight: '700', color: '#1A237E' },
  msgContent: { fontSize: 12, color: '#666', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A237E' },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 6, marginTop: 8 },
  hint: { fontSize: 12, color: '#888', marginBottom: 10 },
  input: {
    backgroundColor: '#F5F7FA', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#1A1A2E', marginBottom: 8,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F5F7FA',
    borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8,
  },
  chipActive: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  noClassText: { fontSize: 13, color: '#999', fontStyle: 'italic', marginBottom: 10 },
  recipientBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EAF0FF', padding: 12, borderRadius: 10, marginBottom: 10,
  },
  recipientText: { fontSize: 13, fontWeight: '700', color: '#1A237E' },
  recipientSub: { fontSize: 11, color: '#666', marginTop: 2 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1A237E', borderRadius: 12,
    paddingVertical: 14, marginTop: 8,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  smsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EAF0FF', borderRadius: 12,
    paddingVertical: 14, marginTop: 10,
  },
  smsBtnText: { color: '#1A237E', fontWeight: '800', fontSize: 15 },
});