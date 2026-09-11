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

type Teacher = {
  id: string;
  fullName: string;
  teacherId: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  subject: string;
  status: string;
  createdAt: any;
};

export default function TeachersScreen() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  /*
   * Load teachers from Firestore
   */
  useEffect(() => {
    setLoading(true);
    setError('');

    const teachersRef = collection(db, 'teachers');

    const teachersQuery = query(
      teachersRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      teachersQuery,
      (snapshot) => {
        const teacherData: Teacher[] = snapshot.docs.map(
          (teacherDoc) => {
            const data = teacherDoc.data();

            return {
              id: teacherDoc.id,
              fullName: data.fullName || '',
              teacherId: data.teacherId || '',
              email: data.email || '',
              phone: data.phone || '',
              gender: data.gender || '',
              department: data.department || '',
              subject: data.subject || '',
              status: data.status || 'active',
              createdAt: data.createdAt || null,
            };
          }
        );

        setTeachers(teacherData);
        setLoading(false);
      },
      (listenerError) => {
        console.error(
          'Error loading teachers:',
          listenerError
        );

        setError(
          'Unable to load teachers from the database.'
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /*
   * Get departments from actual database data
   */
  const departments = useMemo(() => {
    const values = teachers
      .map((teacher) => teacher.department)
      .filter(Boolean);

    return [
      'All',
      ...Array.from(new Set(values)),
    ];
  }, [teachers]);

  /*
   * Search and filter teachers
   */
  const filteredTeachers = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !cleanSearch ||
        teacher.fullName
          .toLowerCase()
          .includes(cleanSearch) ||
        teacher.teacherId
          .toLowerCase()
          .includes(cleanSearch) ||
        teacher.email
          .toLowerCase()
          .includes(cleanSearch) ||
        teacher.subject
          .toLowerCase()
          .includes(cleanSearch);

      const matchesDepartment =
        department === 'All' ||
        teacher.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [teachers, search, department]);

  /*
   * Statistics
   */
  const activeTeachers = teachers.filter(
    (teacher) =>
      teacher.status.toLowerCase() === 'active'
  ).length;

  const inactiveTeachers = teachers.filter(
    (teacher) =>
      teacher.status.toLowerCase() === 'inactive'
  ).length;

  const subjects = new Set(
    teachers
      .map((teacher) => teacher.subject)
      .filter(Boolean)
  ).size;

  /*
   * Navigate to Add Teacher page
   *
   * IMPORTANT:
   * Since (tabs) is a route group, we do NOT include
   * (tabs) in the route.
   */
  const goToAddTeacher = () => {
    router.push('/admin/teacher/add');
  };

  /*
   * Teacher card
   */
  const renderTeacher = ({
    item,
  }: {
    item: Teacher;
  }) => {
    const isActive =
      item.status.toLowerCase() === 'active';

    return (
      <Pressable
        style={styles.teacherCard}
        onPress={() => {
          // For now, teacher details are not opened.
          // This card displays the real Firestore data.
        }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.fullName
              ? item.fullName.charAt(0).toUpperCase()
              : 'T'}
          </Text>
        </View>

        <View style={styles.teacherInfo}>
          <Text
            style={styles.teacherName}
            numberOfLines={1}
          >
            {item.fullName || 'Unnamed Teacher'}
          </Text>

          <Text style={styles.teacherId}>
            {item.teacherId || 'No teacher ID'}
          </Text>

          {item.subject ? (
            <Text style={styles.subject}>
              {item.subject}
            </Text>
          ) : null}

          {item.department ? (
            <Text style={styles.departmentText}>
              {item.department}
            </Text>
          ) : null}
        </View>

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
      <AdminHeader title="Teachers" />

      <View style={styles.content}>

        {/* Page heading */}
        <View style={styles.topSection}>
          <View style={styles.headingContainer}>
            <Text style={styles.pageTitle}>
              Teachers
            </Text>

            <Text style={styles.pageSubtitle}>
              Manage teachers registered in the school.
            </Text>
          </View>

          {/* Add Teacher */}
          <Pressable
            style={styles.addButton}
            onPress={goToAddTeacher}
          >
            <Ionicons
              name="add"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Add Teacher
            </Text>
          </Pressable>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {teachers.length}
            </Text>

            <Text style={styles.statLabel}>
              Total Teachers
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {activeTeachers}
            </Text>

            <Text style={styles.statLabel}>
              Active
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {inactiveTeachers}
            </Text>

            <Text style={styles.statLabel}>
              Inactive
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {subjects}
            </Text>

            <Text style={styles.statLabel}>
              Subjects
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
            placeholder="Search teachers..."
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

        {/* Department filters */}
        {departments.length > 1 && (
          <View style={styles.filterWrapper}>
            <FlatList
              horizontal
              data={departments}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.filterContent
              }
              renderItem={({ item }) => {
                const selected =
                  department === item;

                return (
                  <Pressable
                    style={[
                      styles.filterButton,
                      selected &&
                        styles.selectedFilter,
                    ]}
                    onPress={() =>
                      setDepartment(item)
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
            Teacher List
          </Text>

          <Text style={styles.resultCount}>
            {filteredTeachers.length} teacher
            {filteredTeachers.length === 1
              ? ''
              : 's'}
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
              Loading teachers...
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

        ) : filteredTeachers.length === 0 ? (

          /* Empty */
          <View style={styles.center}>
            <Ionicons
              name="people-outline"
              size={55}
              color="#B7BFCD"
            />

            <Text style={styles.emptyTitle}>
              No teachers found
            </Text>

            <Text style={styles.emptyText}>
              {teachers.length === 0
                ? 'There are no teachers saved in the database yet.'
                : 'No teachers match your search or filter.'}
            </Text>

            {teachers.length === 0 && (
              <Pressable
                style={styles.emptyButton}
                onPress={goToAddTeacher}
              >
                <Text style={styles.emptyButtonText}>
                  Add First Teacher
                </Text>
              </Pressable>
            )}
          </View>

        ) : (

          /* Teacher list */
          <FlatList
            data={filteredTeachers}
            keyExtractor={(item) => item.id}
            renderItem={renderTeacher}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              styles.teacherList
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

  teacherList: {
    paddingBottom: 30,
  },

  teacherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  avatarText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#061B5E',
  },

  teacherInfo: {
    flex: 1,
    marginRight: 10,
  },

  teacherName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },

  teacherId: {
    fontSize: 12,
    color: '#8A94A6',
    marginTop: 3,
  },

  subject: {
    fontSize: 13,
    color: '#44546A',
    marginTop: 4,
  },

  departmentText: {
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