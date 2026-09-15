import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

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
  AppNotification,
  listenToNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../../services/notifications';

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [search, setSearch] = useState('');

  const [filter, setFilter] = useState<
    'all' | 'unread' | 'read'
  >('all');

  const [loading, setLoading] =
    useState(true);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState('');

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  /*
   * Get the currently authenticated user.
   */
  useEffect(() => {
    const unsubscribeAuth =
      onAuthStateChanged(
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
   * Listen to this user's notifications
   * in real time.
   */
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);
    setError('');

    const unsubscribe =
      listenToNotifications(
        currentUserId,
        (data) => {
          setNotifications(data);
          setLoading(false);
        },
        (listenerError) => {
          console.error(listenerError);

          setError(
            'Unable to load notifications.'
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, [currentUserId]);

  /*
   * Number of unread notifications.
   */
  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.read
    ).length;
  }, [notifications]);

  /*
   * Search + filter.
   */
  const filteredNotifications =
    useMemo(() => {
      const searchValue =
        search.trim().toLowerCase();

      return notifications.filter(
        (notification) => {
          const matchesSearch =
            !searchValue ||
            notification.title
              .toLowerCase()
              .includes(searchValue) ||
            notification.message
              .toLowerCase()
              .includes(searchValue);

          const matchesFilter =
            filter === 'all' ||
            (filter === 'unread' &&
              !notification.read) ||
            (filter === 'read' &&
              notification.read);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  /*
   * Format Firestore timestamp.
   */
  const formatNotificationTime = (
    timestamp: any
  ) => {
    if (!timestamp) {
      return 'Just now';
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    const now = new Date();

    const difference =
      now.getTime() -
      date.getTime();

    const minutes = Math.floor(
      difference / 60000
    );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString([], {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  /*
   * Notification icon based on the
   * actual notification type.
   */
  const getNotificationIcon = (
    type: string
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'message':
        return 'chatbubble-ellipses-outline';

      case 'student':
        return 'person-add-outline';

      case 'teacher':
        return 'school-outline';

      case 'parent':
        return 'people-outline';

      case 'event':
        return 'calendar-outline';

      case 'attendance':
        return 'checkmark-circle-outline';

      case 'grade':
        return 'bar-chart-outline';

      case 'announcement':
        return 'megaphone-outline';

      default:
        return 'notifications-outline';
    }
  };

  /*
   * Open a notification.
   */
  const handleNotificationPress =
    async (
      notification: AppNotification
    ) => {
      try {
        if (!notification.read) {
          await markNotificationAsRead(
            notification.id
          );
        }

        /*
         * If this notification has a route,
         * navigate to that route.
         */
        if (
          notification.relatedRoute
        ) {
          if (
            notification.relatedId
          ) {
            router.push(
              `${notification.relatedRoute}/${notification.relatedId}` as any
            );
          } else {
            router.push(
              notification.relatedRoute as any
            );
          }
        }
      } catch (err) {
        console.error(
          'Unable to open notification:',
          err
        );
      }
    };

  /*
   * Mark every notification as read.
   */
  const handleMarkAllAsRead =
    async () => {
      if (
        !currentUserId ||
        unreadCount === 0 ||
        markingAll
      ) {
        return;
      }

      try {
        setMarkingAll(true);

        await markAllNotificationsAsRead(
          currentUserId,
          notifications
        );
      } catch (err) {
        console.error(
          'Unable to mark notifications as read:',
          err
        );

        setError(
          'Unable to mark all notifications as read.'
        );
      } finally {
        setMarkingAll(false);
      }
    };

  const renderNotification = ({
    item,
  }: {
    item: AppNotification;
  }) => {
    const icon =
      getNotificationIcon(item.type);

    return (
      <Pressable
        style={[
          styles.notificationItem,
          !item.read &&
            styles.unreadNotification,
        ]}
        onPress={() =>
          handleNotificationPress(item)
        }
      >
        <View
          style={[
            styles.notificationIcon,
            !item.read &&
              styles.unreadNotificationIcon,
          ]}
        >
          <Ionicons
            name={icon}
            size={23}
            color={
              !item.read
                ? '#FFFFFF'
                : '#061B5E'
            }
          />
        </View>

        <View
          style={
            styles.notificationContent
          }
        >
          <View
            style={styles.notificationTop}
          >
            <Text
              style={[
                styles.notificationTitle,
                !item.read &&
                  styles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text
              style={styles.notificationTime}
            >
              {formatNotificationTime(
                item.createdAt
              )}
            </Text>
          </View>

          <Text
            style={styles.notificationMessage}
            numberOfLines={2}
          >
            {item.message}
          </Text>
        </View>

        {!item.read && (
          <View
            style={styles.unreadDot}
          />
        )}

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#A0A7B5"
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="Notifications" />

      <View style={styles.content}>
        {/* Page heading */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.title}>
              Notifications
            </Text>

            <Text
              style={styles.subtitle}
            >
              Stay updated with important
              school activities
            </Text>
          </View>

          {unreadCount > 0 && (
            <View
              style={styles.unreadSummary}
            >
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={styles.unreadSummaryText}
              >
                {unreadCount} unread
              </Text>
            </View>
          )}
        </View>

        {/* Search */}
        <View
          style={styles.searchContainer}
        >
          <Ionicons
            name="search-outline"
            size={21}
            color="#7B8495"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search notifications..."
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

        {/* Filters */}
        <View
          style={styles.filterRow}
        >
          <View
            style={styles.filterButtons}
          >
            <Pressable
              style={[
                styles.filterButton,
                filter === 'all' &&
                  styles.activeFilter,
              ]}
              onPress={() =>
                setFilter('all')
              }
            >
              <Text
                style={[
                  styles.filterText,
                  filter === 'all' &&
                    styles.activeFilterText,
                ]}
              >
                All
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterButton,
                filter === 'unread' &&
                  styles.activeFilter,
              ]}
              onPress={() =>
                setFilter('unread')
              }
            >
              <Text
                style={[
                  styles.filterText,
                  filter === 'unread' &&
                    styles.activeFilterText,
                ]}
              >
                Unread
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterButton,
                filter === 'read' &&
                  styles.activeFilter,
              ]}
              onPress={() =>
                setFilter('read')
              }
            >
              <Text
                style={[
                  styles.filterText,
                  filter === 'read' &&
                    styles.activeFilterText,
                ]}
              >
                Read
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.markAllButton,
              (unreadCount === 0 ||
                markingAll) &&
                styles.disabledButton,
            ]}
            onPress={
              handleMarkAllAsRead
            }
            disabled={
              unreadCount === 0 ||
              markingAll
            }
          >
            {markingAll ? (
              <ActivityIndicator
                size="small"
                color="#061B5E"
              />
            ) : (
              <Ionicons
                name="checkmark-done-outline"
                size={18}
                color={
                  unreadCount === 0
                    ? '#A0A7B5'
                    : '#061B5E'
                }
              />
            )}

            <Text
              style={[
                styles.markAllText,
                unreadCount === 0 &&
                  styles.disabledText,
              ]}
            >
              Mark all as read
            </Text>
          </Pressable>
        </View>

        {/* Notifications card */}
        <View
          style={styles.listCard}
        >
          <View
            style={styles.listHeader}
          >
            <Text
              style={styles.listTitle}
            >
              Recent notifications
            </Text>

            <Text
              style={styles.countText}
            >
              {filteredNotifications.length}
            </Text>
          </View>

          {loading ? (
            <View
              style={styles.centerContainer}
            >
              <ActivityIndicator
                size="large"
                color="#061B5E"
              />

              <Text
                style={styles.loadingText}
              >
                Loading notifications...
              </Text>
            </View>
          ) : error ? (
            <View
              style={styles.centerContainer}
            >
              <Ionicons
                name="alert-circle-outline"
                size={50}
                color="#D64545"
              />

              <Text
                style={styles.errorText}
              >
                {error}
              </Text>
            </View>
          ) : filteredNotifications.length ===
            0 ? (
            <View
              style={styles.centerContainer}
            >
              <View
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="notifications-outline"
                  size={40}
                  color="#061B5E"
                />
              </View>

              <Text
                style={styles.emptyTitle}
              >
                No notifications
              </Text>

              <Text
                style={styles.emptyText}
              >
                {search ||
                filter !== 'all'
                  ? 'No notifications match your current filter.'
                  : 'You do not have any notifications yet.'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={
                filteredNotifications
              }
              keyExtractor={(item) =>
                item.id
              }
              renderItem={
                renderNotification
              }
              showsVerticalScrollIndicator={
                false
              }
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
    marginBottom: 20,
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

  unreadSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#061B5E',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },

  unreadSummaryText: {
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
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#172033',
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E6ED',
  },

  activeFilter: {
    backgroundColor: '#061B5E',
    borderColor: '#061B5E',
  },

  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#697386',
  },

  activeFilterText: {
    color: '#FFFFFF',
  },

  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  markAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#061B5E',
  },

  disabledButton: {
    opacity: 0.6,
  },

  disabledText: {
    color: '#A0A7B5',
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

  notificationItem: {
    minHeight: 88,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F6',
    flexDirection: 'row',
    alignItems: 'center',
  },

  unreadNotification: {
    backgroundColor: '#F8FAFF',
  },

  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  unreadNotificationIcon: {
    backgroundColor: '#061B5E',
  },

  notificationContent: {
    flex: 1,
    marginRight: 10,
  },

  notificationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  notificationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#172033',
    marginRight: 10,
  },

  unreadTitle: {
    fontWeight: '800',
  },

  notificationTime: {
    fontSize: 10,
    color: '#8B93A1',
  },

  notificationMessage: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#7B8495',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFA51F',
    marginRight: 10,
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