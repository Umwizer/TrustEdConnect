import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Colors = {
  primary: '#1E3A8A',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGray: '#64748B',
  border: '#E2E8F0',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  pink: '#EC4899',
  green: '#10B981',
  red: '#EF4444',
};

const CONVERSATIONS = [
  {
    id: 1,
    name: 'Mr. Bosco K.',
    role: 'Mathematics Teacher',
    avatar: 'BK',
    lastMessage: 'John did very well in the last test. Keep encouraging him!',
    time: '10:30 AM',
    unread: 2,
    online: true,
    color: Colors.blue,
  },
  {
    id: 2,
    name: 'Ms. Aline M.',
    role: 'Class Teacher - S4',
    avatar: 'AM',
    lastMessage: 'Parent meeting is scheduled for Friday at 3:00 PM.',
    time: 'Yesterday',
    unread: 1,
    online: false,
    color: Colors.purple,
  },
  {
    id: 3,
    name: 'School Administration',
    role: 'Office',
    avatar: 'SA',
    lastMessage: 'Your fee payment of 100,000 RWF has been received.',
    time: '2 days ago',
    unread: 0,
    online: false,
    color: Colors.orange,
  },
  {
    id: 4,
    name: 'Mrs. Grace K.',
    role: 'English Teacher',
    avatar: 'GK',
    lastMessage: 'John needs to submit his essay by Monday.',
    time: '3 days ago',
    unread: 0,
    online: false,
    color: Colors.pink,
  },
];

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>3 unread conversations</Text>
          </View>
          <TouchableOpacity style={styles.newButton}>
            <Ionicons name="create-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textGray} />
          <Text style={styles.searchPlaceholder}>Search conversations...</Text>
        </View>

        {/* Conversation List */}
        {CONVERSATIONS.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationCard}
            onPress={() => console.log('Open conversation', conv.id)}
          >
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatar, { backgroundColor: `${conv.color}20` }]}>
                <Text style={[styles.avatarText, { color: conv.color }]}>{conv.avatar}</Text>
              </View>
              {conv.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.conversationContent}>
              <View style={styles.conversationTopRow}>
                <Text style={styles.conversationName}>{conv.name}</Text>
                <Text style={styles.conversationTime}>{conv.time}</Text>
              </View>
              <Text style={styles.conversationRole}>{conv.role}</Text>
              <View style={styles.conversationBottomRow}>
                <Text
                  style={[styles.lastMessage, conv.unread > 0 && styles.lastMessageUnread]}
                  numberOfLines={1}
                >
                  {conv.lastMessage}
                </Text>
                {conv.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  contentContainer: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTextContainer: { alignItems: 'center', flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  headerSubtitle: { fontSize: 12, color: Colors.textGray, marginTop: 2 },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchPlaceholder: { color: Colors.textGray, fontSize: 14, fontWeight: '500' },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800' },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.green,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  conversationContent: { flex: 1, justifyContent: 'center' },
  conversationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  conversationName: { fontSize: 15, fontWeight: '700', color: Colors.textDark },
  conversationTime: { fontSize: 11, color: Colors.textGray, fontWeight: '500' },
  conversationRole: { fontSize: 11, color: Colors.textGray, marginBottom: 6 },
  conversationBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastMessage: { flex: 1, fontSize: 12.5, color: Colors.textGray },
  lastMessageUnread: { color: Colors.textDark, fontWeight: '600' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
});