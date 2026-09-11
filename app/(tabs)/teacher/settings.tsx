// app/(tabs)/teacher/settings.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '../../../services/firebase';
import { signOut } from 'firebase/auth';
import {
  getCurrentUserProfile,
  updateUserProfile,
  sendPasswordReset,
  getAdminContact,
  UserProfile,
} from '../../../services/userService';
import { useTheme } from '../../../contexts/ThemeContext';

export default function SettingsScreen() {
  const { theme, darkMode, toggleDarkMode } = useTheme();
  const c = theme.colors;

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [admin, setAdmin] = useState<{
    fullName: string;
    email: string;
    phone: string;
  } | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const p = await getCurrentUserProfile(uid);
      setProfile(p);
      if (p) {
        setEditName(p.fullName);
        setEditPhone(p.phone || '');
      }
      const a = await getAdminContact();
      setAdmin(a);
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth);
          router.replace('/login' as any);
        },
      },
    ]);
  };

  const handleChangePassword = () => {
    if (!profile?.email) return;
    Alert.alert(
      'Change Password',
      `Send a reset link to:\n\n${profile.email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await sendPasswordReset(profile.email);
              Alert.alert('Success', 'Reset link sent.');
            } catch {
              Alert.alert('Error', 'Could not send reset email.');
            }
          },
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    try {
      setSaving(true);
      await updateUserProfile(auth.currentUser!.uid, {
        fullName: editName.trim(),
        phone: editPhone.trim(),
      });
      Alert.alert('Success', 'Profile updated.');
      setShowEditModal(false);
      const p = await getCurrentUserProfile(auth.currentUser!.uid);
      setProfile(p);
    } catch {
      Alert.alert('Error', 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleHelp = () => {
    if (!admin) {
      Alert.alert('Contact Admin', 'No admin contact available yet.');
      return;
    }
    Alert.alert(
      'Contact Administration',
      `Name: ${admin.fullName}\nEmail: ${admin.email}\nPhone: ${
        admin.phone || 'Not set'
      }`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => Linking.openURL(`mailto:${admin.email}`),
        },
        {
          text: 'Call',
          onPress: () =>
            admin.phone
              ? Linking.openURL(`tel:${admin.phone}`)
              : Alert.alert('No phone number on file.'),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: c.text }]}>Settings</Text>
        <Text style={[styles.sub, { color: c.textSecondary }]}>
          Manage your account and preferences
        </Text>

        {profile && (
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {profile.fullName.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: c.primary }]}>
          Preferences
        </Text>

        <View style={[styles.card, { backgroundColor: c.card }]}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={c.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                Get alerts on your device
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: c.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons name="mail-outline" size={20} color={c.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>
                Email Alerts
              </Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                Receive email updates
              </Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: '#E5E7EB', true: c.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons name="moon-outline" size={20} color={c.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>Dark Mode</Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                {darkMode ? 'Currently ON' : 'Currently OFF'}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E5E7EB', true: c.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: c.primary }]}>Account</Text>

        <View style={[styles.card, { backgroundColor: c.card }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setShowEditModal(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons name="person-outline" size={20} color={c.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>
                Edit Profile
              </Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                Update your name and phone
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: c.border }]} />

          <TouchableOpacity style={styles.row} onPress={handleChangePassword}>
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={c.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>
                Change Password
              </Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                Send reset link to your email
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: c.primary }]}>
          Support
        </Text>

        <View style={[styles.card, { backgroundColor: c.card }]}>
          <TouchableOpacity style={styles.row} onPress={handleHelp}>
            <View style={[styles.iconBox, { backgroundColor: c.primaryLight }]}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={c.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: c.text }]}>
                Help & Support
              </Text>
              <Text style={[styles.value, { color: c.textSecondary }]}>
                {admin
                  ? `Contact ${admin.fullName}`
                  : 'Contact school admin'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: c.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: c.text }]}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={c.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: c.text }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: c.input,
                  color: c.text,
                  borderColor: c.border,
                },
              ]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              placeholderTextColor="#999"
            />

            <Text style={[styles.modalLabel, { color: c.text }]}>Phone</Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: c.input,
                  color: c.text,
                  borderColor: c.border,
                },
              ]}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="+250 788 123 456"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '800', marginTop: 8 },
  sub: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B2A5B',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: { fontSize: 22, fontWeight: '800', color: '#1A237E' },
  profileName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  profileEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  card: { borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 14, fontWeight: '700' },
  value: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 62 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 24,
  },
  logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  saveBtn: {
    backgroundColor: '#1A237E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
});