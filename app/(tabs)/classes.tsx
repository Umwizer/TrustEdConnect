// app/(tabs)/classes.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  students: number;
  attendance: number;
  grade: string;
  teacher: string;
  schedule: string;
}

export default function ClassesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const classesData: ClassItem[] = [
    {
      id: '1',
      name: 'Class 5A',
      subject: 'Mathematics',
      students: 32,
      attendance: 92,
      grade: '5th Grade',
      teacher: 'Florence Iradukunda',
      schedule: 'Mon, Wed, Fri 8:00-9:30 AM',
    },
    {
      id: '2',
      name: 'Class 5B',
      subject: 'English',
      students: 28,
      attendance: 88,
      grade: '5th Grade',
      teacher: 'Florence Iradukunda',
      schedule: 'Tue, Thu 10:00-11:30 AM',
    },
    {
      id: '3',
      name: 'Class 6A',
      subject: 'Science',
      students: 30,
      attendance: 95,
      grade: '6th Grade',
      teacher: 'Florence Iradukunda',
      schedule: 'Mon, Wed 1:00-2:30 PM',
    },
    {
      id: '4',
      name: 'Class 4A',
      subject: 'Social Studies',
      students: 25,
      attendance: 78,
      grade: '4th Grade',
      teacher: 'Florence Iradukunda',
      schedule: 'Tue, Thu 2:00-3:30 PM',
    },
    {
      id: '5',
      name: 'Class 6B',
      subject: 'Mathematics',
      students: 35,
      attendance: 90,
      grade: '6th Grade',
      teacher: 'Florence Iradukunda',
      schedule: 'Mon, Wed, Fri 10:00-11:30 AM',
    },
  ];

  const filters = ['All', 'Mathematics', 'English', 'Science', 'Social Studies'];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#FF9800';
    return '#F44336';
  };

  const getAttendanceEmoji = (percentage: number) => {
    if (percentage >= 90) return '✅';
    if (percentage >= 75) return '⚠️';
    return '❌';
  };

  const filteredClasses = classesData.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || cls.subject === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const renderClassCard = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => {
        router.push(`./class-detail/${item.id}`);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.classSubject}>{item.subject}</Text>
        </View>
        <View style={styles.gradeBadge}>
          <Text style={styles.gradeText}>{item.grade}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={18} color="#666" />
          <Text style={styles.statText}>{item.students} Students</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={18} color="#666" />
          <Text style={styles.statText}>{item.schedule}</Text>
        </View>
      </View>

      <View style={styles.attendanceSection}>
        <View style={styles.attendanceRow}>
          <View style={styles.attendanceLabel}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.attendanceText}>Attendance:</Text>
          </View>
          <View style={[
            styles.attendanceBadge,
            { backgroundColor: getAttendanceColor(item.attendance) + '20' }
          ]}>
            <Text style={[
              styles.attendancePercentage,
              { color: getAttendanceColor(item.attendance) }
            ]}>
              {getAttendanceEmoji(item.attendance)} {item.attendance}%
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { 
                width: `${item.attendance}%`,
                backgroundColor: getAttendanceColor(item.attendance)
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => {
            router.push(`./class-detail/${item.id}`);
          }}
        >
          <Ionicons name="eye-outline" size={18} color="#1A237E" />
          <Text style={styles.viewButtonText}>View Class</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.attendanceButton]}
          onPress={() => {
            console.log(`Taking attendance for: ${item.name}`);
          }}
        >
          <Ionicons name="checkbox-outline" size={18} color="#FFFFFF" />
          <Text style={styles.attendanceButtonText}>Take Attendance</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Classes</Text>
          <Text style={styles.headerSubtitle}>
            {filteredClasses.length} classes assigned
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by class name or subject..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {filteredClasses.length > 0 ? (
          <View style={styles.classesContainer}>
            {filteredClasses.map((classItem) => (
              <View key={classItem.id}>
                {renderClassCard({ item: classItem })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Classes Found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -15,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  filterChipActive: {
    backgroundColor: '#1A237E',
    borderColor: '#1A237E',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  classesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  classSubject: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  gradeBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A237E',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  attendanceSection: {
    marginBottom: 16,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attendanceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  attendanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendancePercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
  },
  viewButton: {
    backgroundColor: '#E8EAF6',
    marginRight: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A237E',
    marginLeft: 6,
  },
  attendanceButton: {
    backgroundColor: '#1A237E',
    marginLeft: 8,
  },
  attendanceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});