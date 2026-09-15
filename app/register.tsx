// app/register.tsx
import React, { useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { registerUser } from '../services/auth';

type UserRole = 'admin' | 'teacher' | 'parent';

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ role?: string }>();

  const initialRole: UserRole =
    params.role === 'teacher'
      ? 'teacher'
      : params.role === 'admin'
      ? 'admin'
      : params.role === 'parent'
      ? 'parent'
      : 'teacher';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const roleName =
    role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Teacher' : 'Parent';

  const roleOptions: { value: UserRole; label: string; icon: any }[] = [
    { value: 'teacher', label: 'Teacher', icon: 'school-outline' },
    { value: 'admin', label: 'Admin', icon: 'shield-checkmark-outline' },
    { value: 'parent', label: 'Parent', icon: 'people-outline' },
  ];

  const handleRegister = async () => {
    setError('');
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return setError('Enter a valid email.');

    if (!password) return setError('Please enter a password.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    try {
      setSubmitting(true);
      await registerUser(fullName, email, password, role);

      if (role === 'admin') {
        router.replace('/admin' as any);
      } else {
        router.replace('/login' as any);
      }
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err?.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err?.code === 'auth/network-request-failed') {
        setError('Network error. Check your connection.');
      } else {
        setError(err?.message || 'Something went wrong.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace({
      pathname: '/login',
      params: { role },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Pressable
              style={styles.backButton}
              onPress={handleBackToLogin}
              disabled={submitting}
            >
              <Ionicons name="arrow-back" size={23} color="#061B5E" />
              <Text style={styles.backText}>Back to Login</Text>
            </Pressable>

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
              <Text style={styles.title}>Create {roleName} Account</Text>
              <Text style={styles.subtitle}>
                Create your {roleName.toLowerCase()} account to continue to TrustEdConnect.
              </Text>
            </View>

            <Text style={styles.label}>I am a</Text>
            <View style={styles.rolePicker}>
              {roleOptions.map(opt => (
                <Pressable
                  key={opt.value}
                  style={[
                    styles.roleOption,
                    role === opt.value && styles.roleOptionActive,
                  ]}
                  onPress={() => setRole(opt.value)}
                  disabled={submitting}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={role === opt.value ? '#FFFFFF' : '#061B5E'}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      role === opt.value && styles.roleOptionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#777" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  editable={!submitting}
                />
              </View>

              <Text style={styles.label}>Email Address</Text>
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
                  editable={!submitting}
                />
              </View>

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
                  editable={!submitting}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={21}
                    color="#777"
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#777" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!submitting}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={21}
                    color="#777"
                  />
                </Pressable>
              </View>

              <View style={styles.roleBox}>
                <Ionicons name="information-circle-outline" size={20} color="#061B5E" />
                <Text style={styles.roleText}>
                  You are creating a <Text style={styles.roleBold}>{roleName}</Text> account.
                </Text>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                style={[styles.registerButton, submitting && styles.disabledButton]}
                onPress={handleRegister}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>
                      Create {roleName} Account
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </Pressable>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Pressable onPress={handleBackToLogin} disabled={submitting}>
                  <Text style={styles.loginLink}>Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  keyboardContainer: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingBottom: 30 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  backText: { marginLeft: 8, fontSize: 15, color: '#061B5E', fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 20 },
  iconContainer: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#061B5E',
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
  },
  title: { fontSize: 25, fontWeight: '700', color: '#061B5E', textAlign: 'center' },
  subtitle: {
    fontSize: 14, color: '#777', textAlign: 'center',
    marginTop: 8, lineHeight: 21, maxWidth: 340,
  },
  form: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 7, marginTop: 12 },
  inputContainer: {
    height: 52, borderWidth: 1, borderColor: '#D9DDE7',
    borderRadius: 12, backgroundColor: '#FFFFFF',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  input: { flex: 1, height: '100%', marginLeft: 10, fontSize: 15, color: '#222' },
  rolePicker: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  roleOption: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#EAF0FF', borderWidth: 2, borderColor: 'transparent',
  },
  roleOptionActive: { backgroundColor: '#061B5E', borderColor: '#061B5E' },
  roleOptionText: { fontSize: 13, fontWeight: '700', color: '#061B5E' },
  roleOptionTextActive: { color: '#FFFFFF' },
  roleBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EAF0FF', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 11, marginTop: 17,
  },
  roleText: { flex: 1, marginLeft: 8, color: '#405070', fontSize: 13 },
  roleBold: { color: '#061B5E', fontWeight: '700' },
  errorContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF1F1', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 15,
  },
  errorText: { flex: 1, marginLeft: 8, color: '#D32F2F', fontSize: 13 },
  registerButton: {
    height: 54, backgroundColor: '#061B5E', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', marginTop: 20, gap: 8,
  },
  disabledButton: { opacity: 0.7 },
  registerButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  loginContainer: {
    flexDirection: 'row', justifyContent: 'center',
    marginTop: 22, gap: 5,
  },
  loginText: { color: '#777', fontSize: 14 },
  loginLink: { color: '#061B5E', fontSize: 14, fontWeight: '700' },
});