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
          </View>

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Sign in as {roleName}
          </Text>
        </View>

        {/* Form */}

        <View style={styles.form}>

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
          </Pressable>

          {/* Login */}

          <Pressable
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
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
            )}
          </Pressable>

          {/* Divider */}

          <View style={styles.dividerContainer}>
            <View style={styles.line} />

            <Text style={styles.orText}>
              OR
            </Text>

            <View style={styles.line} />
          </View>

          {/* Google */}

          <Pressable
            style={styles.googleButton}
            disabled={loading}
          >
            <Text style={styles.googleG}>
              G
            </Text>

            <Text style={styles.googleText}>
              Continue with Google
            </Text>
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
            </Pressable>
          </View>
        </View>

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