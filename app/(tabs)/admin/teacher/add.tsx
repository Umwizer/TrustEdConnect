import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AdminHeader from '../../../../components/admin/AdminHeader';
import { db } from '../../../../services/firebase';

type EventStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled';

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] =
    useState('');

  const [type, setType] = useState('');
  const [status, setStatus] =
    useState<EventStatus>('upcoming');

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  // ============================
  // SAVE EVENT
  // ============================

  const saveEvent = async () => {
    setError('');

    // Required fields
    if (!title.trim()) {
      setError(
        'Please enter the event title.'
      );
      return;
    }

    if (!date.trim()) {
      setError(
        'Please enter the event date.'
      );
      return;
    }

    if (!type.trim()) {
      setError(
        'Please enter the event type.'
      );
      return;
    }

    try {
      setSaving(true);

      await addDoc(
        collection(db, 'events'),
        {
          title: title.trim(),

          description:
            description.trim(),

          date: date.trim(),

          time: time.trim(),

          location:
            location.trim(),

          type: type.trim(),

          status,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      Alert.alert(
        'Event created',
        'The event has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(
                '/admin/events' as any
              );
            },
          },
        ]
      );
    } catch (saveError) {
      console.error(
        'Error creating event:',
        saveError
      );

      setError(
        'Could not save the event. Please check your internet connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>

      <AdminHeader title="New Event" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >

          {/* Page title */}

          <View style={styles.titleSection}>

            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.back()
              }
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#061B5E"
              />
            </Pressable>

            <View style={styles.titleTextContainer}>

              <Text style={styles.pageTitle}>
                Create New Event
              </Text>

              <Text style={styles.pageSubtitle}>
                Add a new event to the school calendar.
              </Text>

            </View>

          </View>

          {/* Error */}

          {error ? (
            <View style={styles.errorContainer}>

              <Ionicons
                name="alert-circle-outline"
                size={21}
                color="#C62828"
              />

              <Text style={styles.errorText}>
                {error}
              </Text>

            </View>
          ) : null}

          {/* Form */}

          <View style={styles.formCard}>

            {/* Title */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Event Title
                <Text style={styles.required}>
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter event title"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />

            </View>

            {/* Type */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Event Type
                <Text style={styles.required}>
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={type}
                onChangeText={setType}
                placeholder="e.g. Meeting, Sports, Academic"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />

            </View>

            {/* Description */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                value={description}
                onChangeText={
                  setDescription
                }
                placeholder="Describe the event..."
                placeholderTextColor="#9AA3B2"
                style={[
                  styles.input,
                  styles.textArea,
                ]}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />

            </View>

            {/* Date */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Date
                <Text style={styles.required}>
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="e.g. 20 September 2026"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />

            </View>

            {/* Time */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Time
              </Text>

              <TextInput
                value={time}
                onChangeText={setTime}
                placeholder="e.g. 10:00 AM"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />

            </View>

            {/* Location */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Location
              </Text>

              <TextInput
                value={location}
                onChangeText={
                  setLocation
                }
                placeholder="e.g. School Hall"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
              />

            </View>

            {/* Status */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Status
              </Text>

              <View style={styles.statusOptions}>

                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'upcoming' &&
                      styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setStatus('upcoming')
                  }
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status ===
                        'upcoming' &&
                        styles.selectedStatusText,
                    ]}
                  >
                    Upcoming
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'completed' &&
                      styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setStatus('completed')
                  }
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status ===
                        'completed' &&
                        styles.selectedStatusText,
                    ]}
                  >
                    Completed
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'cancelled' &&
                      styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setStatus('cancelled')
                  }
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status ===
                        'cancelled' &&
                        styles.selectedStatusText,
                    ]}
                  >
                    Cancelled
                  </Text>
                </Pressable>

              </View>

            </View>

          </View>

          {/* Buttons */}

          <View style={styles.buttonContainer}>

            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                router.back()
              }
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                saving &&
                  styles.disabledButton,
              ]}
              onPress={saveEvent}
              disabled={saving}
            >

              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text style={styles.saveButtonText}>
                {saving
                  ? 'Saving...'
                  : 'Create Event'}
              </Text>

            </Pressable>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 24,
    paddingBottom: 40,
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E7EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  titleTextContainer: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#061B5E',
  },

  pageSubtitle: {
    fontSize: 13,
    color: '#7A8497',
    marginTop: 4,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F5C2C2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    flex: 1,
    color: '#C62828',
    fontSize: 13,
    marginLeft: 8,
    lineHeight: 19,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8EBF2',
    padding: 20,
  },

  field: {
    marginBottom: 19,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 8,
  },

  required: {
    color: '#D93025',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DCE1EA',
    borderRadius: 9,
    paddingHorizontal: 13,
    fontSize: 14,
    color: '#172033',
    backgroundColor: '#FFFFFF',
  },

  textArea: {
    height: 115,
    paddingTop: 13,
    paddingBottom: 13,
  },

  statusOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },

  statusOption: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#DCE1EA',
  },

  selectedStatus: {
    backgroundColor: '#061B5E',
    borderColor: '#061B5E',
  },

  statusOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667085',
  },

  selectedStatusText: {
    color: '#FFFFFF',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },

  cancelButton: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE1EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#667085',
    fontSize: 13,
    fontWeight: '600',
  },

  saveButton: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 9,
    backgroundColor: '#061B5E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  disabledButton: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});