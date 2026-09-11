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

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

import AdminHeader from '../../../components/admin/AdminHeader';
import { auth } from '../../../services/firebase';

import {
  Conversation,
  listenToConversations,
} from '../../../services/messages';

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [currentUserId, setCurrentUserId] = useState<string | null>(
    null
  );

  /*
   * Get the currently authenticated Firebase user.
   */
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          setCurrentUserId(null);
          setLoading(false);
          return;
        }

        setCurrentUserId(user.uid);
      }
    );

    return unsubscribeAuth;
  }, []);

  /*
   * Listen to conversations belonging to the current user.
   */
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    setError('');

    const unsubscribe = listenToConversations(
      currentUserId,
      (data) => {
        setConversations(data);
        setLoading(false);
      },
      (listenerError) => {
        console.error(listenerError);
        setError(
          'Unable to load messages. Please try again.'
        );
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  /*
   * Search conversations using actual user data.
   */
  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const name =
        conversation.otherUser?.fullName?.toLowerCase() || '';

      const email =
        conversation.otherUser?.email?.toLowerCase() || '';

      const role =
        conversation.otherUser?.role?.toLowerCase() || '';

      const lastMessage =
        conversation.lastMessage?.toLowerCase() || '';

      return (
        name.includes(value) ||
        email.includes(value) ||
        role.includes(value) ||
        lastMessage.includes(value)
      );
    });
  }, [conversations, search]);

  /*
   * Total unread messages.
   */
  const totalUnread = useMemo(() => {
    return conversations.reduce(
      (total, conversation) =>
        total + conversation.unreadCount,
      0
    );
  }, [conversations]);

  /*
   * Format Firestore Timestamp.
   */
  const formatTime = (timestamp: any) => {
    if (!timestamp) {
      return '';
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    const now = new Date();

    const sameDay =
      date.toDateString() === now.toDateString();

    if (sameDay) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString([], {
      day: '2-digit',
      month: 'short',
    });
  };

  /*
   * Open a real conversation.
   */
  const openConversation = (
    conversationId: string
  ) => {
    router.push(
      `/admin/messages/${conversationId}` as any
    );
  };

  const renderConversation = ({
    item,
  }: {
    item: Conversation;
  }) => {
    const user = item.otherUser;

    const name = user?.fullName || 'Unknown User';

    const role = user?.role
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : 'User';

    const firstLetter = name
      .charAt(0)
      .toUpperCase();

    return (
      <Pressable
        style={styles.conversationItem}
        onPress={() => openConversation(item.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstLetter}
          </Text>
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.topRow}>
            <View style={styles.nameContainer}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {name}
              </Text>

              <Text style={styles.role}>
                {role}
              </Text>
            </View>

            <Text style={styles.time}>
              {formatTime(item.lastMessageAt)}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.lastMessage,
                item.unreadCount > 0 &&
                  styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage || 'No messages yet'}
            </Text>

            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99
                    ? '99+'
                    : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#A0A7B5"
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="Messages" />

      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.title}>
              Messages
            </Text>

            <Text style={styles.subtitle}>
              Communicate with teachers, parents and school staff
            </Text>
          </View>

          {totalUnread > 0 && (
            <View style={styles.totalUnread}>
              <Ionicons
                name="mail-unread-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.totalUnreadText}>
                {totalUnread} unread
              </Text>
            </View>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={21}
            color="#7B8495"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor="#9AA2B1"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#9AA2B1"
              />
            </Pressable>
          )}
        </View>

        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Conversations
            </Text>

            <Text style={styles.countText}>
              {filteredConversations.length}
            </Text>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator
                size="large"
                color="#061B5E"
              />

              <Text style={styles.loadingText}>
                Loading conversations...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color="#D64545"
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : filteredConversations.length === 0 ? (
            <View style={styles.centerContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={40}
                  color="#061B5E"
                />
              </View>

              <Text style={styles.emptyTitle}>
                No conversations
              </Text>

              <Text style={styles.emptyText}>
                {search
                  ? 'No conversations match your search.'
                  : 'There are no conversations for this account yet.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              keyExtractor={(item) => item.id}
              renderItem={renderConversation}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                styles.listContent
              }
            />
          )}
        </View>
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

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#172033',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#7B8495',
  },

  totalUnread: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#061B5E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  totalUnreadText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  searchContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#172033',
  },

  listCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    overflow: 'hidden',
  },

  listHeader: {
    height: 58,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  listTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#172033',
  },

  countText: {
    backgroundColor: '#EEF2FA',
    color: '#061B5E',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  listContent: {
    paddingBottom: 20,
  },

  conversationItem: {
    minHeight: 82,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061B5E',
  },

  conversationContent: {
    flex: 1,
    marginRight: 10,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  nameContainer: {
    flex: 1,
    marginRight: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#172033',
  },

  role: {
    marginTop: 3,
    fontSize: 11,
    color: '#7B8495',
  },

  time: {
    fontSize: 11,
    color: '#8B93A1',
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#7B8495',
  },

  unreadMessage: {
    color: '#172033',
    fontWeight: '700',
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#FFA51F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: '#7B8495',
    fontSize: 14,
  },

  errorText: {
    marginTop: 12,
    color: '#D64545',
    fontSize: 14,
    textAlign: 'center',
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },

  emptyText: {
    marginTop: 7,
    fontSize: 13,
    color: '#7B8495',
    textAlign: 'center',
    lineHeight: 20,
  },
});