import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AdminHeader from '../../../../components/admin/AdminHeader';
import {
  listenToStudents,
  type Student,
} from '../../../../services/students';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] =
    useState('All Classes');

  const [showClassFilter, setShowClassFilter] =
    useState(false);

  /**
   * Listen to real students from Firestore.
   */
  useEffect(() => {
    setLoading(true);
    setError('');

    const unsubscribe = listenToStudents(
      (data: Student[]) => {
        setStudents(data);
        setLoading(false);
      },
      (listenerError: Error) => {
        console.error(
          'Student listener error:',
          listenerError
        );

        setError(
          'Unable to load students from the database.'
        );

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  /**
   * Get unique classes from the actual
   * students stored in Firestore.
   */
  const classes = useMemo(() => {
    const classNames = students
      .map((student) => student.className)
      .filter(
        (className): className is string =>
          Boolean(className)
      );

    return [
      'All Classes',
      ...Array.from(new Set(classNames)),
    ];
  }, [students]);

  /**
   * Filter actual Firestore students.
   */
  const filteredStudents = useMemo(() => {
    const cleanSearch = search
      .trim()
      .toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !cleanSearch ||
        student.fullName
          .toLowerCase()
          .includes(cleanSearch) ||
        student.studentId
          .toLowerCase()
          .includes(cleanSearch) ||
        (student.className || '')
          .toLowerCase()
          .includes(cleanSearch);

      const matchesClass =
        selectedClass === 'All Classes' ||
        student.className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [
    students,
    search,
    selectedClass,
  ]);

  /**
   * Statistics are calculated from real
   * Firestore students.
   */
  const totalStudents = students.length;

  const boys = students.filter(
    (student) =>
      student.gender?.toLowerCase() === 'male'
  ).length;

  const girls = students.filter(
    (student) =>
      student.gender?.toLowerCase() === 'female'
  ).length;

  const totalClasses = new Set(
    students
      .map((student) => student.className)
      .filter(Boolean)
  ).size;

  const handleAddStudent = () => {
    router.push(
      '/admin/students/add' as any
    );
  };

  const handleStudentPress = (
    studentId: string
  ) => {
    router.push(
      `/admin/students/${studentId}` as any
    );
  };

  const handleExport = () => {
    if (students.length === 0) {
      Alert.alert(
        'No students',
        'There are no students to export.'
      );

      return;
    }

    Alert.alert(
      'Export students',
      `${students.length} students are currently loaded from Firestore.`
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedClass('All Classes');
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="Students" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page heading */}
        <View style={styles.headingRow}>
          <View>
            <Text style={styles.pageTitle}>
              Students
            </Text>

            <Text style={styles.pageSubtitle}>
              Manage students and their information
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={handleAddStudent}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Add Student
            </Text>
          </Pressable>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="people-outline"
            title="Total Students"
            value={totalStudents.toString()}
          />

          <StatCard
            icon="male-female-outline"
            title="Boys & Girls"
            value={`${boys} / ${girls}`}
          />

          <StatCard
            icon="school-outline"
            title="Classes"
            value={totalClasses.toString()}
          />
        </View>

        {/* Search and filter */}
        <View style={styles.filterCard}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#9CA3AF"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search students..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />

            {search.length > 0 && (
              <Pressable
                onPress={() => setSearch('')}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#9CA3AF"
                />
              </Pressable>
            )}
          </View>

          <Pressable
            style={styles.classFilterButton}
            onPress={() =>
              setShowClassFilter(
                !showClassFilter
              )
            }
          >
            <Ionicons
              name="filter-outline"
              size={19}
              color="#061B5E"
            />

            <Text
              style={styles.classFilterText}
              numberOfLines={1}
            >
              {selectedClass}
            </Text>

            <Ionicons
              name={
                showClassFilter
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              size={18}
              color="#6B7280"
            />
          </Pressable>

          {showClassFilter && (
            <View style={styles.dropdown}>
              {classes.map((className) => {
                const selected =
                  selectedClass === className;

                return (
                  <Pressable
                    key={className}
                    style={[
                      styles.dropdownItem,
                      selected &&
                        styles.selectedDropdownItem,
                    ]}
                    onPress={() => {
                      setSelectedClass(
                        className
                      );

                      setShowClassFilter(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        selected &&
                          styles.selectedDropdownText,
                      ]}
                    >
                      {className}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color="#061B5E"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Export */}
        <View style={styles.toolbar}>
          <Text style={styles.resultText}>
            {filteredStudents.length}{' '}
            {filteredStudents.length === 1
              ? 'student'
              : 'students'}
          </Text>

          <Pressable
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Ionicons
              name="download-outline"
              size={18}
              color="#061B5E"
            />

            <Text style={styles.exportText}>
              Export
            </Text>
          </Pressable>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color="#061B5E"
            />

            <Text style={styles.stateText}>
              Loading students...
            </Text>
          </View>
        )}

        {/* Error */}
        {!loading && error.length > 0 && (
          <View style={styles.stateContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={46}
              color="#EF4444"
            />

            <Text style={styles.errorTitle}>
              Unable to load students
            </Text>

            <Text style={styles.stateText}>
              {error}
            </Text>
          </View>
        )}

        {/* Empty database */}
        {!loading &&
          !error &&
          students.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="people-outline"
                  size={42}
                  color="#061B5E"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No students yet
              </Text>

              <Text style={styles.emptyText}>
                Students added to the database
                will appear here.
              </Text>

              <Pressable
                style={styles.emptyButton}
                onPress={handleAddStudent}
              >
                <Ionicons
                  name="add"
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={styles.emptyButtonText}
                >
                  Add First Student
                </Text>
              </Pressable>
            </View>
          )}

        {/* No search results */}
        {!loading &&
          !error &&
          students.length > 0 &&
          filteredStudents.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="search-outline"
                  size={42}
                  color="#061B5E"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No students found
              </Text>

              <Text style={styles.emptyText}>
                No student matches your current
                search or class filter.
              </Text>

              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text
                  style={styles.clearButtonText}
                >
                  Clear filters
                </Text>
              </Pressable>
            </View>
          )}

        {/* Real students */}
        {!loading &&
          !error &&
          filteredStudents.length > 0 && (
            <View style={styles.studentsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  Student List
                </Text>

                <Text style={styles.cardCount}>
                  {filteredStudents.length}
                </Text>
              </View>

              {filteredStudents.map(
                (student, index) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    last={
                      index ===
                      filteredStudents.length - 1
                    }
                    onPress={() =>
                      handleStudentPress(
                        student.id
                      )
                    }
                  />
                )
              )}
            </View>
          )}
      </ScrollView>
    </View>
  );
}

/**
 * Statistics card.
 */
type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
};

function StatCard({
  icon,
  title,
  value,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={23}
          color="#061B5E"
        />
      </View>

      <Text style={styles.statTitle}>
        {title}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

/**
 * Student row.
 */
type StudentRowProps = {
  student: Student;
  last: boolean;
  onPress: () => void;
};

function StudentRow({
  student,
  last,
  onPress,
}: StudentRowProps) {
  const initials = student.fullName
    ? student.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((name) =>
          name.charAt(0).toUpperCase()
        )
        .join('')
    : '?';

  const status =
    student.status || 'active';

  return (
    <Pressable
      style={[
        styles.studentRow,
        last && styles.lastStudentRow,
      ]}
      onPress={onPress}
    >
      <View style={styles.studentAvatar}>
        <Text style={styles.studentInitials}>
          {initials}
        </Text>
      </View>

      <View style={styles.studentInfo}>
        <Text
          style={styles.studentName}
          numberOfLines={1}
        >
          {student.fullName || 'Unnamed student'}
        </Text>

        <Text style={styles.studentId}>
          ID: {student.studentId || 'N/A'}
        </Text>
      </View>

      <View style={styles.classInfo}>
        <Text style={styles.classLabel}>
          Class
        </Text>

        <Text
          style={styles.className}
          numberOfLines={1}
        >
          {student.className || 'Not assigned'}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          status.toLowerCase() ===
            'inactive' &&
            styles.inactiveBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            status.toLowerCase() ===
              'inactive' &&
              styles.inactiveStatusText,
          ]}
        >
          {status}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={21}
        color="#9CA3AF"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#061B5E',
  },

  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#061B5E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 15,
    minHeight: 125,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#061B5E',
  },

  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    zIndex: 10,
  },

  searchContainer: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },

  classFilterButton: {
    marginTop: 10,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  classFilterText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#374151',
  },

  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E1E5EC',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  dropdownItem: {
    minHeight: 45,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedDropdownItem: {
    backgroundColor: '#EEF2FF',
  },

  dropdownText: {
    fontSize: 14,
    color: '#374151',
  },

  selectedDropdownText: {
    color: '#061B5E',
    fontWeight: '700',
  },

  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  resultText: {
    fontSize: 13,
    color: '#6B7280',
  },

  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  exportText: {
    marginLeft: 6,
    color: '#061B5E',
    fontSize: 13,
    fontWeight: '700',
  },

  studentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  cardHeader: {
    minHeight: 55,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061B5E',
  },

  cardCount: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    color: '#061B5E',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: '800',
  },

  studentRow: {
    minHeight: 82,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F4',
  },

  lastStudentRow: {
    borderBottomWidth: 0,
  },

  studentAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E7ECFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  studentInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: '#061B5E',
  },

  studentInfo: {
    flex: 1.3,
    marginRight: 10,
  },

  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  studentId: {
    fontSize: 11,
    color: '#6B7280',
  },

  classInfo: {
    flex: 0.9,
    marginRight: 10,
  },

  classLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 3,
  },

  className: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  statusBadge: {
    backgroundColor: '#EAF8EF',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginRight: 10,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
    textTransform: 'capitalize',
  },

  inactiveBadge: {
    backgroundColor: '#F3F4F6',
  },

  inactiveStatusText: {
    color: '#6B7280',
  },

  stateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  stateText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },

  errorTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#061B5E',
    marginBottom: 7,
  },

  emptyText: {
    maxWidth: 320,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#061B5E',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },

  emptyButtonText: {
    marginLeft: 6,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  clearButton: {
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 9,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  clearButtonText: {
    color: '#061B5E',
    fontSize: 13,
    fontWeight: '700',
  },
});