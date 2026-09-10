import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const Colors = {
  bg: '#0A1F44',
  card: '#132C5C',
  white: '#FFFFFF',
  gray: '#94A3B8',
  border: 'rgba(255,255,255,0.1)',
  primary: '#3B82F6',
  accent: '#F59E0B',
};

const ROLES = [
  {
    key: 'parent',
    icon: 'heart-outline' as const,
    label: 'Parent',
    headline: 'Never miss what matters',
    desc: "See your child's attendance, grades and school news the moment they happen.",
    points: ['Attendance alerts in real time', 'Report cards on your phone', 'Message teachers directly'],
  },
  {
    key: 'teacher',
    icon: 'school-outline' as const,
    label: 'Teacher',
    headline: 'Less paperwork, more teaching',
    desc: 'Mark attendance and record grades in seconds, from any device.',
    points: ['One-tap attendance', 'Simple grade entry', 'Chat with parents instantly'],
  },
  {
    key: 'admin',
    icon: 'business-outline' as const,
    label: 'Admin',
    headline: 'Run your school with confidence',
    desc: 'One dashboard to see attendance trends and performance across every class.',
    points: ['School-wide reports', 'Trend tracking', 'Manage staff access'],
  },
];

const STEPS = [
  { icon: 'person-add-outline' as const, title: 'Create your account', desc: 'Takes less than a minute, no paperwork.' },
  { icon: 'link-outline' as const, title: 'Connect to your school', desc: 'Enter your school code or get invited.' },
  { icon: 'notifications-outline' as const, title: 'Stay in the loop', desc: 'Get updates the moment something happens.' },
];

const TESTIMONIALS = [
  { quote: "Attendance is marked in seconds and parents are notified instantly. It's a game-changer for our school.", name: 'Principal, Kigali Academy', role: 'Administrator' },
  { quote: 'I finally know what is happening at school without calling the teacher every day.', name: 'Aline U.', role: 'Parent' },
  { quote: 'Grading used to take my whole evening. Now it takes ten minutes.', name: 'Mr. Bosco K.', role: 'Teacher' },
];

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(start);
      }
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return value;
}

