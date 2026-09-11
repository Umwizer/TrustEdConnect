// app/login.tsx
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
import { loginUser } from '../services/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      // 🎯 GO STRAIGHT TO TEACHER DASHBOARD
      router.replace('/(tabs)/teacher/dashboard' as any);
    } catch (error: any) {
      Alert.alert('Login Failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>TrustEdConnect</Text>
          <Text style={styles.subtitle}>Teacher Portal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.description}>
            Sign in to continue to your teacher account.
          </Text>

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
              />
            </View>
          </View>

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

          <Pressable
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign in as Teacher</Text>
            )}
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/register' as any)}>
              <Text style={styles.registerLink}>Create new account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 28 },
  logoContainer: {
    width: 76, height: 76, borderRadius: 22,
    backgroundColor: '#1A237E',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1A237E' },
  subtitle: { fontSize: 15, color: '#777', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  welcome: { fontSize: 23, fontWeight: '700', color: '#222' },
  description: { fontSize: 14, color: '#777', marginTop: 7, marginBottom: 24 },
  inputGroup: { marginBottom: 17 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: '#222' },
  loginButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  registerContainer: { alignItems: 'center', marginTop: 20 },
  registerText: { color: '#777', fontSize: 14 },
  registerLink: {
    color: '#1A237E', fontSize: 14, fontWeight: '700', marginTop: 6,
  },
});