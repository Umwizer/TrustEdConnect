import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import AdminHeader from '../../../../components/admin/AdminHeader';

type Student = {
  id: string;
  name: string;
  studentId: string;
  className: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  parent: string;
  parentPhone: string;
  email: string;
  address: string;
  status: string;
  admissionDate: string;
  bloodGroup: string;
};

const studentData: Student = {
  id: '1',
  name: 'Jean Claude Niyonzima',
  studentId: 'STU-001',
  className: 'Primary 6A',
  gender: 'Male',
  age: 12,
  dateOfBirth: '12 March 2014',
  parent: 'Jeanette Niyonzima',
  parentPhone: '+250 788 123 456',
  email: 'jeanette@example.com',
  address: 'Kigali, Rwanda',
  status: 'Active',
  admissionDate: '10 January 2021',
  bloodGroup: 'O+',
};

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log('Selected student:', id);

  const student = studentData;

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    console.log('Edit student:', student.id);
  };

  const handleMessageParent = () => {
    console.log('Message parent:', student.parent);
  };

  return (
    <View style={styles.screen}>
      <AdminHeader title="Student Details" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =========================
            TOP ACTION BAR
        ========================== */}

        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#061B5E"
            />

            <Text style={styles.backText}>
              Back to Students
            </Text>
          </Pressable>

          <Pressable
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.editButtonText}>
              Edit Student
            </Text>
          </Pressable>
        </View>

        {/* =========================
            PROFILE HEADER
        ========================== */}

        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>
                {student.name.charAt(0)}
              </Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.studentName}>
                {student.name}
              </Text>

              <Text style={styles.studentId}>
                Student ID: {student.studentId}
              </Text>

              <View style={styles.profileMeta}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="school-outline"
                    size={16}
                    color="#687080"
                  />

                  <Text style={styles.metaText}>
                    {student.className}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color="#687080"
                  />

                  <Text style={styles.metaText}>
                    {student.gender}
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#687080"
                  />

                  <Text style={styles.metaText}>
                    {student.age} years
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.profileRight}>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>
                {student.status}
              </Text>
            </View>
          </View>
        </View>

        {/* =========================
            PERSONAL INFORMATION
        ========================== */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="person-outline"
                size={21}
                color="#061B5E"
              />
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Personal Information
              </Text>

              <Text style={styles.sectionSubtitle}>
                Student's basic information
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <InfoItem
              label="Full Name"
              value={student.name}
            />

            <InfoItem
              label="Student ID"
              value={student.studentId}
            />

            <InfoItem
              label="Date of Birth"
              value={student.dateOfBirth}
            />

            <InfoItem
              label="Age"
              value={`${student.age} years`}
            />

            <InfoItem
              label="Gender"
              value={student.gender}
            />

            <InfoItem
              label="Blood Group"
              value={student.bloodGroup}
            />
          </View>
        </View>

        {/* =========================
            SCHOOL INFORMATION
        ========================== */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="school-outline"
                size={21}
                color="#061B5E"
              />
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                School Information
              </Text>

              <Text style={styles.sectionSubtitle}>
                Student's school details
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <InfoItem
              label="Class"
              value={student.className}
            />

            <InfoItem
              label="Admission Date"
              value={student.admissionDate}
            />

            <InfoItem
              label="Student Status"
              value={student.status}
            />

            <InfoItem
              label="Student ID"
              value={student.studentId}
            />
          </View>
        </View>

        {/* =========================
            PARENT INFORMATION
        ========================== */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="people-outline"
                  size={21}
                  color="#061B5E"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Parent / Guardian
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Primary contact information
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.messageButton}
              onPress={handleMessageParent}
            >
              <Ionicons
                name="chatbubble-outline"
                size={17}
                color="#061B5E"
              />

              <Text style={styles.messageButtonText}>
                Message
              </Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.parentProfile}>
            <View style={styles.parentAvatar}>
              <Text style={styles.parentAvatarText}>
                {student.parent.charAt(0)}
              </Text>
            </View>

            <View style={styles.parentMain}>
              <Text style={styles.parentName}>
                {student.parent}
              </Text>

              <Text style={styles.parentRelation}>
                Parent / Guardian
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem
              label="Phone Number"
              value={student.parentPhone}
            />

            <InfoItem
              label="Email Address"
              value={student.email}
            />

            <InfoItem
              label="Address"
              value={student.address}
            />
          </View>
        </View>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="flash-outline"
                size={21}
                color="#061B5E"
              />
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Quick Actions
              </Text>

              <Text style={styles.sectionSubtitle}>
                Manage this student's records
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.actionsRow}>
            <ActionButton
              icon="calendar-outline"
              title="Attendance"
              onPress={() =>
                console.log('Attendance')
              }
            />

            <ActionButton
              icon="bar-chart-outline"
              title="Academic Records"
              onPress={() =>
                console.log('Academic records')
              }
            />

            <ActionButton
              icon="chatbubble-outline"
              title="Messages"
              onPress={handleMessageParent}
            />

            <ActionButton
              icon="document-text-outline"
              title="Documents"
              onPress={() =>
                console.log('Documents')
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* =====================================================
   INFORMATION ITEM
===================================================== */

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

/* =====================================================
   ACTION BUTTON
===================================================== */

type ActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
};

