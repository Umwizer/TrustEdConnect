import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================================
            TOP HEADER
        ================================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>
              Dashboard
            </Text>

            <Text style={styles.pageSubtitle}>
              Welcome back, Administrator
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Notification */}
            <Pressable style={styles.headerIconButton}>
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#061B5E"
              />

              <View style={styles.notificationDot} />
            </Pressable>

            {/* Admin profile */}
            <Pressable style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Ionicons
                  name="person"
                  size={20}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={styles.profileName}>
                  Administrator
                </Text>

                <Text style={styles.profileRole}>
                  Admin
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={17}
                color="#777777"
              />
            </Pressable>
          </View>
        </View>

        {/* ================================
            WELCOME CARD
        ================================= */}

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>
              Welcome to your Administration
            </Text>

            <Text style={styles.welcomeDescription}>
              Manage students, teachers, classes and
              school activities from one place.
            </Text>

            <Pressable style={styles.viewButton}>
              <Text style={styles.viewButtonText}>
                View school overview
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          <View style={styles.welcomeIcon}>
            <Ionicons
              name="school-outline"
              size={82}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* ================================
            STATISTICS
        ================================= */}

        <Text style={styles.sectionTitle}>
          School Overview
        </Text>

        <View style={styles.statsGrid}>

          {/* Students */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.studentsIcon,
              ]}
            >
              <Ionicons
                name="people-outline"
                size={25}
                color="#1555E8"
              />
            </View>

            <Text style={styles.statNumber}>
              1,023
            </Text>

            <Text style={styles.statLabel}>
              Students
            </Text>

            <View style={styles.statFooter}>
              <Ionicons
                name="trending-up"
                size={15}
                color="#21A366"
              />

              <Text style={styles.growthText}>
                +8.2% this month
              </Text>
            </View>
          </View>

          {/* Teachers */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.teachersIcon,
              ]}
            >
              <Ionicons
                name="school-outline"
                size={25}
                color="#7B42F6"
              />
            </View>

            <Text style={styles.statNumber}>
              48
            </Text>

            <Text style={styles.statLabel}>
              Teachers
            </Text>

            <View style={styles.statFooter}>
              <Ionicons
                name="trending-up"
                size={15}
                color="#21A366"
              />

              <Text style={styles.growthText}>
                +3 this month
              </Text>
            </View>
          </View>

          {/* Parents */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.parentsIcon,
              ]}
            >
              <Ionicons
                name="people-circle-outline"
                size={25}
                color="#F39C12"
              />
            </View>

            <Text style={styles.statNumber}>
              890
            </Text>

            <Text style={styles.statLabel}>
              Parents
            </Text>

            <View style={styles.statFooter}>
              <Ionicons
                name="trending-up"
                size={15}
                color="#21A366"
              />

              <Text style={styles.growthText}>
                +5.4% this month
              </Text>
            </View>
          </View>

          {/* Classes */}

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.classesIcon,
              ]}
            >
              <Ionicons
                name="library-outline"
                size={25}
                color="#E84D8A"
              />
            </View>

            <Text style={styles.statNumber}>
              32
            </Text>

            <Text style={styles.statLabel}>
              Classes
            </Text>

            <View style={styles.statFooter}>
              <Ionicons
                name="remove-outline"
                size={15}
                color="#777777"
              />

              <Text style={styles.neutralText}>
                No changes
              </Text>
            </View>
          </View>
        </View>

        {/* ================================
            LOWER SECTION
        ================================= */}

        <View style={styles.bottomSection}>

          {/* Recent Activity */}

          <View style={styles.activityContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Recent Activity
              </Text>

              <Pressable>
                <Text style={styles.seeAll}>
                  See all
                </Text>
              </Pressable>
            </View>

            {/* Activity 1 */}

            <View style={styles.activityCard}>
              <View
                style={[
                  styles.activityIcon,
                  styles.blueActivity,
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color="#1555E8"
                />
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  New student registered
                </Text>

                <Text style={styles.activityDescription}>
                  A new student was added to Primary 5A.
                </Text>

                <Text style={styles.activityTime}>
                  10 minutes ago
                </Text>
              </View>
            </View>

            {/* Activity 2 */}

            <View style={styles.activityCard}>
              <View
                style={[
                  styles.activityIcon,
                  styles.purpleActivity,
                ]}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color="#7B42F6"
                />
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Teacher added
                </Text>

                <Text style={styles.activityDescription}>
                  A new teacher joined the school.
                </Text>

                <Text style={styles.activityTime}>
                  1 hour ago
                </Text>
              </View>
            </View>

            {/* Activity 3 */}

            <View style={styles.activityCard}>
              <View
                style={[
                  styles.activityIcon,
                  styles.orangeActivity,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#F39C12"
                />
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  New event created
                </Text>

                <Text style={styles.activityDescription}>
                  School meeting scheduled for Friday.
                </Text>

                <Text style={styles.activityTime}>
                  3 hours ago
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}

          <View style={styles.quickContainer}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <Pressable style={styles.quickAction}>
              <View
                style={[
                  styles.quickIcon,
                  styles.quickBlue,
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={22}
                  color="#1555E8"
                />
              </View>

              <View style={styles.quickTextContainer}>
                <Text style={styles.quickTitle}>
                  Add Student
                </Text>

                <Text style={styles.quickSubtitle}>
                  Register a new student
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999999"
              />
            </Pressable>

            <Pressable style={styles.quickAction}>
              <View
                style={[
                  styles.quickIcon,
                  styles.quickPurple,
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={22}
                  color="#7B42F6"
                />
              </View>

              <View style={styles.quickTextContainer}>
                <Text style={styles.quickTitle}>
                  Add Teacher
                </Text>

                <Text style={styles.quickSubtitle}>
                  Add a school teacher
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999999"
              />
            </Pressable>

            <Pressable style={styles.quickAction}>
              <View
                style={[
                  styles.quickIcon,
                  styles.quickOrange,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color="#F39C12"
                />
              </View>

              <View style={styles.quickTextContainer}>
                <Text style={styles.quickTitle}>
                  Create Event
                </Text>

                <Text style={styles.quickSubtitle}>
                  Schedule a school event
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999999"
              />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  /* Header */

  header: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#061B5E',
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777777',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
    top: 9,
    right: 9,
  },

  profileButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1555E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
  },

  profileRole: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },

  /* Welcome */

  welcomeCard: {
    minHeight: 190,
    borderRadius: 24,
    backgroundColor: '#061B5E',
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 30,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
  },

  welcomeDescription: {
    color: '#DCE5FF',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 550,
  },

  viewButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    backgroundColor: '#1555E8',
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  welcomeIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 25,
  },

  /* Section */

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#061B5E',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  seeAll: {
    color: '#1555E8',
    fontSize: 13,
    fontWeight: '700',
  },

  /* Statistics */

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    minWidth: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 165,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  studentsIcon: {
    backgroundColor: '#E9F0FF',
  },

  teachersIcon: {
    backgroundColor: '#F0E9FF',
  },

  parentsIcon: {
    backgroundColor: '#FFF3DF',
  },

  classesIcon: {
    backgroundColor: '#FFE8F0',
  },

  statNumber: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1D1D1D',
  },

  statLabel: {
    color: '#777777',
    fontSize: 13,
    marginTop: 2,
  },

  statFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 5,
  },

  growthText: {
    color: '#21A366',
    fontSize: 11,
    fontWeight: '600',
  },

  neutralText: {
    color: '#888888',
    fontSize: 11,
  },

  /* Bottom */

  bottomSection: {
    flexDirection: 'row',
    gap: 20,
  },

  activityContainer: {
    flex: 1.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  blueActivity: {
    backgroundColor: '#E9F0FF',
  },

  purpleActivity: {
    backgroundColor: '#F0E9FF',
  },

  orangeActivity: {
    backgroundColor: '#FFF3DF',
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '700',
  },

  activityDescription: {
    color: '#777777',
    fontSize: 11,
    marginTop: 3,
  },

  activityTime: {
    color: '#AAAAAA',
    fontSize: 10,
    marginTop: 5,
  },

  /* Quick actions */

  quickContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  quickAction: {
    minHeight: 72,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  quickBlue: {
    backgroundColor: '#E9F0FF',
  },

  quickPurple: {
    backgroundColor: '#F0E9FF',
  },

  quickOrange: {
    backgroundColor: '#FFF3DF',
  },

  quickTextContainer: {
    flex: 1,
  },

  quickTitle: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '700',
  },

  quickSubtitle: {
    color: '#888888',
    fontSize: 10,
    marginTop: 3,
  },
});