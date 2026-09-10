import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  collection,
  onSnapshot,
} from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AdminHeader from '../../../components/admin/AdminHeader';
import { db } from '../../../services/firebase';

type DashboardEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  createdAt: any;
};

export default function AdminDashboard() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [classesCount, setClassesCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);

  const [upcomingEvents, setUpcomingEvents] = useState<
    DashboardEvent[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // ============================
    // STUDENTS
    // ============================

    const unsubscribeStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        setStudentsCount(snapshot.size);
      },
      (error) => {
        console.error(
          'Students dashboard error:',
          error
        );

        setError(
          'Some dashboard data could not be loaded.'
        );
      }
    );

    // ============================
    // TEACHERS
    // ============================

    const unsubscribeTeachers = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        setTeachersCount(snapshot.size);
      },
      (error) => {
        console.error(
          'Teachers dashboard error:',
          error
        );

        setError(
          'Some dashboard data could not be loaded.'
        );
      }
    );

    // ============================
    // CLASSES
    // ============================

    const unsubscribeClasses = onSnapshot(
      collection(db, 'classes'),
      (snapshot) => {
        setClassesCount(snapshot.size);
      },
      (error) => {
        console.error(
          'Classes dashboard error:',
          error
        );

        setError(
          'Some dashboard data could not be loaded.'
        );
      }
    );

    // ============================
    // EVENTS
    // ============================

    const unsubscribeEvents = onSnapshot(
      collection(db, 'events'),
      (snapshot) => {
        setEventsCount(snapshot.size);

        const eventData: DashboardEvent[] =
          snapshot.docs.map((eventDoc) => {
            const data = eventDoc.data();

            return {
              id: eventDoc.id,
              title: data.title || '',
              date: data.date || '',
              time: data.time || '',
              location: data.location || '',
              type: data.type || '',
              status: data.status || 'upcoming',
              createdAt: data.createdAt || null,
            };
          });

        // Sort newest first without requiring a Firestore index.
        eventData.sort((a, b) => {
          const aTime =
            a.createdAt?.toMillis?.() || 0;

          const bTime =
            b.createdAt?.toMillis?.() || 0;

          return bTime - aTime;
        });

        const upcoming = eventData.filter(
          (event) =>
            event.status.toLowerCase() ===
            'upcoming'
        );

        setUpcomingEvents(
          upcoming.slice(0, 5)
        );
      },
      (error) => {
        console.error(
          'Events dashboard error:',
          error
        );

        setError(
          'Some dashboard data could not be loaded.'
        );
      }
    );

    setLoading(false);

    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
      unsubscribeClasses();
      unsubscribeEvents();
    };
  }, []);

  // ============================
  // NAVIGATION
  // ============================

  const goToStudents = () => {
    router.push('/admin/students' as any);
  };

  const goToTeachers = () => {
    router.push('/admin/teachers' as any);
  };

  const goToClasses = () => {
    router.push('/admin/classes' as any);
  };

  const goToEvents = () => {
    router.push('/admin/events' as any);
  };

  const goToNewEvent = () => {
    router.push('/admin/events/new' as any);
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#061B5E"
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <AdminHeader title="Dashboard" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ============================
            WELCOME
        ============================ */}

        <View style={styles.welcomeSection}>

          <View style={styles.welcomeTextContainer}>

            <Text style={styles.welcomeTitle}>
              Admin Dashboard
            </Text>

            <Text style={styles.welcomeSubtitle}>
              Overview of your school activities.
            </Text>

          </View>

          <Pressable
            style={styles.addEventButton}
            onPress={goToNewEvent}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addEventText}>
              New Event
            </Text>
          </Pressable>

        </View>

        {/* ============================
            ERROR
        ============================ */}

        {error ? (
          <View style={styles.errorBanner}>

            <Ionicons
              name="warning-outline"
              size={20}
              color="#C62828"
            />

            <Text style={styles.errorBannerText}>
              {error}
            </Text>

          </View>
        ) : null}

        {/* ============================
            STATISTICS
        ============================ */}

        <View style={styles.statsGrid}>

          <Pressable
            style={styles.statCard}
            onPress={goToStudents}
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="people-outline"
                size={25}
                color="#061B5E"
              />
            </View>

            <Text style={styles.statNumber}>
              {studentsCount}
            </Text>

            <Text style={styles.statLabel}>
              Students
            </Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={goToTeachers}
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="school-outline"
                size={25}
                color="#061B5E"
              />
            </View>

            <Text style={styles.statNumber}>
              {teachersCount}
            </Text>

            <Text style={styles.statLabel}>
              Teachers
            </Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={goToClasses}
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="book-outline"
                size={25}
                color="#061B5E"
              />
            </View>

            <Text style={styles.statNumber}>
              {classesCount}
            </Text>

            <Text style={styles.statLabel}>
              Classes
            </Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={goToEvents}
          >
            <View style={styles.statIcon}>
              <Ionicons
                name="calendar-outline"
                size={25}
                color="#061B5E"
              />
            </View>

            <Text style={styles.statNumber}>
              {eventsCount}
            </Text>

            <Text style={styles.statLabel}>
              Events
            </Text>
          </Pressable>

        </View>

        {/* ============================
            QUICK ACTIONS
        ============================ */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Quick Actions
          </Text>

        </View>

        <View style={styles.quickActions}>

          <Pressable
            style={styles.quickAction}
            onPress={goToStudents}
          >
            <Ionicons
              name="people-outline"
              size={24}
              color="#061B5E"
            />

            <Text style={styles.quickActionText}>
              Students
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={goToTeachers}
          >
            <Ionicons
              name="school-outline"
              size={24}
              color="#061B5E"
            />

            <Text style={styles.quickActionText}>
              Teachers
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={goToClasses}
          >
            <Ionicons
              name="book-outline"
              size={24}
              color="#061B5E"
            />

            <Text style={styles.quickActionText}>
              Classes
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={goToNewEvent}
          >
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#061B5E"
            />

            <Text style={styles.quickActionText}>
              New Event
            </Text>
          </Pressable>

        </View>

        {/* ============================
            UPCOMING EVENTS
        ============================ */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Upcoming Events
          </Text>

          <Pressable onPress={goToEvents}>
            <Text style={styles.viewAll}>
              View all
            </Text>
          </Pressable>

        </View>

        {upcomingEvents.length === 0 ? (

          <View style={styles.emptyEvents}>

            <Ionicons
              name="calendar-outline"
              size={45}
              color="#B7BFCD"
            />

            <Text style={styles.emptyTitle}>
              No upcoming events
            </Text>

            <Text style={styles.emptyText}>
              Create an event to see it here.
            </Text>

            <Pressable
              style={styles.createEventButton}
              onPress={goToNewEvent}
            >
              <Text
                style={styles.createEventButtonText}
              >
                Create Event
              </Text>
            </Pressable>

          </View>

        ) : (

          <View>
            {upcomingEvents.map((event) => (
              <Pressable
                key={event.id}
                style={styles.eventCard}
                onPress={goToEvents}
              >

                <View style={styles.eventIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={23}
                    color="#061B5E"
                  />
                </View>

                <View style={styles.eventInfo}>

                  <Text
                    style={styles.eventTitle}
                    numberOfLines={1}
                  >
                    {event.title ||
                      'Untitled Event'}
                  </Text>

                  <Text style={styles.eventDate}>
                    {event.date ||
                      'Date not set'}

                    {event.time
                      ? ` • ${event.time}`
                      : ''}
                  </Text>

                  {event.location ? (
                    <Text
                      style={styles.eventLocation}
                      numberOfLines={1}
                    >
                      {event.location}
                    </Text>
                  ) : null}

                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9AA3B2"
                />

              </Pressable>
            ))}
          </View>

        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FB',
  },

  loadingText: {
    marginTop: 12,
    color: '#7A8497',
    fontSize: 14,
  },

  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },

  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  welcomeTextContainer: {
    flex: 1,
    marginRight: 15,
  },

  welcomeTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#061B5E',
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: '#7A8497',
    marginTop: 5,
  },

  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#061B5E',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
    gap: 6,
  },

  addEventText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F5C2C2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },

  errorBannerText: {
    flex: 1,
    color: '#C62828',
    fontSize: 13,
    marginLeft: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  statNumber: {
    fontSize: 27,
    fontWeight: '700',
    color: '#061B5E',
  },

  statLabel: {
    fontSize: 13,
    color: '#7A8497',
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#172033',
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#061B5E',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  quickAction: {
    width: '48%',
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EBF2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickActionText: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: '600',
    color: '#172033',
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  eventInfo: {
    flex: 1,
    marginRight: 10,
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
  },

  eventDate: {
    fontSize: 12,
    color: '#667085',
    marginTop: 5,
  },

  eventLocation: {
    fontSize: 11,
    color: '#8A94A6',
    marginTop: 3,
  },

  emptyEvents: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8EBF2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172033',
    marginTop: 10,
  },

  emptyText: {
    fontSize: 13,
    color: '#7A8497',
    textAlign: 'center',
    marginTop: 5,
  },

  createEventButton: {
    backgroundColor: '#061B5E',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 15,
  },

  createEventButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});