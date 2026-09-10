import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { loginUser } from '../services/auth';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { loginUser, loginWithGoogleCredential } from '../services/auth';

type UserRole = 'admin' | 'teacher' | 'parent';

export default function LoginScreen() {
  const params = useLocalSearchParams<{
    role?: string;
  }>();

  const role: UserRole =
    params.role === 'teacher'
      ? 'teacher'
      : params.role === 'parent'
      ? 'parent'
      : 'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleName = {
    admin: 'Administrator',
    teacher: 'Teacher',
    parent: 'Parent',
  }[role];
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  const redirectBasedOnRole = (role: string) => {
    if (role === 'admin') {
      router.replace('/admin-dashboard');
    } else if (role === 'parent') {
      router.replace('/parent-dashboard');
    } else {
      router.replace('/(tabs)');
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
      Alert.alert('Missing Password', 'Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      await loginUser(email, password);

      /*
       * FOR NOW
       * We are allowing the selected role to determine
       * where the user goes after login.
       *
       * Later we will check the real role stored in Firestore
       * before allowing access.
       */

     if (role === 'admin') {
  router.replace('/admin' as any);
} else if (role === 'teacher') {
  // Teacher dashboard will be added later
  router.replace('/login' as any);
} else {
  // Parent dashboard will be added later
  router.replace('/login' as any);
}
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
        setError(
          'Too many login attempts. Please try again later.'
        );
      } else {
        setError('Unable to login. Please try again.');
      }
      const { role } = await loginUser(email, password);
      redirectBasedOnRole(role);
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push({
      pathname: '/register',
      params: {
        role,
      },
    });
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

  const goToRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push({
      pathname: '/forgot-password',
      params: {
        role,
      },
    });
  };

  const handleChangeRole = () => {
    router.replace('/');
  };

  const goHome = () => router.replace('/');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Back / Change role */}

        <Pressable
          style={styles.backButton}
          onPress={handleChangeRole}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#061B5E"
          />

          <Text style={styles.backText}>
            Change role
          </Text>
        </Pressable>

        {/* Header */}

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
          <Ionicons name="arrow-back" size={20} color="#1A237E" />
          <Text style={styles.backText}>Back to Home</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={
                role === 'admin'
                  ? 'person-outline'
                  : role === 'teacher'
                  ? 'school-outline'
                  : 'people-outline'
              }
              size={38}
              color="#1555E8"
            />
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={38} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Sign in as {roleName}
          </Text>
          <Text style={styles.title}>TrustEdConnect</Text>
          <Text style={styles.subtitle}>Portal Access</Text>
        </View>

        {/* Form */}

        <View style={styles.form}>
        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.description}>
            Sign in to continue to your account.
          </Text>

          {/* Email */}

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={21}
              color="#777777"
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#777" />
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

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={21}
              color="#777777"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={21}
                  color="#777"
                />
              </Pressable>
            </View>
          </View>

          {/* Error */}

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#D93025"
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Forgot password */}

          <Pressable
            style={styles.forgotButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>
              Forgot password?
            </Text>
          <Pressable style={styles.forgotButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* Login */}

          <Pressable
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <Text style={styles.loginText}>
                  Sign in as {roleName}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                />
              </>
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          {/* Divider */}

          <View style={styles.dividerContainer}>
            <View style={styles.line} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.line} />
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google */}

          <Pressable
            style={styles.googleButton}
            disabled={loading}
            style={[
              styles.googleButton,
              (!request || googleLoading) && styles.disabledGoogleButton,
            ]}
            onPress={handleGoogleLogin}
            disabled={!request || googleLoading || loading}
          >
            <Text style={styles.googleG}>
              G
            </Text>

            <Text style={styles.googleText}>
              Continue with Google
            </Text>
            {googleLoading ? (
              <ActivityIndicator color="#222" />
            ) : (
              <>
                <Text style={styles.googleG}>G</Text>
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          {/* Register */}

          <View style={styles.registerContainer}>
            <Text style={styles.registerQuestion}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerText}>
                Create account
              </Text>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Pressable onPress={goToRegister}>
              <Text style={styles.registerLink}>Create new account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    gap: 6,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A237E',
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
  },

  form: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
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
    color: '#777',
    fontSize: 14,
  },
  registerLink: {
    color: '#1A237E',
    fontSize: 14,
    fontWeight: '700',
  },
});