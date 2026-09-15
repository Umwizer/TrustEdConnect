import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { resetPassword } from '../services/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if email is empty
    if (!cleanEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your email address.'
      );
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(cleanEmail);

      Alert.alert(
        'Check Your Email',
        'We have sent you a password reset link. Please check your email inbox.',
        [
          {
            text: 'Back to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error: any) {
      console.log('Password reset error:', error);

      let message = 'Something went wrong. Please try again.';

      if (error?.code === 'auth/user-not-found') {
        message = 'No account was found with this email address.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error?.code === 'auth/too-many-requests') {
        message =
          'Too many attempts. Please wait a while and try again.';
      } else if (error?.code === 'auth/network-request-failed') {
        message =
          'Network error. Please check your internet connection.';
      }

      Alert.alert('Password Reset Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>

        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>

          <Text style={styles.title}>
            Forgot Password?
          </Text>

          <Text style={styles.subtitle}>
            Don't worry. Enter the email address associated
            with your account and we'll send you a link to
            reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <Text style={styles.label}>
            Email Address
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9E9E9E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleResetPassword}
          />

          {/* Reset Button */}
          <Pressable
            style={[
              styles.resetButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.resetButtonText}>
                Send Reset Link
              </Text>
            )}
          </Pressable>

        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Remember your password?{' '}
          </Text>

          <Pressable
            onPress={() => router.replace('/login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>
              Sign In
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          TrustEdConnect • Teacher Portal
        </Text>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  backText: {
    fontSize: 16,
    color: '#1A237E',
    fontWeight: '600',
  },

  header: {
    alignItems: 'center',
    marginTop: 45,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  icon: {
    fontSize: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
    textAlign: 'center',
    maxWidth: 340,
  },

  form: {
    marginTop: 40,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222222',
    backgroundColor: '#FAFAFA',
  },

  resetButton: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.7,
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  loginText: {
    color: '#666666',
    fontSize: 14,
  },

  loginLink: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '700',
  },

  footer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 12,
  },
});