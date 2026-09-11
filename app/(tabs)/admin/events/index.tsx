import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AdminHeader from '../../../../components/admin/AdminHeader';
import { db } from '../../../../services/firebase';

type SchoolEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  createdAt: any;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('All');

  /*
   * Load events from Firestore
   */
  useEffect(() => {
    setLoading(true);
    setError('');

    const eventsRef = collection(db, 'events');

    const eventsQuery = query(
      eventsRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const eventData: SchoolEvent[] =
          snapshot.docs.map((eventDoc) => {
            const data = eventDoc.data();

            return {
              id: eventDoc.id,
              title: data.title || '',
              description: data.description || '',
              date: data.date || '',
              time: data.time || '',
              location: data.location || '',
              type: data.type || '',
              status: data.status || 'upcoming',
              createdAt: data.createdAt || null,
            };
          });

        setEvents(eventData);
        setLoading(false);
      },
      (listenerError) => {
        console.error(
          'Error loading events:',
          listenerError
        );

        setError(
          'Unable to load events from the database.'
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * Event types from actual database records
   */
  const eventTypes = useMemo(() => {
    const values = events
      .map((event) => event.type)
      .filter(Boolean);

    return [
      'All',
      ...Array.from(new Set(values)),
    ];
  }, [events]);

  /*
   * Search and filter
   */
  const filteredEvents = useMemo(() => {
    const cleanSearch =
      search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !cleanSearch ||
        event.title
          .toLowerCase()
          .includes(cleanSearch) ||
        event.description
          .toLowerCase()
          .includes(cleanSearch) ||
        event.location
          .toLowerCase()
          .includes(cleanSearch) ||
        event.type
          .toLowerCase()
          .includes(cleanSearch);

      const matchesType =
        eventType === 'All' ||
        event.type === eventType;

      return matchesSearch && matchesType;
    });
  }, [events, search, eventType]);

  /*
   * Statistics
   */
  const upcomingEvents = events.filter(
    (event) =>
      event.status.toLowerCase() === 'upcoming'
  ).length;

  const completedEvents = events.filter(
    (event) =>
      event.status.toLowerCase() === 'completed'
  ).length;

  const cancelledEvents = events.filter(
    (event) =>
      event.status.toLowerCase() === 'cancelled'
  ).length;

  /*
   * Navigate to New Event
   */
  const goToNewEvent = () => {
    router.push('/admin/events/new' as any);
  };

  /*
   * Render event
   */
  const renderEvent = ({
    item,
  }: {
    item: SchoolEvent;
  }) => {
    const status =
      item.status.toLowerCase();

    return (
      <Pressable style={styles.eventCard}>

        <View style={styles.dateBox}>
          <Ionicons
            name="calendar-outline"
            size={25}
            color="#061B5E"
          />

          {item.date ? (
            <Text
              style={styles.dateText}
              numberOfLines={2}
            >
              {item.date}
            </Text>
          ) : null}
        </View>

        <View style={styles.eventInfo}>
          <Text
            style={styles.eventTitle}
            numberOfLines={1}
          >
            {item.title || 'Untitled Event'}
          </Text>

          {item.type ? (
            <Text style={styles.eventType}>
              {item.type}
            </Text>
          ) : null}

          {item.description ? (
            <Text
              style={styles.description}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>

            {item.time ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color="#7A8497"
                />

                <Text style={styles.metaText}>
                  {item.time}
                </Text>
              </View>
            ) : null}

            {item.location ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color="#7A8497"
                />

                <Text
                  style={styles.metaText}
                  numberOfLines={1}
                >
                  {item.location}
                </Text>
              </View>
            ) : null}

          </View>
        </View>

        <View style={styles.rightSide}>

          <View
            style={[
              styles.statusBadge,
              status === 'upcoming'
                ? styles.upcomingBadge
                : status === 'completed'
                ? styles.completedBadge
                : styles.cancelledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                status === 'upcoming'
                  ? styles.upcomingText
                  : status === 'completed'
                  ? styles.completedText
                  : styles.cancelledText,
              ]}
            >
              {item.status || 'Unknown'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9AA3B2"
          />

        </View>

      </Pressable>
    );
  };

  return (
    <View style={styles.container}>

      <AdminHeader title="Events" />

      <View style={styles.content}>

        {/* Page heading */}
        <View style={styles.topSection}>

          <View style={styles.headingContainer}>

            <Text style={styles.pageTitle}>
              Events
            </Text>

            <Text style={styles.pageSubtitle}>
              Manage school events and activities.
            </Text>

          </View>

          <Pressable
            style={styles.addButton}
            onPress={goToNewEvent}
          >
            <Ionicons
              name="add"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              New Event
            </Text>
          </Pressable>

        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {events.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Events
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {upcomingEvents}
            </Text>

            <Text style={styles.statLabel}>
              Upcoming
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {completedEvents}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {cancelledEvents}
            </Text>

            <Text style={styles.statLabel}>
              Cancelled
            </Text>
          </View>

        </View>

        {/* Search */}
        <View style={styles.searchContainer}>

          <Ionicons
            name="search-outline"
            size={21}
            color="#8A94A6"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search events..."
            placeholderTextColor="#9AA3B2"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#9AA3B2"
              />
            </Pressable>
          )}

        </View>

        {/* Event type filters */}
        {eventTypes.length > 1 && (
          <View style={styles.filterWrapper}>

            <FlatList
              horizontal
              data={eventTypes}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.filterContent
              }
              renderItem={({ item }) => {
                const selected =
                  eventType === item;

                return (
                  <Pressable
                    style={[
                      styles.filterButton,
                      selected &&
                        styles.selectedFilter,
                    ]}
                    onPress={() =>
                      setEventType(item)
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected &&
                          styles.selectedFilterText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />

          </View>
        )}

        {/* List header */}
        <View style={styles.listHeader}>

          <Text style={styles.listTitle}>
            Event List
          </Text>

          <Text style={styles.resultCount}>
            {filteredEvents.length}{' '}
            {filteredEvents.length === 1
              ? 'event'
              : 'events'}
          </Text>

        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.center}>

            <ActivityIndicator
              size="large"
              color="#061B5E"
            />

            <Text style={styles.loadingText}>
              Loading events...
            </Text>

          </View>

        ) : error ? (

          <View style={styles.center}>

            <Ionicons
              name="alert-circle-outline"
              size={45}
              color="#D93025"
            />

            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

          </View>

        ) : filteredEvents.length === 0 ? (

          <View style={styles.center}>

            <Ionicons
              name="calendar-outline"
              size={55}
              color="#B7BFCD"
            />

            <Text style={styles.emptyTitle}>
              No events found
            </Text>

            <Text style={styles.emptyText}>
              {events.length === 0
                ? 'There are no events saved in the database yet.'
                : 'No events match your search or filter.'}
            </Text>

            {events.length === 0 && (
              <Pressable
                style={styles.emptyButton}
                onPress={goToNewEvent}
              >
                <Text style={styles.emptyButtonText}>
                  Create First Event
                </Text>
              </Pressable>
            )}

          </View>

        ) : (

          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.eventList
            }
          />

        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  content: {
    flex: 1,
    padding: 24,
  },

  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  headingContainer: {
    flex: 1,
    marginRight: 15,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#061B5E',
  },

  pageSubtitle: {
    fontSize: 14,
    color: '#7A8497',
    marginTop: 5,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#061B5E',
    paddingHorizontal: 18,
    height: 46,
    borderRadius: 10,
    gap: 7,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#061B5E',
  },

  statLabel: {
    fontSize: 13,
    color: '#7A8497',
    marginTop: 5,
  },

  searchContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#E3E7EF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    color: '#172033',
  },

  filterWrapper: {
    marginBottom: 18,
  },

  filterContent: {
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E5ED',
  },

  selectedFilter: {
    backgroundColor: '#061B5E',
    borderColor: '#061B5E',
  },

  filterText: {
    fontSize: 13,
    color: '#667085',
    fontWeight: '500',
  },

  selectedFilterText: {
    color: '#FFFFFF',
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
  },

  resultCount: {
    fontSize: 13,
    color: '#7A8497',
  },

  eventList: {
    paddingBottom: 30,
  },

  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  dateBox: {
    width: 65,
    minHeight: 65,
    borderRadius: 12,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    padding: 7,
  },

  dateText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#061B5E',
    textAlign: 'center',
    marginTop: 4,
  },

  eventInfo: {
    flex: 1,
    marginRight: 10,
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },

  eventType: {
    fontSize: 12,
    color: '#061B5E',
    fontWeight: '600',
    marginTop: 4,
  },

  description: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
    lineHeight: 18,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 7,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '48%',
  },

  metaText: {
    fontSize: 11,
    color: '#7A8497',
    marginLeft: 4,
  },

  rightSide: {
    alignItems: 'flex-end',
    gap: 8,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  upcomingBadge: {
    backgroundColor: '#EAF0FF',
  },

  completedBadge: {
    backgroundColor: '#E7F7ED',
  },

  cancelledBadge: {
    backgroundColor: '#FDECEC',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  upcomingText: {
    color: '#2454A6',
  },

  completedText: {
    color: '#258443',
  },

  cancelledText: {
    color: '#C62828',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: '#7A8497',
    fontSize: 14,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginTop: 12,
  },

  errorText: {
    textAlign: 'center',
    color: '#7A8497',
    fontSize: 14,
    marginTop: 6,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginTop: 12,
  },

  emptyText: {
    fontSize: 14,
    color: '#7A8497',
    textAlign: 'center',
    marginTop: 7,
    lineHeight: 21,
  },

  emptyButton: {
    marginTop: 18,
    backgroundColor: '#061B5E',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});