// app/(tabs)/profile.tsx - Profile & Settings with Logout
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Teacher data - Replace with actual data from backend
  const teacher = {
    name: 'Alice Uwase',
    teacherId: 'TCH-2024-001',
    subject: 'Computer Science',
    email: 'alice.uwase@school.rw',
    phone: '+250 788 123 456',
    classes: ['Class 5A', 'Class 5B', 'Class 6A'],
    initials: 'AU',
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileImageText}>{teacher.initials}</Text>
          </View>
          <Text style={styles.profileName}>{teacher.name}</Text>
          <Text style={styles.profileSubject}>{teacher.subject}</Text>
          <View style={styles.profileBadges}>
            <View style={styles.profileBadge}>
              <Ionicons name="id-card-outline" size={14} color="#1A237E" />
              <Text style={styles.profileBadgeText}>{teacher.teacherId}</Text>
            </View>
          </View>
        </View>

        {/* My Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Information</Text>
          <View style={styles.sectionCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{teacher.name}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="id-card-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teacher ID</Text>
                <Text style={styles.infoValue}>{teacher.teacherId}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="book-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Subject</Text>
                <Text style={styles.infoValue}>{teacher.subject}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="people-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Classes</Text>
                <Text style={styles.infoValue}>{teacher.classes.join(', ')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Email</Text>
                <Text style={styles.menuValue}>{teacher.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Phone</Text>
                <Text style={styles.menuValue}>{teacher.phone}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Change Password</Text>
                <Text style={styles.menuValue}>Update your password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.sectionCard}>
            <View style={styles.menuRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="notifications-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Notifications</Text>
                <Text style={styles.menuValue}>Enable push notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E8E8E8', true: '#1A237E' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.infoDivider} />
            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="language-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Language</Text>
                <Text style={styles.menuValue}>English</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
            <View style={styles.infoDivider} />
            <View style={styles.menuRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="moon-outline" size={20} color="#1A237E" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.menuLabel}>Dark Mode</Text>
                <Text style={styles.menuValue}>Use dark theme</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#E8E8E8', true: '#1A237E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Security - Logout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.logoutRow}
              activeOpacity={0.7}
              onPress={() => setShowLogoutModal(true)}
            >
              <View style={[styles.infoIconContainer, { backgroundColor: '#F4433615' }]}>
                <Ionicons name="log-out-outline" size={20} color="#F44336" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.menuLabel, { color: '#F44336' }]}>Logout</Text>
                <Text style={styles.menuValue}>Sign out of your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TrustEdConnect v1.0.0</Text>
          <Text style={styles.versionSubtext}>Teacher Portal</Text>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={48} color="#F44336" />
            </View>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout from TrustEdConnect?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalLogoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.modalLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  profileSubject: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileBadges: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  profileBadgeText: {
    fontSize: 12,
    color: '#1A237E',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF615',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginTop: 2,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  menuValue: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 12,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4433615',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalLogoutButton: {
    backgroundColor: '#F44336',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  modalLogoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});