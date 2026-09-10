import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

import AdminHeader from '../../../../components/admin/AdminHeader';

import { auth } from '../../../../services/firebase';

import {
  ChatMessage,
  getConversation,
  getUserProfile,
  listenToMessages,
  markConversationAsRead,
  sendMessage,
  UserProfile,
} from '../../../../services/messages';

export default function MessageDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const conversationId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [otherUser, setOtherUser] =
    useState<UserProfile | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [messageText, setMessageText] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
   * Get current Firebase user.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
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

    return unsubscribe;
  }, []);

  /*
   * Load the conversation and identify
   * the other participant.
   */
  useEffect(() => {
    if (!conversationId || !currentUserId) {
      return;
    }

    let cancelled = false;

    const loadConversation = async () => {
      try {
        setLoading(true);
        setError('');

        const conversation =
          await getConversation(conversationId);

        if (!conversation) {
          setError('Conversation not found.');
          setLoading(false);
          return;
        }

        const participants: string[] =
          conversation.participants || [];

        const otherUserId =
          participants.find(
            (id) => id !== currentUserId
          );

        if (!otherUserId) {
          setError(
            'The other participant could not be found.'
          );
          setLoading(false);
          return;
        }

        const profile =
          await getUserProfile(otherUserId);

        if (!cancelled) {
          setOtherUser(profile);
          setLoading(false);
        }

        /*
         * Opening the conversation clears
         * this user's unread count.
         */
        await markConversationAsRead(
          conversationId,
          currentUserId
        );
      } catch (err) {
        console.error(
          'Error loading conversation:',
          err
        );

        if (!cancelled) {
          setError(
            'Unable to load this conversation.'
          );

          setLoading(false);
        }
      }
    };

    loadConversation();

    return () => {
      cancelled = true;
    };
  }, [conversationId, currentUserId]);

  /*
   * Listen to messages in real time.
   */
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const unsubscribe = listenToMessages(
      conversationId,
      (data) => {
        setMessages(data);
      },
      (listenerError) => {
        console.error(listenerError);

        setError(
          'Unable to load messages.'
        );
      }
    );

    return unsubscribe;
  }, [conversationId]);

  /*
   * Mark messages as read when the screen
   * receives new messages.
   *
   * The conversation-level unread count is
   * also reset when opening the screen.
   */
  useEffect(() => {
    if (
      !conversationId ||
      !currentUserId
    ) {
      return;
    }

    markConversationAsRead(
      conversationId,
      currentUserId
    ).catch((err) => {
      console.error(
        'Unable to mark conversation as read:',
        err
      );
    });
  }, [
    conversationId,
    currentUserId,
    messages.length,
  ]);

  /*
   * Send a real Firestore message.
   */
  const handleSend = async () => {
    const cleanText =
      messageText.trim();

    if (
      !cleanText ||
      !currentUserId ||
      !otherUser?.uid ||
      !conversationId ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      await sendMessage(
        conversationId,
        currentUserId,
        otherUser.uid,
        cleanText
      );

      setMessageText('');
    } catch (err) {
      console.error(
        'Unable to send message:',
        err
      );

      setError(
        'Unable to send the message. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  /*
   * Format Firestore Timestamp.
   */
  const formatTime = (timestamp: any) => {
    if (!timestamp) {
      return '...';
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /*
   * Group messages by date.
   */
  const renderMessage = ({
    item,
  }: {
    item: ChatMessage;
  }) => {
    const isMine =
      item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageRow,
          isMine && styles.myMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine
              ? styles.myMessageBubble
              : styles.theirMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine &&
                styles.myMessageText,
            ]}
          >
            {item.text}
          </Text>

          <View style={styles.messageMeta}>
            <Text
              style={[
                styles.messageTime,
                isMine &&
                  styles.myMessageTime,
              ]}
            >
              {formatTime(
                item.createdAt
              )}
            </Text>

            {isMine && (
              <Ionicons
                name={
                  item.read
                    ? 'checkmark-done'
                    : 'checkmark'
                }
                size={14}
                color={
                  item.read
                    ? '#8FE0FF'
                    : '#D7DDEA'
                }
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const userInitial = useMemo(() => {
    return (
      otherUser?.fullName
        ?.charAt(0)
        .toUpperCase() || '?'
    );
  }, [otherUser]);

  if (loading) {
    return (
      <View style={styles.container}>
        <AdminHeader title="Messages" />

        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#061B5E"
          />

          <Text style={styles.loadingText}>
            Loading conversation...
          </Text>
        </View>
      </View>
    );
  }

  if (error && !otherUser) {
    return (
      <View style={styles.container}>
        <AdminHeader title="Messages" />

        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={52}
            color="#D64545"
          />

          <Text style={styles.errorTitle}>
            Something went wrong
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <AdminHeader title="Messages" />

      <View style={styles.chatContainer}>
        {/* Chat header */}
        <View style={styles.chatHeader}>
          <Pressable
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#172033"
            />
          </Pressable>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInitial}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {otherUser?.fullName ||
                'Unknown User'}
            </Text>

            <Text style={styles.userRole}>
              {otherUser?.role || 'User'}
            </Text>
          </View>

          <Pressable
            style={styles.headerIcon}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color="#687386"
            />
          </Pressable>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#D64545"
            />

            <Text style={styles.errorBannerText}>
              {error}
            </Text>
          </View>
        ) : null}

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            messages.length === 0
              ? styles.emptyMessages
              : styles.messagesContent
          }
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <View style={styles.emptyChatIcon}>
                <Ionicons
                  name="chatbubble-outline"
                  size={35}
                  color="#061B5E"
                />
              </View>

              <Text style={styles.emptyChatTitle}>
                No messages yet
              </Text>

              <Text style={styles.emptyChatText}>
                Send a message to start the conversation.
              </Text>
            </View>
          }
        />

        {/* Composer */}
        <View style={styles.composer}>
          <Pressable style={styles.composerIcon}>
            <Ionicons
              name="add-circle-outline"
              size={26}
              color="#697386"
            />
          </Pressable>

          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type your message..."
            placeholderTextColor="#9AA2B1"
            multiline
            style={styles.input}
          />

          <Pressable
            style={[
              styles.sendButton,
              (!messageText.trim() ||
                sending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={
              !messageText.trim() ||
              sending
            }
          >
            {sending ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Ionicons
                name="send"
                size={19}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  chatContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    overflow: 'hidden',
  },

  chatHeader: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECF2',
  },

  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#061B5E',
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172033',
  },

  userRole: {
    marginTop: 3,
    fontSize: 12,
    color: '#7B8495',
    textTransform: 'capitalize',
  },

  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  messagesContent: {
    padding: 20,
    paddingBottom: 25,
  },

  emptyMessages: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },

  myMessageRow: {
    justifyContent: 'flex-end',
  },

  messageBubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
  },

  theirMessageBubble: {
    backgroundColor: '#F0F2F6',
    borderBottomLeftRadius: 4,
  },

  myMessageBubble: {
    backgroundColor: '#061B5E',
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#172033',
  },

  myMessageText: {
    color: '#FFFFFF',
  },

  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },

  messageTime: {
    fontSize: 10,
    color: '#8B93A1',
  },

  myMessageTime: {
    color: '#C9D1E4',
  },

  emptyChat: {
    alignItems: 'center',
  },

  emptyChatIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EEF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyChatTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },

  emptyChatText: {
    marginTop: 6,
    fontSize: 13,
    color: '#7B8495',
    textAlign: 'center',
  },

  composer: {
    minHeight: 68,
    borderTopWidth: 1,
    borderTopColor: '#E9ECF2',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },

  composerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },

  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    marginHorizontal: 8,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F3F5F8',
    color: '#172033',
    fontSize: 14,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#061B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#7B8495',
  },

  errorTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },

  errorText: {
    marginTop: 7,
    fontSize: 14,
    color: '#7B8495',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: '#061B5E',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: '#FFF1F1',
    gap: 8,
  },

  errorBannerText: {
    flex: 1,
    color: '#D64545',
    fontSize: 12,
  },
});