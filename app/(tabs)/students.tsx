// app/(tabs)/students.tsx - Student List Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  FlatList,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

interface Student {
  id: string;
  name: string;
  class: string;
  attendance: number;
  averageScore: number;
  status: 'good' | 'attention' | 'critical';
  parentContact: string;
  email: string;
  gender: string;
}

export default function StudentsScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('name');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Mock Data - Replace with API call
  const studentsData: Student[] = [
    {
      id: '1',
      name: 'Alice M',
      class: 'Class 5A',
      attendance: 92,
      averageScore: 85,
      status: 'good',
      parentContact: '+250 788 123 456',
      email: 'alice@email.com',
      gender: 'Female',
    },
    {
      id: '2',
      name: 'Bob K',
      class: 'Class 5A',
      attendance: 65,
      averageScore: 72,
      status: 'attention',
      parentContact: '+250 788 123 457',
      email: 'bob@email.com',
      gender: 'Male',
    },
    {
      id: '3',
      name: 'Cathy R',
      class: 'Class 5A',
      attendance: 70,
      averageScore: 58,
      status: 'critical',
      parentContact: '+250 788 123 458',
      email: 'cathy@email.com',
      gender: 'Female',
    },
    {
      id: '4',
      name: 'David N',
      class: 'Class 5A',
      attendance: 95,
      averageScore: 90,
      status: 'good',
      parentContact: '+250 788 123 459',
      email: 'david@email.com',
      gender: 'Male',
    },
    {
      id: '5',
      name: 'Eva W',
      class: 'Class 5A',
      attendance: 60,
      averageScore: 45,
      status: 'critical',
      parentContact: '+250 788 123 460',
      email: 'eva@email.com',
      gender: 'Female',
    },
    {
      id: '6',
      name: 'Frank M',
      class: 'Class 5A',
      attendance: 88,
      averageScore: 78,
      status: 'good',
      parentContact: '+250 788 123 461',
      email: 'frank@email.com',
      gender: 'Male',
    },
    {
      id: '7',
      name: 'Grace T',
      class: 'Class 5A',
      attendance: 72,
      averageScore: 68,
      status: 'attention',
      parentContact: '+250 788 123 462',
      email: 'grace@email.com',
      gender: 'Female',
    },
  ];

  const filters = ['All', 'Good', 'Needs Attention', 'Critical'];
  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Attendance', value: 'attendance' },
    { label: 'Average Score', value: 'score' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'good':
        return { label: 'Good', color: '#4CAF50', icon: 'checkmark-circle', emoji: '🟢' };
      case 'attention':
        return { label: 'Needs Attention', color: '#FF9800', icon: 'alert-circle', emoji: '🟠' };
      case 'critical':
        return { label: 'Critical', color: '#F44336', icon: 'warning', emoji: '🔴' };
      default:
        return { label: 'Unknown', color: '#999', icon: 'help-circle', emoji: '⚪' };
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#FF9800';
    return '#F44336';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const filteredStudents = studentsData
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.class.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'All' || 
                           getStatusInfo(student.status).label === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attendance':
          return b.attendance - a.attendance;
        case 'score':
          return b.averageScore - a.averageScore;
        default:
          return 0;
      }
    });

  const renderStudentItem = ({ item }: { item: Student }) => {
    const status = getStatusInfo(item.status);
    return (
      <TouchableOpacity 
        style={styles.studentCard}
        onPress={() => {
          router.push(`./student-detail/${item.id}`);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.studentHeader}>
          <View style={styles.studentAvatar}>
            <Text style={styles.studentAvatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentClass}>{item.class}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
            <Text style={styles.statusEmoji}>{status.emoji}</Text>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.studentStats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={[styles.statValue, { color: getAttendanceColor(item.attendance) }]}>
              {item.attendance}%
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="stats-chart-outline" size={16} color="#666" />
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={[styles.statValue, { color: getScoreColor(item.averageScore) }]}>
              {item.averageScore}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Students</Text>
        <Text style={styles.headerCount}>{studentsData.length} enrolled</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
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
                {filter === 'All' ? '👥 All' : 
                 filter === 'Good' ? '🟢 Good' :
                 filter === 'Needs Attention' ? '🟠 Attention' :
                 '🔴 Critical'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="options-outline" size={20} color="#1A237E" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Students Found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter
            </Text>
          </View>
        }
      />

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModalContent}>
            <Text style={styles.sortModalTitle}>Sort By</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  selectedSort === option.value && styles.sortOptionActive,
                ]}
                onPress={() => {
                  setSelectedSort(option.value);
                  setShowSortModal(false);
                }}
              >
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option.value && styles.sortOptionTextActive,
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.value && (
                  <Ionicons name="checkmark" size={20} color="#1A237E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  headerCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
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
    flexDirection: 'row',
    alignItems: 'center',
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
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginLeft: 'auto',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  studentClass: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  studentStats: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    width: '80%',
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sortOptionActive: {
    borderBottomColor: '#1A237E',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#666',
  },
  sortOptionTextActive: {
    color: '#1A237E',
    fontWeight: '600',
  },
});