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

import AdminHeader from '../../../../components/admin/AdminHeader';
import { db } from '../../../../services/firebase';

type SchoolClass = {
  id: string;
  className: string;
  classCode: string;
  level: string;
  stream: string;
  teacherName: string;
  teacherId: string;
  room: string;
  status: string;
  createdAt: any;
};

export default function ClassesScreen() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');

  /*
   * Load classes from Firestore
   */
  useEffect(() => {
    setLoading(true);
    setError('');

    const classesRef = collection(db, 'classes');

    const classesQuery = query(
      classesRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      classesQuery,
      (snapshot) => {
        const classData: SchoolClass[] = snapshot.docs.map(
          (classDoc) => {
            const data = classDoc.data();

            return {
              id: classDoc.id,
              className: data.className || '',
              classCode: data.classCode || '',
              level: data.level || '',
              stream: data.stream || '',
              teacherName: data.teacherName || '',
              teacherId: data.teacherId || '',
              room: data.room || '',
              status: data.status || 'active',
              createdAt: data.createdAt || null,
            };
          }
        );

        setClasses(classData);
        setLoading(false);
      },
      (listenerError) => {
        console.error(
          'Error loading classes:',
          listenerError
        );

        setError(
          'Unable to load classes from the database.'
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * Get levels from actual Firestore data
   */
  const levels = useMemo(() => {
    const values = classes
      .map((item) => item.level)
      .filter(Boolean);

    return [
      'All',
      ...Array.from(new Set(values)),
    ];
  }, [classes]);

  /*
   * Search and filter classes
   */
  const filteredClasses = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return classes.filter((item) => {
      const matchesSearch =
        !cleanSearch ||
        item.className
          .toLowerCase()
          .includes(cleanSearch) ||
        item.classCode
          .toLowerCase()
          .includes(cleanSearch) ||
        item.level
          .toLowerCase()
          .includes(cleanSearch) ||
        item.stream
          .toLowerCase()
          .includes(cleanSearch) ||
        item.teacherName
          .toLowerCase()
          .includes(cleanSearch) ||
        item.room
          .toLowerCase()
          .includes(cleanSearch);

      const matchesLevel =
        level === 'All' ||
        item.level === level;

      return matchesSearch && matchesLevel;
    });
  }, [classes, search, level]);

  /*
   * Statistics
   */
  const activeClasses = classes.filter(
    (item) =>
      item.status.toLowerCase() === 'active'
  ).length;

  const inactiveClasses = classes.filter(
    (item) =>
      item.status.toLowerCase() === 'inactive'
  ).length;

  const levelsCount = new Set(
    classes
      .map((item) => item.level)
      .filter(Boolean)
  ).size;

  /*
   * Render one class
   */
  const renderClass = ({
    item,
  }: {
    item: SchoolClass;
  }) => {
    const isActive =
      item.status.toLowerCase() === 'active';

    return (
      <Pressable style={styles.classCard}>

        {/* Class icon */}
        <View style={styles.classIcon}>
          <Ionicons
            name="school-outline"
            size={25}
            color="#061B5E"
          />
        </View>

        {/* Class information */}
        <View style={styles.classInfo}>

          <Text
            style={styles.className}
            numberOfLines={1}
          >
            {item.className || 'Unnamed Class'}
          </Text>

          <Text style={styles.classCode}>
            {item.classCode || 'No class code'}
          </Text>

          <View style={styles.detailsRow}>

            {item.level ? (
              <Text style={styles.detailText}>
                {item.level}
              </Text>
            ) : null}

            {item.stream ? (
              <Text style={styles.detailText}>
                • Stream {item.stream}
              </Text>
            ) : null}

          </View>

          {item.teacherName ? (
            <Text
              style={styles.teacherText}
              numberOfLines={1}
            >
              Teacher: {item.teacherName}
            </Text>
          ) : null}

          {item.room ? (
            <Text style={styles.roomText}>
              Room: {item.room}
            </Text>
          ) : null}

        </View>

        {/* Status */}
        <View style={styles.rightSide}>

          <View
            style={[
              styles.statusBadge,
              isActive
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isActive
                  ? styles.activeText
                  : styles.inactiveText,
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

      {/* Header */}
      <AdminHeader title="Classes" />

      <View style={styles.content}>

        {/* Page heading */}
        <View style={styles.topSection}>

          <View style={styles.headingContainer}>

            <Text style={styles.pageTitle}>
              Classes
            </Text>

            <Text style={styles.pageSubtitle}>
              Manage classes registered in the school.
            </Text>

          </View>

        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {classes.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Classes
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {activeClasses}
            </Text>

            <Text style={styles.statLabel}>
              Active
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {inactiveClasses}
            </Text>

            <Text style={styles.statLabel}>
              Inactive
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {levelsCount}
            </Text>

            <Text style={styles.statLabel}>
              Levels
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
            placeholder="Search classes..."
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

        {/* Level filters */}
        {levels.length > 1 && (
          <View style={styles.filterWrapper}>

            <FlatList
              horizontal
              data={levels}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.filterContent
              }
              renderItem={({ item }) => {
                const selected =
                  level === item;

                return (
                  <Pressable
                    style={[
                      styles.filterButton,
                      selected &&
                        styles.selectedFilter,
                    ]}
                    onPress={() =>
                      setLevel(item)
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
            Class List
          </Text>

          <Text style={styles.resultCount}>
            {filteredClasses.length}{' '}
            {filteredClasses.length === 1
              ? 'class'
              : 'classes'}
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
              Loading classes...
            </Text>

          </View>

        ) : error ? (

          /* Error */
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

        ) : filteredClasses.length === 0 ? (

          /* Empty */
          <View style={styles.center}>

            <Ionicons
              name="school-outline"
              size={55}
              color="#B7BFCD"
            />

            <Text style={styles.emptyTitle}>
              No classes found
            </Text>

            <Text style={styles.emptyText}>
              {classes.length === 0
                ? 'There are no classes saved in the database yet.'
                : 'No classes match your search or filter.'}
            </Text>

          </View>

        ) : (

          /* Class list */
          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.id}
            renderItem={renderClass}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.classList
            }
          />

        )}

      </View>
    </View>
  );
}

/*
 * Styles
 */
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

  classList: {
    paddingBottom: 30,
  },

  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  classIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  classInfo: {
    flex: 1,
    marginRight: 10,
  },

  className: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },

  classCode: {
    fontSize: 12,
    color: '#8A94A6',
    marginTop: 3,
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  detailText: {
    fontSize: 13,
    color: '#44546A',
  },

  teacherText: {
    fontSize: 12,
    color: '#667085',
    marginTop: 5,
  },

  /*
   * This was the missing style causing your red error.
   */
  roomText: {
    fontSize: 12,
    color: '#8A94A6',
    marginTop: 2,
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

  activeBadge: {
    backgroundColor: '#E7F7ED',
  },

  inactiveBadge: {
    backgroundColor: '#FDECEC',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  activeText: {
    color: '#258443',
  },

  inactiveText: {
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
});