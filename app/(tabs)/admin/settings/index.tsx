import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from 'firebase/auth';

import {
  changeUserPassword,
} from '../../../../services/auth';

import AdminHeader from '../../../../components/admin/AdminHeader';

import {
  auth,
  db,
} from '../../../../services/firebase';

type UserSettings = {
  notificationsEnabled: boolean;
  messageNotifications: boolean;
  eventNotifications: boolean;
};

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [role, setRole] =
    useState('admin');

  const [settings, setSettings] =
    useState<UserSettings>({
      notificationsEnabled: true,
      messageNotifications: true,
      eventNotifications: true,
    });

  const [saving, setSaving] =
    useState(false);

  const [
    passwordModalVisible,
    setPasswordModalVisible,
  ] = useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('');

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /*
   * Load current user's settings.
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          router.replace('/login' as any);
          return;
        }

        setEmail(user.email || '');

        setFullName(
          user.displayName ||
            'Administrator'
        );

        const userRef = doc(
          db,
          'users',
          user.uid
        );

        const snapshot =
          await getDoc(userRef);

        if (snapshot.exists()) {
          const data =
            snapshot.data();

          setFullName(
            data.fullName ||
              data.name ||
              user.displayName ||
              'Administrator'
          );

          setRole(
            data.role || 'admin'
          );

          setSettings({
            notificationsEnabled:
              data.settings
                ?.notificationsEnabled !== false,

            messageNotifications:
              data.settings
                ?.messageNotifications !== false,

            eventNotifications:
              data.settings
                ?.eventNotifications !== false,
          });
        }
      } catch (error) {
        console.error(
          'Error loading settings:',
          error
        );

        Alert.alert(
          'Error',
          'Unable to load your settings.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  /*
   * Save settings to Firestore.
   */
  const updateSetting = async (
    key: keyof UserSettings,
    value: boolean
  ) => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const previousSettings = settings;

    const updatedSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(updatedSettings);

    try {
      setSaving(true);

      await updateDoc(
        doc(db, 'users', user.uid),
        {
          settings: updatedSettings,
        }
      );
    } catch (error) {
      console.error(
        'Error saving setting:',
        error
      );

      setSettings(
        previousSettings
      );

      Alert.alert(
        'Error',
        'Unable to save this setting.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Change password.
   */
  const handleChangePassword =
    async () => {
      if (!currentPassword.trim()) {
        Alert.alert(
          'Current password required',
          'Please enter your current password.'
        );
        return;
      }

      if (!newPassword.trim()) {
        Alert.alert(
          'New password required',
          'Please enter a new password.'
        );
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert(
          'Password too short',
          'Your new password must contain at least 6 characters.'
        );
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        Alert.alert(
          'Passwords do not match',
          'The new password and confirmation password must be the same.'
        );
        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {
        Alert.alert(
          'Invalid password',
          'Your new password must be different from your current password.'
        );
        return;
      }

      try {
        setChangingPassword(true);

        await changeUserPassword(
          currentPassword,
          newPassword
        );

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setPasswordModalVisible(false);

        Alert.alert(
          'Password changed',
          'Your password has been changed successfully.'
        );
      } catch (error: any) {
        console.error(
          'Change password error:',
          error
        );

        let message =
          'Unable to change your password.';

        switch (error?.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
            message =
              'Your current password is incorrect.';
            break;

          case 'auth/weak-password':
            message =
              'Your new password is too weak. Use at least 6 characters.';
            break;

          case 'auth/requires-recent-login':
            message =
              'For security, please log out and log in again before changing your password.';
            break;

          case 'auth/too-many-requests':
            message =
              'Too many attempts. Please try again later.';
            break;

          case 'auth/user-disabled':
            message =
              'This account has been disabled.';
            break;

          case 'auth/network-request-failed':
            message =
              'Please check your internet connection and try again.';
            break;

          default:
            if (
              error?.message
            ) {
              message =
                error.message;
            }
        }

        Alert.alert(
          'Password change failed',
          message
        );
      } finally {
        setChangingPassword(false);
      }
    };

  /*
   * Close password modal.
   */
  const closePasswordModal =
    () => {
      if (changingPassword) {
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setShowCurrentPassword(
        false
      );

      setShowNewPassword(false);

      setShowConfirmPassword(
        false
      );

      setPasswordModalVisible(
        false
      );
    };

  /*
   * Logout.
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);

              router.replace(
                '/login' as any
              );
            } catch (error) {
              console.error(
                'Logout error:',
                error
              );

              Alert.alert(
                'Logout failed',
                'Unable to log out. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#061B5E"
        />

        <Text
          style={styles.loadingText}
        >
          Loading settings...
        </Text>
      </View>
    );
  }

  const initials =
    fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (name) =>
          name
            .charAt(0)
            .toUpperCase()
      )
      .join('') || 'A';

  return (
    <View style={styles.container}>
      <AdminHeader title="Settings" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Profile */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Account
          </Text>

          <View style={styles.card}>
            <View
              style={styles.profileRow}
            >
              <View style={styles.avatar}>
                <Text
                  style={
                    styles.avatarText
                  }
                >
                  {initials}
                </Text>
              </View>

              <View
                style={styles.profileInfo}
              >
                <Text
                  style={
                    styles.profileName
                  }
                >
                  {fullName}
                </Text>

                <Text
                  style={
                    styles.profileEmail
                  }
                >
                  {email}
                </Text>

                <View
                  style={styles.roleBadge}
                >
                  <Text
                    style={
                      styles.roleText
                    }
                  >
                    {role}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Notifications
          </Text>

          <View style={styles.card}>
            <SettingRow
              icon="notifications-outline"
              title="Notifications"
              description="Receive notifications about activity in your account."
              value={
                settings.notificationsEnabled
              }
              onValueChange={(value) =>
                updateSetting(
                  'notificationsEnabled',
                  value
                )
              }
            />

            <View
              style={styles.separator}
            />

            <SettingRow
              icon="chatbubble-outline"
              title="Message notifications"
              description="Receive notifications when you receive a new message."
              value={
                settings.messageNotifications &&
                settings.notificationsEnabled
              }
              onValueChange={(value) =>
                updateSetting(
                  'messageNotifications',
                  value
                )
              }
            />

            <View
              style={styles.separator}
            />

            <SettingRow
              icon="calendar-outline"
              title="Event notifications"
              description="Receive notifications about school events."
              value={
                settings.eventNotifications &&
                settings.notificationsEnabled
              }
              onValueChange={(value) =>
                updateSetting(
                  'eventNotifications',
                  value
                )
              }
            />

            {saving && (
              <View
                style={
                  styles.savingContainer
                }
              >
                <ActivityIndicator
                  size="small"
                  color="#061B5E"
                />

                <Text
                  style={
                    styles.savingText
                  }
                >
                  Saving...
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Security
          </Text>

          <View style={styles.card}>
            <Pressable
              style={styles.actionRow}
              onPress={() =>
                setPasswordModalVisible(
                  true
                )
              }
            >
              <View
                style={styles.actionIcon}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#061B5E"
                />
              </View>

              <View
                style={
                  styles.actionContent
                }
              >
                <Text
                  style={
                    styles.actionTitle
                  }
                >
                  Change password
                </Text>

                <Text
                  style={
                    styles.actionDescription
                  }
                >
                  Update the password used to sign in to your account.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Text
            style={styles.sectionTitle}
          >
            Account actions
          </Text>

          <View style={styles.card}>
            <Pressable
              style={styles.logoutRow}
              onPress={handleLogout}
            >
              <View
                style={styles.logoutIcon}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color="#FF3B30"
                />
              </View>

              <View
                style={
                  styles.actionContent
                }
              >
                <Text
                  style={
                    styles.logoutTitle
                  }
                >
                  Logout
                </Text>

                <Text
                  style={
                    styles.actionDescription
                  }
                >
                  Sign out of your TrustEdConnect account.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={21}
                color="#FF3B30"
              />
            </Pressable>
          </View>
        </View>

        <Text style={styles.version}>
          TrustEdConnect • Settings
        </Text>
      </ScrollView>

      {/* Change password modal */}
      <Modal
        visible={
          passwordModalVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          closePasswordModal
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View
            style={styles.modalContainer}
          >
            <View
              style={styles.modalHeader}
            >
              <View>
                <Text
                  style={
                    styles.modalTitle
                  }
                >
                  Change password
                </Text>

                <Text
                  style={
                    styles.modalDescription
                  }
                >
                  Enter your current password and choose a new password.
                </Text>
              </View>

              <Pressable
                onPress={
                  closePasswordModal
                }
                disabled={
                  changingPassword
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            <PasswordInput
              label="Current password"
              value={
                currentPassword
              }
              onChangeText={
                setCurrentPassword
              }
              placeholder="Enter current password"
              visible={
                showCurrentPassword
              }
              onToggle={() =>
                setShowCurrentPassword(
                  !showCurrentPassword
                )
              }
            />

            <PasswordInput
              label="New password"
              value={newPassword}
              onChangeText={
                setNewPassword
              }
              placeholder="Enter new password"
              visible={
                showNewPassword
              }
              onToggle={() =>
                setShowNewPassword(
                  !showNewPassword
                )
              }
            />

            <PasswordInput
              label="Confirm new password"
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              placeholder="Confirm new password"
              visible={
                showConfirmPassword
              }
              onToggle={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            />

            <Text
              style={styles.passwordHint}
            >
              Password must contain at least 6 characters.
            </Text>

            <View
              style={styles.modalButtons}
            >
              <Pressable
                style={[
                  styles.cancelButton,
                  changingPassword &&
                    styles.disabledButton,
                ]}
                onPress={
                  closePasswordModal
                }
                disabled={
                  changingPassword
                }
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.changeButton,
                  changingPassword &&
                    styles.disabledSaveButton,
                ]}
                onPress={
                  handleChangePassword
                }
                disabled={
                  changingPassword
                }
              >
                {changingPassword ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.changeButtonText
                      }
                    >
                      Change password
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Setting row                                                                */
/* -------------------------------------------------------------------------- */

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (
    value: boolean
  ) => void;
};

function SettingRow({
  icon,
  title,
  description,
  value,
  onValueChange,
}: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={22}
          color="#061B5E"
        />
      </View>

      <View
        style={styles.settingContent}
      >
        <Text
          style={styles.settingTitle}
        >
          {title}
        </Text>

        <Text
          style={
            styles.settingDescription
          }
        >
          {description}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={
          onValueChange
        }
        trackColor={{
          false: '#D1D5DB',
          true: '#A7B8E8',
        }}
        thumbColor={
          value
            ? '#061B5E'
            : '#F4F4F5'
        }
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Password input                                                             */
/* -------------------------------------------------------------------------- */

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (
    value: string
  ) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
};

function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
  visible,
  onToggle,
}: PasswordInputProps) {
  return (
    <View
      style={styles.passwordGroup}
    >
      <Text
        style={styles.inputLabel}
      >
        {label}
      </Text>

      <View
        style={
          styles.passwordInputContainer
        }
      >
        <TextInput
          style={
            styles.passwordInput
          }
          value={value}
          onChangeText={
            onChangeText
          }
          placeholder={
            placeholder
          }
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          style={styles.eyeButton}
          onPress={onToggle}
        >
          <Ionicons
            name={
              visible
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={21}
            color="#6B7280"
          />
        </Pressable>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

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
    paddingBottom: 50,
  },

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061B5E',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E7ECFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#061B5E',
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#061B5E',
    textTransform: 'capitalize',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  settingContent: {
    flex: 1,
    marginRight: 10,
  },

  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  settingDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
  },

  separator: {
    height: 1,
    backgroundColor: '#EEF0F4',
    marginVertical: 8,
  },

  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  savingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6B7280',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 65,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  actionContent: {
    flex: 1,
    marginRight: 10,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  actionDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6B7280',
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 65,
  },

  logoutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  logoutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 4,
  },

  version: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: '#9CA3AF',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#061B5E',
    marginBottom: 7,
  },

  modalDescription: {
    maxWidth: 370,
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },

  passwordGroup: {
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 7,
  },

  passwordInputContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
  },

  eyeButton: {
    width: 45,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },

  passwordHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: -3,
    marginBottom: 5,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },

  changeButton: {
    flex: 1.4,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#061B5E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  changeButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  disabledButton: {
    opacity: 0.5,
  },

  disabledSaveButton: {
    opacity: 0.7,
  },
});