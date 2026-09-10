// app/(tabs)/dashboard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const summaryData = [
    { id: 1, title: 'My Classes', value: '5', icon: 'book-outline', color: '#1A237E' },
    { id: 2, title: 'Total Students', value: '156', icon: 'people-outline', color: '#0D47A1' },
    { id: 3, title: 'Attendance Today', value: '92%', icon: 'calendar-outline', color: '#00695C' },
    { id: 4, title: 'Pending Results', value: '8', icon: 'document-text-outline', color: '#E65100' },
  ];

  const quickActions = [
    { id: 1, title: 'Take Attendance', icon: 'checkbox-outline', color: '#1A237E' },
    { id: 2, title: 'Enter Results', icon: 'create-outline', color: '#0D47A1' },
    { id: 3, title: 'View Classes', icon: 'grid-outline', color: '#00695C' },
    { id: 4, title: 'Messages', icon: 'chatbubbles-outline', color: '#E65100' },
  ];

  const studentsNeedingAttention = [
    { id: '1', name: 'Alice M', class: 'Class 5A', issue: 'Low attendance (65%)', status: 'warning' },
    { id: '2', name: 'Bob K', class: 'Class 5B', issue: 'Declining performance in Math', status: 'danger' },
    { id: '3', name: 'Cathy R', class: 'Class 4A', issue: 'Low attendance (70%)', status: 'warning' },
  ];

  const notifications = [
    { id: '1', title: 'Parent Meeting', message: 'Meeting scheduled for Friday 3pm', time: '2 hours ago', read: false },
    { id: '2', title: 'Result Upload', message: 'Please upload term 1 results by Friday', time: '5 hours ago', read: false },
    { id: '3', title: 'Student Report', message: 'Alice M needs parent follow-up', time: '1 day ago', read: true },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const renderSummaryCard = ({ item }: { item: typeof summaryData[0] }) => (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIconContainer, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text style={styles.summaryTitle}>{item.title}</Text>
    </View>
  );

  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <TouchableOpacity 
      style={styles.quickActionCard}
      onPress={() => console.log(`Navigating to ${item.title}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon as any} size={28} color={item.color} />
      </View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderStudentItem = ({ item }: { item: typeof studentsNeedingAttention[0] }) => (
    <View style={styles.studentItem}>
      <View style={styles.studentAvatar}>
        <Text style={styles.studentAvatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentClass}>{item.class}</Text>
      </View>
      <View style={[
        styles.studentStatusBadge,
        { backgroundColor: item.status === 'warning' ? '#FF9800' : '#F44336' }
      ]}>
        <Text style={styles.studentStatusText}>
          {item.status === 'warning' ? '⚠️' : '📉'}
        </Text>
      </View>
    </View>
  );

  const renderNotification = ({ item }: { item: typeof notifications[0] }) => (
    <View style={[styles.notificationItem, !item.read && styles.notificationUnread]}>
      <View style={styles.notificationIconContainer}>
        <Ionicons 
          name={item.read ? 'notifications-outline' : 'notifications'} 
          size={20} 
          color={item.read ? '#999' : '#1A237E'} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={1}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileInitials}>FI</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.teacherName}>Florence Iradukunda</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students, classes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <FlatList
            data={summaryData}
            renderItem={renderSummaryCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.summaryRow}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.sectionSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            scrollEnabled={false}
            columnWrapperStyle={styles.quickActionsRow}
          />
        </View>

        {/* Students Needing Attention */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Students Needing Attention</Text>
            <TouchableOpacity>
              <Text style={styles.sectionSeeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.studentsContainer}>
            {studentsNeedingAttention.map((student) => (
              <View key={student.id}>
                {renderStudentItem({ item: student })}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.sectionSeeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <View key={notification.id}>
                {renderNotification({ item: notification })}
              </View>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  greeting: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  summaryContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  summaryRow: {
    justifyContent: 'space-between',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  summaryTitle: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  lastSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  sectionSeeAll: {
    fontSize: 14,
    color: '#1A237E',
    fontWeight: '600',
  },
  quickActionsRow: {
    justifyContent: 'space-between',
  },
  quickActionCard: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionTitle: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
  },
  studentsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  studentClass: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  studentStatusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentStatusText: {
    fontSize: 14,
  },
  notificationsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationUnread: {
    backgroundColor: '#F5F7FF',
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  notificationTitleUnread: {
    color: '#1A237E',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});