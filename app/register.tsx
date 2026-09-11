import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
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
      : 'parent';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  const redirectBasedOnRole = (selectedRole: string) => {
    if (selectedRole === 'admin') {
      router.replace('/admin' as any);
    } else if (selectedRole === 'parent') {
      router.replace('/parent-dashboard' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const handleRegister = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await registerUser(fullName, email, password, role);

      Alert.alert(
        'Account Created',
        `Your ${role} account has been created successfully.`,
        [
          {
            text: 'Continue',
            onPress: () => redirectBasedOnRole(role),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error?.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error?.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (error?.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(error?.message || 'Something went wrong while creating your account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login');
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
            <Pressable style={styles.backButton} onPress={handleBackToLogin} disabled={loading}>
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

            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#777777" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#777777" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#777777" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} disabled={loading}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#777777"
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#777777" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color="#777777"
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Account Type</Text>
              <Pressable style={styles.selectContainer} onPress={() => setShowRoleModal(true)} disabled={loading}>
                <Ionicons name="people-outline" size={20} color="#777777" />
                <Text style={styles.selectText}>{roleName}</Text>
                <Ionicons name="chevron-down-outline" size={20} color="#777777" />
              </Pressable>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Create {roleName} Account</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </Pressable>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Pressable onPress={handleBackToLogin} disabled={loading}>
                  <Text style={styles.loginLink}>Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showRoleModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowRoleModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Account Type</Text>
            {(['parent', 'teacher', 'admin'] as UserRole[]).map((r) => (
              <Pressable
                key={r}
                style={[styles.modalOption, role === r && styles.modalOptionActive]}
                onPress={() => {
                  setRole(r);
                  setShowRoleModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, role === r && styles.modalOptionTextActive]}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
                {role === r && <Ionicons name="checkmark-circle" size={22} color="#1A237E" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

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
  },
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
  selectContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9DDE7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#222222',
  },
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
  registerButton: {
    height: 54,
    backgroundColor: '#061B5E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
    gap: 5,
  },
  loginText: {
    color: '#777777',
    fontSize: 14,
  },
  loginLink: {
    color: '#061B5E',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F7FB',
  },
  modalOptionActive: {
    backgroundColor: '#E8EAF6',
    borderWidth: 1,
    borderColor: '#1A237E',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: '#1A237E',
    fontWeight: '700',
  },
});