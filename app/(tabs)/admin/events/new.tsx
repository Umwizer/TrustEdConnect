import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import AdminHeader from '../../../../components/admin/AdminHeader';

const eventTypes = [
  'School',
  'Academic',
  'Meeting',
  'Holiday',
];

export default function NewEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] =
    useState('School');

  const [showTypes, setShowTypes] =
    useState(false);

  const handleCreateEvent = () => {
    if (!title.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the event title.'
      );
      return;
    }

    if (!date.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter the event date.'
      );
      return;
    }

    Alert.alert(
      'Event Created',
      'The event has been created successfully.',
      [
        {
          text: 'OK',
          onPress: () =>
            router.replace('/admin/events' as any),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="New Event" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Back */}

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#061B5E"
          />

          <Text style={styles.backText}>
            Back to Events
          </Text>
        </Pressable>

        {/* Heading */}

        <View style={styles.heading}>
          <Text style={styles.title}>
            Create New Event
          </Text>

          <Text style={styles.subtitle}>
            Add an important school event or activity
          </Text>
        </View>

        {/* Form */}

        <View style={styles.formCard}>
          {/* Event title */}

          <FormLabel
            label="Event Title"
            required
          />

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Parent-Teacher Meeting"
            placeholderTextColor="#9AA3B2"
          />

          {/* Description */}

          <FormLabel label="Description" />

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the event..."
            placeholderTextColor="#9AA3B2"
            multiline
            textAlignVertical="top"
          />

          {/* Event type */}

          <FormLabel
            label="Event Type"
            required
          />

          <View style={styles.selectWrapper}>
            <Pressable
              style={styles.select}
              onPress={() =>
                setShowTypes(!showTypes)
              }
            >
              <Text style={styles.selectText}>
                {eventType}
              </Text>

              <Ionicons
                name={
                  showTypes
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={18}
                color="#061B5E"
              />
            </Pressable>

            {showTypes && (
              <View style={styles.typeDropdown}>
                {eventTypes.map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.typeOption,
                      eventType === type &&
                        styles.selectedTypeOption,
                    ]}
                    onPress={() => {
                      setEventType(type);
                      setShowTypes(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        eventType === type &&
                          styles.selectedTypeText,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Date and time */}

          <View style={styles.twoColumnRow}>
            <View style={styles.column}>
              <FormLabel
                label="Date"
                required
              />

              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#7B8497"
                />

                <TextInput
                  style={styles.iconInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9AA3B2"
                />
              </View>
            </View>

            <View style={styles.column}>
              <FormLabel label="Time" />

              <View style={styles.inputWithIcon}>
                <Ionicons
                  name="time-outline"
                  size={19}
                  color="#7B8497"
                />

                <TextInput
                  style={styles.iconInput}
                  value={time}
                  onChangeText={setTime}
                  placeholder="09:00 AM - 12:00 PM"
                  placeholderTextColor="#9AA3B2"
                />
              </View>
            </View>
          </View>

          {/* Location */}

          <FormLabel label="Location" />

          <View style={styles.inputWithIcon}>
            <Ionicons
              name="location-outline"
              size={19}
              color="#7B8497"
            />

            <TextInput
              style={styles.iconInput}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. School Main Hall"
              placeholderTextColor="#9AA3B2"
            />
          </View>

          {/* Information */}

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#1555E8"
            />

            <Text style={styles.infoText}>
              The event will appear in the school
              calendar and can later be shared with
              teachers and parents.
            </Text>
          </View>

          {/* Buttons */}

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() =>
                router.back()
              }
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={styles.createButton}
              onPress={handleCreateEvent}
            >
              <Ionicons
                name="checkmark"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.createText}>
                Create Event
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* =====================================================
   FORM LABEL
   ===================================================== */

type FormLabelProps = {
  label: string;
  required?: boolean;
};

function FormLabel({
  label,
  required,
}: FormLabelProps) {
  return (
    <Text style={styles.label}>
      {label}

      {required && (
        <Text style={styles.required}>
          {' '}*
        </Text>
      )}
    </Text>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    padding: 18,
  },

  content: {
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 18,
  },

  backText: {
    color: '#061B5E',
    fontSize: 13,
    fontWeight: '700',
  },

  heading: {
    marginBottom: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#172033',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#7B8497',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E9EDF4',
    padding: 22,
  },

  label: {
    fontSize: 13,
    color: '#30394A',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 5,
  },

  required: {
    color: '#E5484D',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    borderRadius: 11,
    paddingHorizontal: 14,
    color: '#172033',
    fontSize: 14,
    backgroundColor: '#FAFBFD',
    marginBottom: 18,
  },

  textArea: {
    height: 105,
    paddingTop: 13,
  },

  selectWrapper: {
    position: 'relative',
    zIndex: 20,
    marginBottom: 18,
  },

  select: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    borderRadius: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFBFD',
  },

  selectText: {
    color: '#172033',
    fontSize: 14,
  },

  typeDropdown: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3EC',
    borderRadius: 11,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  selectedTypeOption: {
    backgroundColor: '#EEF3FF',
  },

  typeOptionText: {
    color: '#4B5567',
    fontSize: 13,
  },

  selectedTypeText: {
    color: '#1555E8',
    fontWeight: '700',
  },

  twoColumnRow: {
    flexDirection: 'row',
    gap: 15,
  },

  column: {
    flex: 1,
  },

  inputWithIcon: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDE3EC',
    borderRadius: 11,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFBFD',
    marginBottom: 18,
  },

  iconInput: {
    flex: 1,
    marginLeft: 8,
    color: '#172033',
    fontSize: 14,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF3FF',
    borderRadius: 12,
    padding: 14,
    marginTop: 3,
    marginBottom: 22,
  },

  infoText: {
    flex: 1,
    color: '#44516A',
    fontSize: 12,
    lineHeight: 18,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  cancelButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D5DBE5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#4B5567',
    fontSize: 14,
    fontWeight: '700',
  },

  createButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 11,
    backgroundColor: '#1555E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  createText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});