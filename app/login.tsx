import React, { useEffect, useState } from 'react';

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

import * as WebBrowser from 'expo-web-browser';

import * as Google from 'expo-auth-session/providers/google';

import { loginUser, loginWithGoogleCredential } from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /*
   * Replace these with your Google OAuth client IDs.
   *
   * We'll configure these after the basic email/password
   * authentication is working.
   */
  const [request, response, promptAsync] =
    Google.useAuthRequest({
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

      iosClientId:
        process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,

      androidClientId:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (
        response?.type !== 'success' ||
        !response.authentication?.idToken
      ) {
        return;
      }

      try {
        setGoogleLoading(true);

        await loginWithGoogleCredential(
          response.authentication.idToken,
          response.authentication.accessToken
        );

        router.replace('/(tabs)');
      } catch (error: any) {
        console.error('Google login error:', error);

        Alert.alert(
          'Google Sign-In Failed',
          getFirebaseErrorMessage(error)
        );
      } finally {
        setGoogleLoading(false);
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email.');
      return;
    }

    if (!password) {
      Alert.alert(
        'Missing Password',
        'Please enter your password.'
      );
      return;
    }

    try {
      setLoading(true);

      await loginUser(email, password);

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);

      Alert.alert(
        'Login Failed',
        getFirebaseErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await promptAsync();
    } catch (error: any) {
      console.error('Google prompt error:', error);

      Alert.alert(
        'Google Sign-In Failed',
        'Unable to open Google Sign-In.'
      );

      setGoogleLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="school"
              size={38}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.title}>
            TrustEdConnect
          </Text>

          <Text style={styles.subtitle}>
            Teacher Portal
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.welcome}>
            Welcome Back
          </Text>

          <Text style={styles.description}>
            Sign in to continue to your teacher account.
          </Text>

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
                placeholder="Enter your password"
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

          {/* Forgot password */}
          <Pressable
            style={styles.forgotButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          </Pressable>

          {/* Login */}
          <Pressable
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                Sign In
              </Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              OR
            </Text>

            <View style={styles.divider} />
          </View>

          {/* Google */}
          <Pressable
            style={[
              styles.googleButton,
              (!request ||
                googleLoading) &&
                styles.disabledGoogleButton,
            ]}
            onPress={handleGoogleLogin}
            disabled={
              !request ||
              googleLoading ||
              loading
            }
          >
            {googleLoading ? (
              <ActivityIndicator color="#222" />
            ) : (
              <>
                <Text style={styles.googleG}>
                  G
                </Text>

                <Text style={styles.googleText}>
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          {/* Register */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={goToRegister}
            >
              <Text style={styles.registerLink}>
                Create new account
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/**
 * Convert Firebase errors into
 * user-friendly messages.
 */
function getFirebaseErrorMessage(
  error: any
) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/user-not-found':
      return 'No account exists with this email.';

    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Please check your internet connection.';

    case 'auth/popup-closed-by-user':
      return 'Google Sign-In was cancelled.';

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
    justifyContent: 'center',
    padding: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A237E',
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    marginTop: 4,
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

  welcome: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 7,
    marginBottom: 24,
    lineHeight: 20,
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

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '600',
  },

  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },

  googleButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledGoogleButton: {
    opacity: 0.5,
  },

  googleG: {
    fontSize: 20,
    fontWeight: '800',
    marginRight: 10,
  },

  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  registerContainer: {
    alignItems: 'center',
    marginTop: 25,
  },

  registerText: {
    color: '#777',
    fontSize: 14,
  },

  registerLink: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
});