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

type TeacherStatus =
  | 'active'
  | 'inactive';

export default function AddTeacherScreen() {
  /* =====================================================
     FORM STATE
     ===================================================== */

  const [fullName, setFullName] =
    useState('');

  const [teacherId, setTeacherId] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [gender, setGender] =
    useState('');

  const [department, setDepartment] =
    useState('');

  const [subject, setSubject] =
    useState('');

  const [status, setStatus] =
    useState<TeacherStatus>('active');

  /* =====================================================
     UI STATE
     ===================================================== */

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  /* =====================================================
     SAVE TEACHER
     ===================================================== */

  const saveTeacher = async () => {
    setError('');

    /* -------------------------
       Required fields
       ------------------------- */

    if (!fullName.trim()) {
      setError(
        'Please enter the teacher full name.'
      );
      return;
    }

    if (!teacherId.trim()) {
      setError(
        'Please enter the teacher ID.'
      );
      return;
    }

    if (!email.trim()) {
      setError(
        'Please enter the teacher email.'
      );
      return;
    }

    if (!subject.trim()) {
      setError(
        'Please enter the teacher subject.'
      );
      return;
    }

    try {
      setSaving(true);

      /* -------------------------
         Prepare teacher data
         ------------------------- */

      const teacherData = {
        fullName: fullName.trim(),

        teacherId: teacherId.trim(),

        email: email.trim().toLowerCase(),

        phone: phone.trim(),

        gender: gender.trim(),

        department: department.trim(),

        subject: subject.trim(),

        status,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      /* -------------------------
         Save to Firestore
         ------------------------- */

      const teacherRef =
        await addDoc(
          collection(db, 'teachers'),
          teacherData
        );

      console.log(
        'Teacher created:',
        teacherRef.id
      );

      /* -------------------------
         Success
         ------------------------- */

      Alert.alert(
        'Teacher Added',
        `${fullName.trim()} has been added successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(
                '/admin/teachers' as any
              );
            },
          },
        ]
      );
    } catch (saveError) {
      console.error(
        'Error adding teacher:',
        saveError
      );

      setError(
        'Could not save the teacher. Please check your internet connection and try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <View style={styles.container}>

      <AdminHeader title="Add Teacher" />

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

          {/* =================================================
             PAGE TITLE
             ================================================= */}

          <View style={styles.titleSection}>

            <Pressable
              style={styles.backButton}
              onPress={() =>
                router.back()
              }
              disabled={saving}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#061B5E"
              />
            </Pressable>

            <View
              style={
                styles.titleTextContainer
              }
            >

              <Text
                style={styles.pageTitle}
              >
                Add New Teacher
              </Text>

              <Text
                style={styles.pageSubtitle}
              >
                Add a teacher to the school
                database.
              </Text>

            </View>

          </View>

          {/* =================================================
             ERROR
             ================================================= */}

          {error ? (
            <View
              style={
                styles.errorContainer
              }
            >

              <Ionicons
                name="alert-circle-outline"
                size={21}
                color="#C62828"
              />

              <Text
                style={styles.errorText}
              >
                {error}
              </Text>

            </View>
          ) : null}

          {/* =================================================
             FORM
             ================================================= */}

          <View style={styles.formCard}>

            {/* -----------------------------------------------
               FULL NAME
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Full Name
                <Text
                  style={styles.required}
                >
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. John Doe"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
                autoCapitalize="words"
              />

            </View>

            {/* -----------------------------------------------
               TEACHER ID
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Teacher ID
                <Text
                  style={styles.required}
                >
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={teacherId}
                onChangeText={setTeacherId}
                placeholder="e.g. TCH-001"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
                autoCapitalize="characters"
              />

            </View>

            {/* -----------------------------------------------
               EMAIL
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Email
                <Text
                  style={styles.required}
                >
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. teacher@school.com"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

            </View>

            {/* -----------------------------------------------
               PHONE
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Phone Number
              </Text>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. +250 788 123 456"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
                keyboardType="phone-pad"
              />

            </View>

            {/* -----------------------------------------------
               GENDER
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Gender
              </Text>

              <View
                style={styles.optionRow}
              >

                <Pressable
                  style={[
                    styles.optionButton,
                    gender === 'Male' &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setGender('Male')
                  }
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gender === 'Male' &&
                        styles.selectedOptionText,
                    ]}
                  >
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.optionButton,
                    gender === 'Female' &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    setGender('Female')
                  }
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.optionText,
                      gender === 'Female' &&
                        styles.selectedOptionText,
                    ]}
                  >
                    Female
                  </Text>
                </Pressable>

              </View>

            </View>

            {/* -----------------------------------------------
               DEPARTMENT
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Department
              </Text>

              <TextInput
                value={department}
                onChangeText={setDepartment}
                placeholder="e.g. Science Department"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
              />

            </View>

            {/* -----------------------------------------------
               SUBJECT
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Subject
                <Text
                  style={styles.required}
                >
                  {' '}*
                </Text>
              </Text>

              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Mathematics"
                placeholderTextColor="#9AA3B2"
                style={styles.input}
                editable={!saving}
              />

            </View>

            {/* -----------------------------------------------
               STATUS
               ----------------------------------------------- */}

            <View style={styles.field}>

              <Text style={styles.label}>
                Status
              </Text>

              <View
                style={styles.statusOptions}
              >

                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'active' &&
                      styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setStatus('active')
                  }
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === 'active' &&
                        styles.selectedStatusText,
                    ]}
                  >
                    Active
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.statusOption,
                    status === 'inactive' &&
                      styles.selectedStatus,
                  ]}
                  onPress={() =>
                    setStatus('inactive')
                  }
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === 'inactive' &&
                        styles.selectedStatusText,
                    ]}
                  >
                    Inactive
                  </Text>
                </Pressable>

              </View>

            </View>

          </View>

          {/* =================================================
             BUTTONS
             ================================================= */}

          <View
            style={styles.buttonContainer}
          >

            {/* Cancel */}

            <Pressable
              style={[
                styles.cancelButton,
                saving &&
                  styles.disabledButton,
              ]}
              onPress={() =>
                router.back()
              }
              disabled={saving}
            >
              <Text
                style={
                  styles.cancelButtonText
                }
              >
                Cancel
              </Text>
            </Pressable>

            {/* Save */}

            <Pressable
              style={[
                styles.saveButton,
                saving &&
                  styles.disabledSaveButton,
              ]}
              onPress={saveTeacher}
              disabled={saving}
            >

              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color="#FFFFFF"
                />
              )}

              <Text
                style={styles.saveButtonText}
              >
                {saving
                  ? 'Saving...'
                  : 'Add Teacher'}
              </Text>

            </Pressable>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

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
    paddingBottom: 50,
  },

  /* =====================================================
     TITLE
     ===================================================== */

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

  /* =====================================================
     ERROR
     ===================================================== */

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

  /* =====================================================
     FORM
     ===================================================== */

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

  /* =====================================================
     GENDER
     ===================================================== */

  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: '#F5F7FB',
    borderWidth: 1,
    borderColor: '#DCE1EA',
  },

  selectedOption: {
    backgroundColor: '#061B5E',
    borderColor: '#061B5E',
  },

  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667085',
  },

  selectedOptionText: {
    color: '#FFFFFF',
  },

  /* =====================================================
     STATUS
     ===================================================== */

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

  /* =====================================================
     BUTTONS
     ===================================================== */

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
    opacity: 0.6,
  },

  disabledSaveButton: {
    opacity: 0.65,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

});