export default function HomeScreen() {
  const [activeRole, setActiveRole] = useState('parent');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const role = ROLES.find((r) => r.key === activeRole)!;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const students = useCountUp(1250);
  const parents = useCountUp(980);
  const teachers = useCountUp(65);

  const switchRole = (key: string) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setActiveRole(key);
  };

  const goToLogin = () => router.push('/login');
  const goToRegister = () => router.push('/register');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.logo}>
            TrustEd<Text style={{ color: Colors.accent }}>Connect</Text>
          </Text>
          <TouchableOpacity onPress={goToLogin} style={styles.loginPill}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Empowering Schools.{'\n'}
            <Text style={{ color: Colors.primary }}>Connecting Futures.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            One simple app for admins, teachers, and parents to stay connected.
          </Text>

          <TouchableOpacity onPress={goToRegister} activeOpacity={0.85} style={styles.primaryBtnWrap}>
            <LinearGradient
              colors={[Colors.primary, '#1E3A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Get Started Free</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.trustRow}>
            <View style={styles.avatarStack}>
              {['#F59E0B', '#3B82F6', '#14B8A6', '#EC4899'].map((c, i) => (
                <View key={c} style={[styles.avatarDot, { backgroundColor: c, marginLeft: i === 0 ? 0 : -10 }]} />
              ))}
            </View>
            <Text style={styles.trustText}>Trusted by 50+ schools across Rwanda</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value={`${students.toLocaleString()}+`} label="Students" />
          <Stat value={`${parents.toLocaleString()}+`} label="Parents" />
          <Stat value={`${teachers.toLocaleString()}+`} label="Teachers" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who are you?</Text>
          <Text style={styles.sectionSubtitle}>Tap a role to see what TrustEdConnect does for you</Text>

          <View style={styles.roleRow}>
            {ROLES.map((r) => {
              const active = r.key === activeRole;
              return (
                <TouchableOpacity
                  key={r.key}
                  onPress={() => switchRole(r.key)}
                  style={[styles.rolePill, active && styles.rolePillActive]}
                >
                  <Ionicons name={r.icon} size={16} color={active ? Colors.white : Colors.gray} />
                  <Text style={[styles.roleText, active && styles.roleTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Animated.View style={[styles.roleCard, { opacity: fadeAnim }]}>
            <Text style={styles.roleHeadline}>{role.headline}</Text>
            <Text style={styles.roleDesc}>{role.desc}</Text>
            <View style={{ gap: 10, marginTop: 16 }}>
              {role.points.map((p) => (
                <View key={p} style={styles.pointRow}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.accent} />
                  <Text style={styles.pointText}>{p}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        <View style={[styles.section, { backgroundColor: '#081832' }]}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.sectionSubtitle}>Three simple steps. No training needed.</Text>

          <View style={{ gap: 14, marginTop: 20 }}>
            {STEPS.map((s, i) => (
              <View key={s.title} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
                <Ionicons name={s.icon} size={22} color={Colors.primary} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trusted by Educators</Text>

          <View style={styles.card}>
            <Ionicons name="chatbubble-ellipses" size={28} color={Colors.accent} style={{ marginBottom: 14 }} />
            <Text style={styles.quote}>"{TESTIMONIALS[testimonialIndex].quote}"</Text>
            <Text style={styles.quoteAuthor}>{TESTIMONIALS[testimonialIndex].name}</Text>
            <Text style={styles.quoteRole}>{TESTIMONIALS[testimonialIndex].role}</Text>

            <View style={styles.dotsRow}>
              {TESTIMONIALS.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setTestimonialIndex(i)}>
                  <View style={[styles.dot, i === testimonialIndex && styles.dotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <LinearGradient colors={['#1E3A8A', '#3B82F6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to transform your school?</Text>
            <Text style={styles.ctaDesc}>Join hundreds of families already using TrustEdConnect.</Text>
            <TouchableOpacity style={styles.ctaBtn} onPress={goToRegister}>
              <Text style={styles.ctaBtnText}>Create Free Account</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
            </TouchableOpacity>
            <Text style={styles.ctaSubtext}>No credit card required. Free 14-day trial.</Text>
          </LinearGradient>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            TrustEd<Text style={{ color: Colors.accent }}>Connect</Text>
          </Text>
          <Text style={styles.footerCopyright}>© 2026 TrustEdConnect. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: { fontSize: 20, fontWeight: '800', color: Colors.white },
  loginPill: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  loginText: { color: Colors.white, fontWeight: '700', fontSize: 13 },

  hero: { paddingHorizontal: 24, paddingVertical: 16, alignItems: 'center' },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  heroSubtitle: { fontSize: 15, color: Colors.gray, textAlign: 'center', marginBottom: 26 },

  primaryBtnWrap: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 22 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  primaryBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },

  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarStack: { flexDirection: 'row' },
  avatarDot: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: Colors.bg },
  trustText: { color: Colors.gray, fontSize: 12.5 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
  },
  statItem: { alignItems: 'center' },
  statValue: { color: Colors.white, fontSize: 20, fontWeight: '800' },
  statLabel: { color: Colors.gray, fontSize: 12, marginTop: 4 },

  section: { paddingHorizontal: 20, paddingVertical: 34 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: Colors.white, textAlign: 'center', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13.5, color: Colors.gray, textAlign: 'center', marginBottom: 20 },

  roleRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rolePillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roleText: { color: Colors.gray, fontSize: 13, fontWeight: '600' },
  roleTextActive: { color: Colors.white },

  roleCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 22 },
  roleHeadline: { color: Colors.white, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  roleDesc: { color: Colors.gray, fontSize: 13.5, lineHeight: 20 },
  pointRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pointText: { color: Colors.white, fontSize: 13.5, fontWeight: '500' },

  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { color: Colors.bg, fontWeight: '800', fontSize: 13 },
  stepTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  stepDesc: { color: Colors.gray, fontSize: 12, marginTop: 2 },

  card: { backgroundColor: Colors.card, borderRadius: 20, padding: 24, alignItems: 'center' },
  quote: { color: Colors.white, fontSize: 15, fontStyle: 'italic', lineHeight: 23, textAlign: 'center', marginBottom: 16 },
  quoteAuthor: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  quoteRole: { color: Colors.gray, fontSize: 12, marginTop: 2, marginBottom: 16 },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.accent, width: 18 },

  ctaSection: { paddingHorizontal: 20, paddingVertical: 10, marginBottom: 10 },
  ctaCard: { borderRadius: 24, padding: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: 10 },
  ctaDesc: { fontSize: 14, color: '#BFDBFE', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 14,
    marginBottom: 12,
  },
  ctaBtnText: { color: Colors.bg, fontWeight: '800', fontSize: 15 },
  ctaSubtext: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },

  footer: { alignItems: 'center', paddingVertical: 30 },
  footerBrand: { fontSize: 16, fontWeight: '800', color: Colors.white, marginBottom: 8 },
  footerCopyright: { fontSize: 12, color: Colors.gray },
});