function ActionButton({
  icon,
  title,
  onPress,
}: ActionButtonProps) {
  return (
    <Pressable
      style={styles.actionButton}
      onPress={onPress}
    >
      <View style={styles.actionIcon}>
        <Ionicons
          name={icon}
          size={22}
          color="#061B5E"
        />
      </View>

      <Text style={styles.actionTitle}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={17}
        color="#9AA0AC"
      />
    </Pressable>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  /* TOP BAR */

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  backButton: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EC',
    flexDirection: 'row',
    alignItems: 'center',
  },

  backText: {
    color: '#061B5E',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 7,
  },

  editButton: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#061B5E',
    flexDirection: 'row',
    alignItems: 'center',
  },

  editButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 7,
  },

  /* PROFILE */

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  largeAvatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },

  largeAvatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#061B5E',
  },

  profileInfo: {
    flex: 1,
  },

  studentName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#172033',
  },

  studentId: {
    fontSize: 12,
    color: '#858B98',
    marginTop: 5,
  },

  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    gap: 18,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    color: '#687080',
    fontSize: 12,
    marginLeft: 5,
  },

  profileRight: {
    alignSelf: 'flex-start',
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF8F0',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#21A366',
    marginRight: 6,
  },

  activeText: {
    color: '#21884F',
    fontSize: 11,
    fontWeight: '700',
  },

  /* SECTION */

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    padding: 20,
    marginBottom: 18,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#172033',
  },

  sectionSubtitle: {
    fontSize: 11,
    color: '#8A909D',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0F4',
    marginVertical: 18,
  },

  /* INFORMATION GRID */

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 20,
  },

  infoItem: {
    width: '33.33%',
    paddingRight: 15,
  },

  infoLabel: {
    fontSize: 10,
    color: '#969CA8',
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 13,
    color: '#303747',
    fontWeight: '600',
  },

  /* PARENT */

  parentProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  parentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF1DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  parentAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D77B00',
  },

  parentMain: {
    flex: 1,
  },

  parentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#242C3C',
  },

  parentRelation: {
    fontSize: 11,
    color: '#8A909D',
    marginTop: 3,
  },

  messageButton: {
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 9,
    backgroundColor: '#EAF0FF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  messageButtonText: {
    color: '#061B5E',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },

  /* QUICK ACTIONS */

  actionsRow: {
    gap: 10,
  },

  actionButton: {
    minHeight: 62,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E5E8EE',
    backgroundColor: '#FAFBFD',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  actionTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#303747',
  },
});