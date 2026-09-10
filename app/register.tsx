import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { registerUser } from '../services/auth';

type UserRole = 'admin' | 'teacher' | 'parent';

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ role?: string }>();

  /*
   * Get the role from the Login page.
   *
   * Examples:
   * /register?role=admin
   * /register?role=teacher
   * /register?role=parent
   *
   * If no role is provided, we use admin for now.
   */
  const role: UserRole =
    params.role === 'teacher'
      ? 'teacher'
      : params.role === 'parent'
      ? 'parent'
      : 'admin';

  const roleName =
    role === 'admin'
      ? 'Administrator'
      : role === 'teacher'
      ? 'Teacher'
      : 'Parent';

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // UI states
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /**
   * Create account
   */
  const handleRegister = async () => {
    setError('');

    // Full name validation
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    // Confirm password
    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);

      /**
       * Create Firebase Authentication account
       * and save the selected role in Firestore.
       */
      await registerUser(
        fullName,
        email,
        password,
        role
      );

      /**
       * Admin dashboard exists now.
       *
       * Teacher and Parent dashboards will be added later.
       */
      if (role === 'admin') {
        router.replace('/admin' as any);
      } else if (role === 'teacher') {
        router.replace('/login' as any);
      } else {
        router.replace('/login' as any);
      }
    } catch (error: any) {
      console.log('Registration error:', error);

      if (error?.code === 'auth/email-already-in-use') {
        setError(
          'An account with this email already exists.'
        );
      } else if (error?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error?.code === 'auth/weak-password') {
        setError(
          'Password is too weak. Use at least 6 characters.'
        );
      } else if (error?.code === 'auth/network-request-failed') {
        setError(
          'Network error. Please check your internet connection.'
        );
      } else {
        setError(
          error?.message ||
            'Something went wrong while creating your account.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Go back to the correct Login page.
   */
  const handleBackToLogin = () => {
    router.replace({
      pathname: '/login',
      params: {
        role,
      },
    });
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* =========================
                BACK BUTTON
            ========================== */}
            <Pressable
              style={styles.backButton}
              onPress={handleBackToLogin}
              disabled={submitting}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#061B5E"
              />

              <Text style={styles.backText}>
                Back to Login
              </Text>
            </Pressable>

            {/* =========================
                HEADER
            ========================== */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={
                    role === 'admin'
                      ? 'shield-checkmark-outline'
                      : role === 'teacher'
                      ? 'school-outline'
                      : 'people-outline'
                  }
                  size={34}
                  color="#FFFFFF"
                />
              </View>

              <Text style={styles.title}>
                Create {roleName} Account
              </Text>

              <Text style={styles.subtitle}>
                Create your {roleName.toLowerCase()} account
                to continue to TrustEdConnect.
              </Text>
            </View>

            {/* =========================
                FORM
            ========================== */}
            <View style={styles.form}>

              {/* FULL NAME */}
              <Text style={styles.label}>
                Full Name
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#777777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!submitting}
                />
              </View>

              {/* EMAIL */}
              <Text style={styles.label}>
                Email Address
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#777777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />
              </View>

              {/* PASSWORD */}
              <Text style={styles.label}>
                Password
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#777777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={submitting}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={21}
                    color="#777777"
                  />
                </Pressable>
              </View>

              {/* CONFIRM PASSWORD */}
              <Text style={styles.label}>
                Confirm Password
              </Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#777777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!submitting}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={submitting}
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-outline'
                        : 'eye-off-outline'
                    }
                    size={21}
                    color="#777777"
                  />
                </Pressable>
              </View>

              {/* ROLE INFORMATION */}
              <View style={styles.roleBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#061B5E"
                />

                <Text style={styles.roleText}>
                  You are creating a{' '}
                  <Text style={styles.roleBold}>
                    {roleName}
                  </Text>{' '}
                  account.
                </Text>
              </View>

              {/* ERROR */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#D32F2F"
                  />

                  <Text style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* CREATE ACCOUNT BUTTON */}
              <Pressable
                style={[
                  styles.registerButton,
                  submitting &&
                    styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>
                      Create {roleName} Account
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </Pressable>

              {/* LOGIN LINK */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?
                </Text>

                <Pressable
                  onPress={handleBackToLogin}
                  disabled={submitting}
                >
                  <Text style={styles.loginLink}>
                    Login
                  </Text>
                </Pressable>
              </View>

            </View>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
    backgroundColor: '#F5F7FB',
  },

  /* BACK BUTTON */

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },

  backText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#061B5E',
    fontWeight: '600',
  },

  /* HEADER */

  header: {
    alignItems: 'center',
    marginBottom: 25,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#061B5E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#061B5E',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
    maxWidth: 340,
  },

  /* FORM */

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 7,
    marginTop: 12,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9DDE7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 10,
    fontSize: 15,
    color: '#222222',
  },

  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 5,
  },

  /* ROLE BOX */

  roleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 17,
  },

  roleText: {
    flex: 1,
    marginLeft: 8,
    color: '#405070',
    fontSize: 13,
    lineHeight: 19,
  },

  roleBold: {
    color: '#061B5E',
    fontWeight: '700',
  },

  /* ERROR */

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 15,
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    color: '#D32F2F',
    fontSize: 13,
    lineHeight: 19,
  },

  /* REGISTER BUTTON */

  registerButton: {
    height: 54,
    backgroundColor: '#061B5E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  /* LOGIN */

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#777777',
    fontSize: 14,
  },

  loginLink: {
    color: '#061B5E',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },
});