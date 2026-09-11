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

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

import AdminHeader from '../../../../components/admin/AdminHeader';
import { db } from '../../../../services/firebase';

export default function AddStudentScreen() {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dateOfBirth, setDateOfBirth] =
    useState('');
  const [gender, setGender] = useState('');
  const [className, setClassName] =
    useState('');
  const [bloodGroup, setBloodGroup] =
    useState('');

  const [parentName, setParentName] =
    useState('');
  const [parentPhone, setParentPhone] =
    useState('');
  const [parentEmail, setParentEmail] =
    useState('');

  const [saving, setSaving] = useState(false);

  const [showGenderOptions, setShowGenderOptions] =
    useState(false);

  const [showBloodGroupOptions, setShowBloodGroupOptions] =
    useState(false);

  /**
   * Create a real student in Firestore.
   */
  const handleAddStudent = async () => {
    const cleanFullName = fullName.trim();
    const cleanStudentId = studentId.trim();
    const cleanDateOfBirth =
      dateOfBirth.trim();
    const cleanGender = gender.trim();
    const cleanClassName =
      className.trim();
    const cleanBloodGroup =
      bloodGroup.trim();

    const cleanParentName =
      parentName.trim();
    const cleanParentPhone =
      parentPhone.trim();
    const cleanParentEmail =
      parentEmail.trim().toLowerCase();

    // Required fields
    if (!cleanFullName) {
      Alert.alert(
        'Missing information',
        'Please enter the student full name.'
      );
      return;
    }

    if (!cleanStudentId) {
      Alert.alert(
        'Missing information',
        'Please enter the student ID.'
      );
      return;
    }

    if (!cleanGender) {
      Alert.alert(
        'Missing information',
        'Please select the student gender.'
      );
      return;
    }

    if (!cleanClassName) {
      Alert.alert(
        'Missing information',
        'Please enter the student class.'
      );
      return;
    }

    if (!cleanParentName) {
      Alert.alert(
        'Missing information',
        'Please enter the parent or guardian name.'
      );
      return;
    }

    if (!cleanParentPhone) {
      Alert.alert(
        'Missing information',
        'Please enter the parent or guardian phone number.'
      );
      return;
    }

    try {
      setSaving(true);

      /**
       * Create a new document in:
       *
       * students/{generatedDocumentId}
       */
      const studentRef = await addDoc(
        collection(db, 'students'),
        {
          fullName: cleanFullName,

          studentId: cleanStudentId,

          dateOfBirth:
            cleanDateOfBirth || null,

          gender: cleanGender,

          className: cleanClassName,

          bloodGroup:
            cleanBloodGroup || null,

          parentName: cleanParentName,

          parentPhone: cleanParentPhone,

          parentEmail:
            cleanParentEmail || null,

          status: 'active',

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),
        }
      );

      console.log(
        'Student created:',
        studentRef.id
      );

      Alert.alert(
        'Student added',
        `${cleanFullName} has been added successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(
                '/admin/students' as any
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        'Error adding student:',
        error
      );

      Alert.alert(
        'Unable to add student',
        error?.message ||
          'Something went wrong while saving the student.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (saving) {
      return;
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <AdminHeader title="Add Student" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Page heading */}
          <View style={styles.heading}>
            <Text style={styles.title}>
              Add Student
            </Text>

            <Text style={styles.subtitle}>
              Enter the student's information below.
            </Text>
          </View>

          {/* Student information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#061B5E"
                />
              </View>

              <View>
                <Text style={styles.cardTitle}>
                  Student Information
                </Text>

                <Text style={styles.cardSubtitle}>
                  Basic information about the student
                </Text>
              </View>
            </View>

            <InputField
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter student's full name"
              required
            />

            <InputField
              label="Student ID"
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter student ID"
              required
              autoCapitalize="characters"
            />

            <InputField
              label="Date of birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
            />

            {/* Gender */}
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>

            <Pressable
              style={styles.selectInput}
              onPress={() =>
                setShowGenderOptions(
                  !showGenderOptions
                )
              }
            >
              <Text
                style={[
                  styles.selectText,
                  !gender &&
                    styles.placeholderText,
                ]}
              >
                {gender || 'Select gender'}
              </Text>

              <Ionicons
                name={
                  showGenderOptions
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
                color="#6B7280"
              />
            </Pressable>

            {showGenderOptions && (
              <View style={styles.optionsContainer}>
                {['Male', 'Female'].map(
                  (option) => (
                    <Pressable
                      key={option}
                      style={styles.option}
                      onPress={() => {
                        setGender(option);
                        setShowGenderOptions(
                          false
                        );
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          gender === option &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {option}
                      </Text>

                      {gender === option && (
                        <Ionicons
                          name="checkmark"
                          size={19}
                          color="#061B5E"
                        />
                      )}
                    </Pressable>
                  )
                )}
              </View>
            )}

            <InputField
              label="Class"
              value={className}
              onChangeText={setClassName}
              placeholder="e.g. Primary 4 A"
              required
            />

            {/* Blood group */}
            <Text style={styles.label}>
              Blood group
            </Text>

            <Pressable
              style={styles.selectInput}
              onPress={() =>
                setShowBloodGroupOptions(
                  !showBloodGroupOptions
                )
              }
            >
              <Text
                style={[
                  styles.selectText,
                  !bloodGroup &&
                    styles.placeholderText,
                ]}
              >
                {bloodGroup ||
                  'Select blood group'}
              </Text>

              <Ionicons
                name={
                  showBloodGroupOptions
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
                color="#6B7280"
              />
            </Pressable>

            {showBloodGroupOptions && (
              <View style={styles.optionsContainer}>
                {[
                  'A+',
                  'A-',
                  'B+',
                  'B-',
                  'AB+',
                  'AB-',
                  'O+',
                  'O-',
                ].map((option) => (
                  <Pressable
                    key={option}
                    style={styles.option}
                    onPress={() => {
                      setBloodGroup(option);
                      setShowBloodGroupOptions(
                        false
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        bloodGroup === option &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>

                    {bloodGroup === option && (
                      <Ionicons
                        name="checkmark"
                        size={19}
                        color="#061B5E"
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Parent information */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <Ionicons
                  name="people-outline"
                  size={21}
                  color="#061B5E"
                />
              </View>

              <View>
                <Text style={styles.cardTitle}>
                  Parent / Guardian
                </Text>

                <Text style={styles.cardSubtitle}>
                  Contact information for the parent or guardian
                </Text>
              </View>
            </View>

            <InputField
              label="Parent / guardian name"
              value={parentName}
              onChangeText={setParentName}
              placeholder="Enter parent or guardian name"
              required
            />

            <InputField
              label="Phone number"
              value={parentPhone}
              onChangeText={setParentPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              required
            />

            <InputField
              label="Email"
              value={parentEmail}
              onChangeText={setParentEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Database information */}
          <View style={styles.infoCard}>
            <Ionicons
              name="cloud-done-outline"
              size={22}
              color="#061B5E"
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                Database
              </Text>

              <Text style={styles.infoText}>
                This student will be saved to the
                Firestore students collection and
                will immediately appear in the
                Students list.
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <Pressable
              style={[
                styles.cancelButton,
                saving &&
                  styles.disabledButton,
              ]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.saveButton,
                saving &&
                  styles.disabledSaveButton,
              ]}
              onPress={handleAddStudent}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.saveText}>
                    Add Student
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable input                                                             */
/* -------------------------------------------------------------------------- */

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  required?: boolean;
  keyboardType?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: InputFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}{' '}
        {required && (
          <Text style={styles.required}>
            *
          </Text>
        )}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  heading: {
    marginBottom: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#061B5E',
  },

  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061B5E',
  },

  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 3,
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 7,
  },

  required: {
    color: '#EF4444',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },

  selectInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  selectText: {
    fontSize: 14,
    color: '#111827',
  },

  placeholderText: {
    color: '#9CA3AF',
  },

  optionsContainer: {
    borderWidth: 1,
    borderColor: '#D9DEE8',
    borderRadius: 10,
    marginTop: -9,
    marginBottom: 17,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },

  option: {
    minHeight: 45,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F4',
  },

  optionText: {
    fontSize: 14,
    color: '#374151',
  },

  selectedOptionText: {
    color: '#061B5E',
    fontWeight: '700',
  },

  infoCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  infoContent: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#061B5E',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },

  buttons: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },

  saveButton: {
    flex: 1.4,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#061B5E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveText: {
    marginLeft: 6,
    fontSize: 14,
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