// app/(tabs)/messages.tsx - Messages
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Conversation {
  id: string;
  name: string;
  role: 'parent' | 'admin' | 'teacher';
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');

  const tabs = ['All', 'Parents', 'Admin'];

  const conversations: Conversation[] = [
    { id: '1', name: 'Mrs. Smith (Parent)', role: 'parent', lastMessage: 'Thank you for the update on Alice...', time: '10:30 AM', unread: 2, avatar: 'S' },
    { id: '2', name: 'School Admin', role: 'admin', lastMessage: 'Reminder: Meeting at 3 PM today', time: '9:15 AM', unread: 1, avatar: 'A' },
    { id: '3', name: 'Mr. Johnson (Parent)', role: 'parent', lastMessage: 'Can we schedule a meeting?', time: 'Yesterday', unread: 0, avatar: 'J' },
    { id: '4', name: 'Mrs. Davis (Parent)', role: 'parent', lastMessage: 'Bob will be absent tomorrow', time: 'Yesterday', unread: 0, avatar: 'D' },
    { id: '5', name: 'Head Teacher', role: 'admin', lastMessage: 'Please submit term results', time: '2 days ago', unread: 0, avatar: 'H' },
    { id: '6', name: 'Ms. Williams (Parent)', role: 'parent', lastMessage: 'Thank you!', time: '3 days ago', unread: 0, avatar: 'W' },
  ];

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      selectedTab === 'All' ||
      (selectedTab === 'Parents' && c.role === 'parent') ||
      (selectedTab === 'Admin' && c.role === 'admin');
    return matchesSearch && matchesTab;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationCard} activeOpacity={0.7}>
      <View style={[
        styles.avatar,
        {
          backgroundColor: item.role === 'parent' ? '#E8EAF6' :
                          item.role === 'admin' ? '#FFF3E0' : '#E8F5E9'
        }
      ]}>
        <Text style={[
          styles.avatarText,
          {
            color: item.role === 'parent' ? '#1A237E' :
                   item.role === 'admin' ? '#E65100' : '#2E7D32'
          }
        ]}>
          {item.avatar}
        </Text>
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text style={styles.conversationMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{totalUnread} new</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.newButton}>
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabChip, selectedTab === tab && styles.tabChipActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabChipText, selectedTab === tab && styles.tabChipTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No conversations</Text>
            <Text style={styles.emptyStateText}>Your messages will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  headerBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  searchInput: { flex: 1, fontSize: 15, color: '#333', marginLeft: 10 },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tabChipActive: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  tabChipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  tabChipTextActive: { color: '#FFFFFF' },
  listContainer: { paddingHorizontal: 20, paddingVertical: 16 },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  conversationContent: { flex: 1, justifyContent: 'center' },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: { fontSize: 15, fontWeight: '600', color: '#1A1A2E', flex: 1 },
  conversationTime: { fontSize: 11, color: '#999' },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: { fontSize: 13, color: '#666', flex: 1 },
  unreadBadge: {
    backgroundColor: '#1A237E',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#FFFFFF' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptyStateText: { fontSize: 14, color: '#999', marginTop: 8 },
});