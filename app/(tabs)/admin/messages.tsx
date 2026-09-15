import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { onAuthStateChanged } from 'firebase/auth';

import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import AdminHeader from '../../../components/admin/AdminHeader';

import { auth, db } from '../../../services/firebase';

import {
  Conversation,
  createConversation,
  listenToConversations,
} from '../../../services/messages';

/* =========================================================
   TYPES
========================================================= */

type Contact = {
  id: string;
  uid?: string;

  fullName: string;
  email: string;
  phone: string;

  role: 'teacher' | 'parent';

  source: 'user' | 'teacher';

  canMessage: boolean;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MessagesScreen() {
  /*
   * Existing conversations
   */
  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  /*
   * Registered parents and teachers
   */
  const [contacts, setContacts] = useState<Contact[]>([]);

  /*
   * Loading states
   */
  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingContacts, setLoadingContacts] =
    useState(true);

  /*
   * General UI
   */
  const [search, setSearch] = useState('');

  const [error, setError] = useState('');

  const [currentUserId, setCurrentUserId] = useState<
    string | null
  >(null);

  const [startingConversationWith, setStartingConversationWith] =
    useState<string | null>(null);

  /* =======================================================
     AUTHENTICATED USER
  ======================================================= */

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          setCurrentUserId(null);
          setLoadingConversations(false);
          setLoadingContacts(false);
          return;
        }

        setCurrentUserId(user.uid);
      }
    );

    return unsubscribeAuth;
  }, []);

  /* =======================================================
     EXISTING CONVERSATIONS
  ======================================================= */

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    setLoadingConversations(true);
    setError('');

    const unsubscribe = listenToConversations(
      currentUserId,
      (data) => {
        setConversations(data);
        setLoadingConversations(false);
      },
      (listenerError) => {
        console.error(
          'Conversation listener error:',
          listenerError
        );

        setError(
          'Unable to load conversations. Please try again.'
        );

        setLoadingConversations(false);
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  /* =======================================================
     REGISTERED USERS
     
     Gets actual parents and teachers from:
     
     users/{uid}
     
     role = parent
     role = teacher
  ======================================================= */

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    setLoadingContacts(true);

    const usersCollection = collection(db, 'users');

    const teacherQuery = query(
      usersCollection,
      where('role', '==', 'teacher')
    );

    const parentQuery = query(
      usersCollection,
      where('role', '==', 'parent')
    );

    let registeredTeachers: Contact[] = [];
    let registeredParents: Contact[] = [];

    const updateContacts = () => {
      /*
       * Combine registered teachers + parents.
       */
      const combined = [
        ...registeredTeachers,
        ...registeredParents,
      ];

      /*
       * Remove the currently logged-in user.
       */
      const withoutCurrentUser = combined.filter(
        (contact) => contact.uid !== currentUserId
      );

      /*
       * Remove duplicates.
       */
      const uniqueContacts = withoutCurrentUser.filter(
        (contact, index, array) =>
          array.findIndex(
            (item) =>
              item.uid === contact.uid &&
              item.source === contact.source
          ) === index
      );

      /*
       * Sort alphabetically.
       */
      uniqueContacts.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

      setContacts((previous) => {
        /*
         * Keep admin-added teachers separate from this
         * registered-user update.
         */
        const addedTeachers = previous.filter(
          (contact) =>
            contact.source === 'teacher'
        );

        return [
          ...uniqueContacts,
          ...addedTeachers,
        ];
      });

      setLoadingContacts(false);
    };

    const unsubscribeTeachers = onSnapshot(
      teacherQuery,
      (snapshot) => {
        registeredTeachers = snapshot.docs.map(
          (document) => {
            const data = document.data();

            return {
              id: document.id,
              uid: data.uid || document.id,
              fullName:
                data.fullName || 'Unnamed Teacher',
              email: data.email || '',
              phone: data.phone || '',
              role: 'teacher',
              source: 'user',
              canMessage: true,
            };
          }
        );

        updateContacts();
      },
      (listenerError) => {
        console.error(
          'Registered teacher listener error:',
          listenerError
        );

        setLoadingContacts(false);
      }
    );

    const unsubscribeParents = onSnapshot(
      parentQuery,
      (snapshot) => {
        registeredParents = snapshot.docs.map(
          (document) => {
            const data = document.data();

            return {
              id: document.id,
              uid: data.uid || document.id,
              fullName:
                data.fullName || 'Unnamed Parent',
              email: data.email || '',
              phone: data.phone || '',
              role: 'parent',
              source: 'user',
              canMessage: true,
            };
          }
        );

        updateContacts();
      },
      (listenerError) => {
        console.error(
          'Registered parent listener error:',
          listenerError
        );

        setLoadingContacts(false);
      }
    );

    return () => {
      unsubscribeTeachers();
      unsubscribeParents();
    };
  }, [currentUserId]);

  /* =======================================================
     ADMIN-ADDED TEACHERS
     
     Gets teachers from:
     
     teachers/{teacherDocumentId}
     
     These may not have Firebase Auth accounts yet.
  ======================================================= */

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const teachersCollection = collection(
      db,
      'teachers'
    );

    const unsubscribe = onSnapshot(
      teachersCollection,
      (snapshot) => {
        const addedTeachers: Contact[] =
          snapshot.docs.map((document) => {
            const data = document.data();

            /*
             * If the teacher record eventually gets linked
             * to a Firebase account, it can contain uid.
             */
            const linkedUid =
              data.uid || undefined;

            return {
              id: document.id,
              uid: linkedUid,

              fullName:
                data.fullName || 'Unnamed Teacher',

              email: data.email || '',

              phone: data.phone || '',

              role: 'teacher',

              source: 'teacher',

              /*
               * Only allow Firestore messaging when a real
               * Firebase Auth UID exists.
               */
              canMessage: Boolean(linkedUid),
            };
          });

        setContacts((previous) => {
          /*
           * Keep registered users.
           */
          const registeredUsers =
            previous.filter(
              (contact) =>
                contact.source === 'user'
            );

          /*
           * If the same teacher has both a registered
           * users record and an admin-added teacher record,
           * the registered account should be preferred.
           */
          const registeredUids = new Set(
            registeredUsers
              .map((contact) => contact.uid)
              .filter(Boolean)
          );

          const filteredAddedTeachers =
            addedTeachers.filter(
              (teacher) =>
                !(
                  teacher.uid &&
                  registeredUids.has(teacher.uid)
                )
            );

          const combined = [
            ...registeredUsers,
            ...filteredAddedTeachers,
          ];

          combined.sort((a, b) =>
            a.fullName.localeCompare(b.fullName)
          );

          return combined;
        });

        setLoadingContacts(false);
      },
      (listenerError) => {
        console.error(
          'Admin-added teacher listener error:',
          listenerError
        );

        setLoadingContacts(false);
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  /* =======================================================
     SEARCH CONVERSATIONS
  ======================================================= */

  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return conversations;
    }

    return conversations.filter(
      (conversation) => {
        const name =
          conversation.otherUser?.fullName?.toLowerCase() ||
          '';

        const email =
          conversation.otherUser?.email?.toLowerCase() ||
          '';

        const role =
          conversation.otherUser?.role?.toLowerCase() ||
          '';

        const lastMessage =
          conversation.lastMessage?.toLowerCase() ||
          '';

        return (
          name.includes(value) ||
          email.includes(value) ||
          role.includes(value) ||
          lastMessage.includes(value)
        );
      }
    );
  }, [conversations, search]);

  /* =======================================================
     SEARCH CONTACTS
  ======================================================= */

  const filteredContacts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return contacts;
    }

    return contacts.filter((contact) => {
      return (
        contact.fullName
          .toLowerCase()
          .includes(value) ||
        contact.email
          .toLowerCase()
          .includes(value) ||
        contact.phone
          .toLowerCase()
          .includes(value) ||
        contact.role
          .toLowerCase()
          .includes(value)
      );
    });
  }, [contacts, search]);

  /* =======================================================
     UNREAD COUNT
  ======================================================= */

  const totalUnread = useMemo(() => {
    return conversations.reduce(
      (total, conversation) =>
        total + conversation.unreadCount,
      0
    );
  }, [conversations]);

  /* =======================================================
     FORMAT TIME
  ======================================================= */

  const formatTime = (timestamp: any) => {
    if (!timestamp) {
      return '';
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    const now = new Date();

    const sameDay =
      date.toDateString() ===
      now.toDateString();

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

  /* =======================================================
     OPEN EXISTING CONVERSATION
  ======================================================= */

  const openConversation = (
    conversationId: string
  ) => {
    router.push(
      `/admin/messages/${conversationId}` as any
    );
  };

  /* =======================================================
     CALL CONTACT
  ======================================================= */

  const handleCall = async (
    phone: string
  ) => {
    if (!phone) {
      Alert.alert(
        'No phone number',
        'This contact does not have a phone number.'
      );

      return;
    }

    const cleanedPhone =
      phone.trim();

    const phoneUrl =
      Platform.OS === 'ios'
        ? `telprompt:${cleanedPhone}`
        : `tel:${cleanedPhone}`;

    try {
      const supported =
        await Linking.canOpenURL(
          phoneUrl
        );

      if (!supported) {
        Alert.alert(
          'Cannot make call',
          'This device cannot open the phone dialer.'
        );

        return;
      }

      await Linking.openURL(
        phoneUrl
      );
    } catch (callError) {
      console.error(
        'Call error:',
        callError
      );

      Alert.alert(
        'Call failed',
        'Unable to open the phone dialer.'
      );
    }
  };

  /* =======================================================
     START NEW CONVERSATION
  ======================================================= */

  const startConversation = async (
    contact: Contact
  ) => {
    if (!currentUserId) {
      Alert.alert(
        'Not signed in',
        'Please sign in again.'
      );

      return;
    }

    /*
     * Admin-added teacher without a Firebase UID
     * cannot receive Firestore messages yet.
     */
    if (
      !contact.canMessage ||
      !contact.uid
    ) {
      Alert.alert(
        'Account not registered',
        `${contact.fullName} has been added as a teacher, but they do not have a TrustEdConnect account yet. You can call their phone number, but in-app messaging will be available after their account is linked.`
      );

      return;
    }

    try {
      setStartingConversationWith(
        contact.uid
      );

      const conversationId =
        await createConversation(
          currentUserId,
          contact.uid
        );

      router.push(
        `/admin/messages/${conversationId}` as any
      );
    } catch (conversationError) {
      console.error(
        'Create conversation error:',
        conversationError
      );

      Alert.alert(
        'Unable to start conversation',
        'Please check your internet connection and try again.'
      );
    } finally {
      setStartingConversationWith(
        null
      );
    }
  };

  /* =======================================================
     RENDER CONVERSATION
  ======================================================= */

  const renderConversation = ({
    item,
  }: {
    item: Conversation;
  }) => {
    const user = item.otherUser;

    const name =
      user?.fullName ||
      'Unknown User';

    const role =
      user?.role
        ? user.role.charAt(0).toUpperCase() +
          user.role.slice(1)
        : 'User';

    const firstLetter =
      name
        .charAt(0)
        .toUpperCase();

    return (
      <Pressable
        style={
          styles.conversationItem
        }
        onPress={() =>
          openConversation(item.id)
        }
      >
        <View style={styles.avatar}>
          <Text
            style={styles.avatarText}
          >
            {firstLetter}
          </Text>
        </View>

        <View
          style={
            styles.conversationContent
          }
        >
          <View style={styles.topRow}>
            <View
              style={
                styles.nameContainer
              }
            >
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
              {formatTime(
                item.lastMessageAt
              )}
            </Text>
          </View>

          <View
            style={styles.bottomRow}
          >
            <Text
              style={[
                styles.lastMessage,
                item.unreadCount > 0 &&
                  styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage ||
                'No messages yet'}
            </Text>

            {item.unreadCount > 0 && (
              <View
                style={
                  styles.unreadBadge
                }
              >
                <Text
                  style={
                    styles.unreadText
                  }
                >
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

  /* =======================================================
     RENDER CONTACT
  ======================================================= */

  const renderContact = ({
    item,
  }: {
    item: Contact;
  }) => {
    const firstLetter =
      item.fullName
        .charAt(0)
        .toUpperCase();

    const roleName =
      item.role === 'teacher'
        ? 'Teacher'
        : 'Parent';

    const isStarting =
      startingConversationWith ===
      item.uid;

    return (
      <View style={styles.contactItem}>
        {/* AVATAR */}
        <View style={styles.contactAvatar}>
          <Text
            style={
              styles.contactAvatarText
            }
          >
            {firstLetter}
          </Text>
        </View>

        {/* INFORMATION */}
        <View
          style={
            styles.contactInformation
          }
        >
          <View style={styles.contactTopRow}>
            <View
              style={
                styles.contactNameContainer
              }
            >
              <Text
                style={styles.contactName}
                numberOfLines={1}
              >
                {item.fullName}
              </Text>

              <Text style={styles.contactRole}>
                {roleName}
              </Text>
            </View>
          </View>

          {/* EMAIL */}
          {item.email ? (
            <View
              style={styles.infoRow}
            >
              <Ionicons
                name="mail-outline"
                size={15}
                color="#7B8495"
              />

              <Text
                style={styles.infoText}
                numberOfLines={1}
              >
                {item.email}
              </Text>
            </View>
          ) : null}

          {/* PHONE */}
          {item.phone ? (
            <View
              style={styles.infoRow}
            >
              <Ionicons
                name="call-outline"
                size={15}
                color="#7B8495"
              />

              <Text
                style={styles.infoText}
                numberOfLines={1}
              >
                {item.phone}
              </Text>
            </View>
          ) : null}

          {/* ACTIONS */}
          <View
            style={styles.contactActions}
          >
            <Pressable
              style={[
                styles.messageButton,
                !item.canMessage &&
                  styles.disabledMessageButton,
              ]}
              onPress={() =>
                startConversation(item)
              }
              disabled={
                isStarting
              }
            >
              {isStarting ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.messageButtonText
                    }
                  >
                    Message
                  </Text>
                </>
              )}
            </Pressable>

            {item.phone ? (
              <Pressable
                style={
                  styles.callButton
                }
                onPress={() =>
                  handleCall(
                    item.phone
                  )
                }
              >
                <Ionicons
                  name="call-outline"
                  size={17}
                  color="#061B5E"
                />

                <Text
                  style={
                    styles.callButtonText
                  }
                >
                  Call
                </Text>
              </Pressable>
            ) : null}
          </View>

          {/* ADMIN-ADDED TEACHER WITHOUT ACCOUNT */}
          {!item.canMessage &&
            item.source ===
              'teacher' && (
              <View
                style={
                  styles.accountNotice
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color="#8A6500"
                />

                <Text
                  style={
                    styles.accountNoticeText
                  }
                >
                  Teacher has not registered
                  an account yet
                </Text>
              </View>
            )}
        </View>
      </View>
    );
  };

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <View style={styles.container}>
      <AdminHeader title="Messages" />

      <View style={styles.content}>
        {/* PAGE HEADER */}
        <View
          style={styles.pageHeader}
        >
          <View>
            <Text style={styles.title}>
              Messages
            </Text>

            <Text
              style={styles.subtitle}
            >
              Communicate with teachers,
              parents and school staff
            </Text>
          </View>

          {totalUnread > 0 && (
            <View
              style={styles.totalUnread}
            >
              <Ionicons
                name="mail-unread-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.totalUnreadText
                }
              >
                {totalUnread} unread
              </Text>
            </View>
          )}
        </View>

        {/* SEARCH */}
        <View
          style={
            styles.searchContainer
          }
        >
          <Ionicons
            name="search-outline"
            size={21}
            color="#7B8495"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search people, email, phone or messages..."
            placeholderTextColor="#9AA2B1"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() =>
                setSearch('')
              }
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#9AA2B1"
              />
            </Pressable>
          )}
        </View>

        {/* MAIN LIST */}
        <FlatList
          data={[]}
          keyExtractor={() =>
            'empty'
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.mainListContent
          }
          ListHeaderComponent={
            <>
              {/* ==========================================
                  CONVERSATIONS
              ========================================== */}

              <View
                style={
                  styles.sectionCard
                }
              >
                <View
                  style={
                    styles.listHeader
                  }
                >
                  <View
                    style={
                      styles.sectionTitleContainer
                    }
                  >
                    <Ionicons
                      name="chatbubbles-outline"
                      size={20}
                      color="#061B5E"
                    />

                    <Text
                      style={
                        styles.listTitle
                      }
                    >
                      Conversations
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.countText
                    }
                  >
                    {
                      filteredConversations.length
                    }
                  </Text>
                </View>

                {loadingConversations ? (
                  <View
                    style={
                      styles.smallLoading
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#061B5E"
                    />

                    <Text
                      style={
                        styles.loadingText
                      }
                    >
                      Loading conversations...
                    </Text>
                  </View>
                ) : error ? (
                  <View
                    style={
                      styles.smallEmpty
                    }
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={35}
                      color="#D64545"
                    />

                    <Text
                      style={
                        styles.errorText
                      }
                    >
                      {error}
                    </Text>
                  </View>
                ) : filteredConversations.length ===
                  0 ? (
                  <View
                    style={
                      styles.smallEmpty
                    }
                  >
                    <Text
                      style={
                        styles.noConversationText
                      }
                    >
                      No existing conversations.
                    </Text>
                  </View>
                ) : (
                  <View>
                    {filteredConversations.map(
                      (item) => (
                        <View
                          key={item.id}
                        >
                          {renderConversation({
                            item,
                          })}
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>

              {/* ==========================================
                  CONTACTS
              ========================================== */}

              <View
                style={
                  styles.sectionCard
                }
              >
                <View
                  style={
                    styles.listHeader
                  }
                >
                  <View
                    style={
                      styles.sectionTitleContainer
                    }
                  >
                    <Ionicons
                      name="people-outline"
                      size={20}
                      color="#061B5E"
                    />

                    <Text
                      style={
                        styles.listTitle
                      }
                    >
                      Teachers & Parents
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.countText
                    }
                  >
                    {
                      filteredContacts.length
                    }
                  </Text>
                </View>

                {loadingContacts ? (
                  <View
                    style={
                      styles.smallLoading
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#061B5E"
                    />

                    <Text
                      style={
                        styles.loadingText
                      }
                    >
                      Loading contacts...
                    </Text>
                  </View>
                ) : filteredContacts.length ===
                  0 ? (
                  <View
                    style={
                      styles.smallEmpty
                    }
                  >
                    <View
                      style={
                        styles.emptyIcon
                      }
                    >
                      <Ionicons
                        name="people-outline"
                        size={35}
                        color="#061B5E"
                      />
                    </View>

                    <Text
                      style={
                        styles.emptyTitle
                      }
                    >
                      No contacts found
                    </Text>

                    <Text
                      style={
                        styles.emptyText
                      }
                    >
                      Registered teachers and
                      parents will appear here.
                    </Text>
                  </View>
                ) : (
                  <View>
                    {filteredContacts.map(
                      (item) => (
                        <View
                          key={`${item.source}-${item.id}`}
                        >
                          {renderContact({
                            item,
                          })}
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>
            </>
          }
          renderItem={null}
        />
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

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

  mainListContent: {
    paddingBottom: 30,
  },

  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7EAF0',
    overflow: 'hidden',
    marginBottom: 18,
  },

  listHeader: {
    minHeight: 58,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
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

  contactItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  contactAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#061B5E',
  },

  contactInformation: {
    flex: 1,
  },

  contactTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contactNameContainer: {
    flex: 1,
  },

  contactName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#172033',
  },

  contactRole: {
    marginTop: 3,
    fontSize: 11,
    color: '#061B5E',
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  infoText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 13,
    color: '#7B8495',
  },

  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 9,
  },

  messageButton: {
    minHeight: 38,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#061B5E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  disabledMessageButton: {
    opacity: 0.65,
  },

  messageButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  callButton: {
    minHeight: 38,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: '#EEF2FA',
    borderWidth: 1,
    borderColor: '#DDE4F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  callButtonText: {
    color: '#061B5E',
    fontSize: 12,
    fontWeight: '700',
  },

  accountNotice: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF8DF',
    flexDirection: 'row',
    alignItems: 'center',
  },

  accountNoticeText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 11,
    color: '#8A6500',
  },

  smallLoading: {
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  loadingText: {
    color: '#7B8495',
    fontSize: 13,
  },

  smallEmpty: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  noConversationText: {
    color: '#7B8495',
    fontSize: 13,
  },

  errorText: {
    marginTop: 10,
    color: '#D64545',
    fontSize: 13,
    textAlign: 'center',
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EEF2FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: '800',
    color: '#172033',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: '#7B8495',
    textAlign: 'center',
    lineHeight: 20,
  },
});