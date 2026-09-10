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

import { useRouter } from 'expo-router';

import { registerUser } from '../services/auth';

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert(
        'Missing Name',
        'Please enter your full name.'
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        'Missing Email',
        'Please enter your email.'
      );
      return;
    }

    if (!password) {
      Alert.alert(
        'Missing Password',
        'Please create a password.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Passwords Do Not Match',
        'Please make sure both passwords are the same.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        fullName,
        email,
        password
      );

      Alert.alert(
        'Account Created',
        'Your teacher account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error(
        'Registration error:',
        error
      );

      Alert.alert(
        'Registration Failed',
        getFirebaseErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#1A237E"
          />

          <Text style={styles.backText}>
            Back to login
          </Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="person-add"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Create your TrustEdConnect teacher account
          </Text>
        </View>

        <View style={styles.card}>
          {/* Full name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <Pressable
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color="#777"
                />
              </Pressable>
            </View>
          </View>

          {/* Confirm password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
              />

              <Pressable
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={21}
                  color="#777"
                />
              </Pressable>
            </View>
          </View>

          {/* Create account */}
          <Pressable
            style={[
              styles.registerButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                Create Account
              </Text>
            )}
          </Pressable>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace('/login')
              }
            >
              <Text style={styles.loginLink}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getFirebaseErrorMessage(
  error: any
) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Please choose a stronger password.';

    case 'auth/network-request-failed':
      return 'Please check your internet connection.';

    default:
      return (
        error?.message ||
        'Something went wrong. Please try again.'
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  backText: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 7,
  },

  header: {
    alignItems: 'center',
    marginBottom: 25,
  },

  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A237E',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#222',
  },

  registerButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginContainer: {
    alignItems: 'center',
    marginTop: 24,
  },

  loginText: {
    color: '#777',
    fontSize: 14,
  },

  loginLink: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
});