import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { loginUser, loginWithGoogleCredential } from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const redirectBasedOnRole = (role: string) => {
    if (role === 'admin') {
      router.replace('/admin' as any);
    } else if (role === 'parent') {
      router.replace('/parent' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type !== 'success' || !response.authentication?.idToken) {
        return;
      }

      try {
        setGoogleLoading(true);
        const { role } = await loginWithGoogleCredential(
          response.authentication.idToken,
          response.authentication.accessToken
        );
        redirectBasedOnRole(role);
      } catch (error: any) {
        console.error('Google login error:', error);
        Alert.alert('Google Sign-In Failed', getFirebaseErrorMessage(error));
      } finally {
        setGoogleLoading(false);
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleLogin = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      const { role } = await loginUser(email, password);
      redirectBasedOnRole(role);
    } catch (err: any) {
      console.log('Login error:', err);

      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setError('Incorrect email or password.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err?.code === 'auth/too-many-requests') {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Unable to login. Please try again.');
      }
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
      Alert.alert('Google Sign-In Failed', 'Unable to open Google Sign-In.');
      setGoogleLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const goHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={goHome}>
            <Ionicons name="arrow-back" size={22} color="#061B5E" />
            <Text style={styles.backText}>Back to Home</Text>
          </Pressable>

          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={38} color="#1555E8" />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={21} color="#777777" />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading && !googleLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={21} color="#777777" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading && !googleLoading}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={21}
                  color="#777777"
                />
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={18} color="#D93025" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable style={styles.forgotButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>

            <Pressable
              style={[
                styles.googleButton,
                (!request || googleLoading) && styles.disabledGoogleButton,
              ]}
              onPress={handleGoogleLogin}
              disabled={!request || googleLoading || loading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#222" />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </>
              )}
            </Pressable>

            <View style={styles.registerContainer}>
              <Text style={styles.registerQuestion}>Don't have an account?</Text>
              <Pressable onPress={handleRegister} disabled={loading || googleLoading}>
                <Text style={styles.registerText}>Create account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getFirebaseErrorMessage(error: any) {
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
      return error?.message || 'Something went wrong. Please try again.';
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 7,
  },
  backText: {
    color: '#061B5E',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 35,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E9F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#061B5E',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#777777',
    fontSize: 15,
    marginTop: 7,
  },
  form: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  inputContainer: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 11,
    color: '#222222',
    fontSize: 15,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    padding: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    color: '#D93025',
    fontSize: 13,
    marginLeft: 8,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 20,
  },
  forgotText: {
    color: '#1555E8',
    fontSize: 13,
    fontWeight: '700',
  },
  loginButton: {
    height: 58,
    backgroundColor: '#1555E8',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  orText: {
    color: '#999999',
    fontSize: 12,
    marginHorizontal: 14,
  },
  googleButton: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 15,
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
    color: '#4285F4',
    marginRight: 12,
  },
  googleText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    gap: 5,
  },
  registerQuestion: {
    color: '#777777',
    fontSize: 13,
  },
  registerText: {
    color: '#1555E8',
    fontSize: 13,
    fontWeight: '700',
  },
});