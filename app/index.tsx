import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Colors = {
  bg: '#0A1F44',
  cardBg: '#132C5C',
  white: '#FFFFFF',
  textGray: '#94A3B8',
  border: 'rgba(255,255,255,0.1)',
  primary: '#3B82F6',
  accent: '#F59E0B',
  purple: '#8B5CF6',
  teal: '#14B8A6',
  pink: '#EC4899',
};

const AUDIENCES = [
  {
    key: 'parents',
    icon: 'heart-outline' as const,
    title: 'For Parents',
    desc: "Never miss a moment. Get real-time visibility into your child's attendance, academic results, and school announcements directly on your phone.",
    features: ['Instant Attendance Alerts', 'View Report Cards', 'Direct Messaging'],
    color: Colors.purple,
  },
  {
    key: 'teachers',
    icon: 'school-outline' as const,
    title: 'For Teachers',
    desc: 'Spend less time on paperwork and more time teaching. Record attendance, enter marks, and communicate with parents effortlessly.',
    features: ['One-Tap Attendance', 'Grade Management', 'Parent Communication'],
    color: Colors.teal,
  },
  {
    key: 'admin',
    icon: 'business-outline' as const,
    title: 'For Administration',
    desc: "Get a bird's-eye view of your entire institution. Monitor performance, track attendance trends, and manage your school from one central hub.",
    features: ['School-Wide Analytics', 'Automated Reports', 'Role-Based Access'],
    color: Colors.pink,
  },
];

export default function HomeScreen() {
  const goToLogin = () => router.push('/login');
  const goToRegister = () => router.push('/register');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroMesh1} />
          <View style={styles.heroMesh2} />

          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="school" size={20} color={Colors.bg} />
              </View>
              <Text style={styles.logoText}>
                TrustEd<Text style={styles.logoHighlight}>Connect</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={goToLogin}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={14} color={Colors.accent} />
              <Text style={styles.heroBadgeText}>The Future of School Management</Text>
            </View>
            <Text style={styles.heroTitle}>
              Empowering Schools.{'\n'}
              <Text style={styles.heroTitleAccent}>Connecting Futures.</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              TrustEdConnect unifies administrators, teachers, and parents into a single, powerful platform. Experience seamless communication, real-time tracking, and complete peace of mind.
            </Text>
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.primaryBtn} onPress={goToRegister}>
                <Text style={styles.primaryBtnText}>Get Started for Free</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={goToLogin}>
                <Text style={styles.secondaryBtnText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mockupContainer}>
            <View style={styles.mockupTopBar}>
              <View style={styles.mockupDots}>
                <View style={[styles.mockupDot, { backgroundColor: '#EF4444' }]} />
                <View style={[styles.mockupDot, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.mockupDot, { backgroundColor: '#10B981' }]} />
              </View>
              <View style={styles.mockupProfile}>
                <View style={styles.mockupAvatar} />
                <View style={styles.mockupNameLine} />
              </View>
            </View>

            <View style={styles.mockupBody}>
              <View style={styles.mockupSidebar}>
                <Ionicons name="grid" size={16} color={Colors.primary} style={styles.mockupSideIcon} />
                <Ionicons name="people" size={16} color="rgba(255,255,255,0.2)" style={styles.mockupSideIcon} />
                <Ionicons name="school" size={16} color="rgba(255,255,255,0.2)" style={styles.mockupSideIcon} />
                <Ionicons name="settings" size={16} color="rgba(255,255,255,0.2)" style={styles.mockupSideIcon} />
              </View>

              <View style={styles.mockupMain}>
                <Text style={styles.mockupTitle}>Dashboard Overview</Text>
                <View style={styles.mockupStatsRow}>
                  <View style={styles.mockupStatCard}>
                    <View style={[styles.mockupStatIcon, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                      <Ionicons name="people" size={12} color={Colors.primary} />
                    </View>
                    <Text style={styles.mockupStatValue}>1,023</Text>
                    <Text style={styles.mockupStatLabel}>Students</Text>
                  </View>
                  <View style={styles.mockupStatCard}>
                    <View style={[styles.mockupStatIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                      <Ionicons name="school" size={12} color={Colors.purple} />
                    </View>
                    <Text style={styles.mockupStatValue}>48</Text>
                    <Text style={styles.mockupStatLabel}>Teachers</Text>
                  </View>
                  <View style={styles.mockupStatCard}>
                    <View style={[styles.mockupStatIcon, { backgroundColor: 'rgba(20, 184, 166, 0.2)' }]}>
                      <Ionicons name="person" size={12} color={Colors.teal} />
                    </View>
                    <Text style={styles.mockupStatValue}>890</Text>
                    <Text style={styles.mockupStatLabel}>Parents</Text>
                  </View>
                </View>
                <View style={styles.mockupChartContainer}>
                  <View style={styles.mockupChartHeader}>
                    <Text style={styles.mockupChartTitle}>Attendance Trends</Text>
                    <Text style={styles.mockupChartSubtitle}>This Month</Text>
                  </View>
                  <View style={styles.mockupChartBars}>
                    <View style={[styles.mockupBar, { height: '40%' }]} />
                    <View style={[styles.mockupBar, { height: '60%' }]} />
                    <View style={[styles.mockupBar, { height: '30%' }]} />
                    <View style={[styles.mockupBar, { height: '80%' }]} />
                    <View style={[styles.mockupBar, { height: '50%' }]} />
                    <View style={[styles.mockupBar, { height: '70%' }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1,250+</Text>
              <Text style={styles.statLabel}>Active Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>980+</Text>
              <Text style={styles.statLabel}>Connected Parents</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>65+</Text>
              <Text style={styles.statLabel}>Expert Teachers</Text>
            </View>
          </View>
        </View>

        <View style={styles.audienceSection}>
          <Text style={styles.sectionTitle}>Built for Every Role</Text>
          <Text style={styles.sectionSubtitle}>
            A tailored experience for everyone in the school ecosystem.
          </Text>

          {AUDIENCES.map((audience, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <View key={audience.key} style={[styles.audienceRow, isReversed && { flexDirection: 'row-reverse' }]}>
                <View style={styles.audienceTextContainer}>
                  <View style={[styles.audienceIconWrap, { backgroundColor: `${audience.color}20` }]}>
                    <Ionicons name={audience.icon} size={28} color={audience.color} />
                  </View>
                  <Text style={styles.audienceTitle}>{audience.title}</Text>
                  <Text style={styles.audienceDesc}>{audience.desc}</Text>
                  <View style={styles.audienceFeatures}>
                    {audience.features.map((feature) => (
                      <View key={feature} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={16} color={audience.color} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={[styles.audienceGraphic, { backgroundColor: `${audience.color}10` }]}>
                  <View style={[styles.graphicCircle, { backgroundColor: audience.color }]} />
                  <Ionicons name={audience.icon} size={80} color={`${audience.color}40`} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why Choose TrustEdConnect?</Text>
          <View style={styles.whyGrid}>
            <View style={styles.whyCard}>
              <View style={[styles.whyIconWrap, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                <Ionicons name="flash-outline" size={24} color="#F97316" />
              </View>
              <Text style={styles.whyTitle}>Real-time Updates</Text>
              <Text style={styles.whyDesc}>Know the moment attendance is marked or results are published. No more waiting.</Text>
            </View>
            <View style={styles.whyCard}>
              <View style={[styles.whyIconWrap, { backgroundColor: 'rgba(20, 184, 166, 0.15)' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#14B8A6" />
              </View>
              <Text style={styles.whyTitle}>Secure & Private</Text>
              <Text style={styles.whyDesc}>Enterprise-grade security ensuring your school's data is always protected.</Text>
            </View>
            <View style={styles.whyCard}>
              <View style={[styles.whyIconWrap, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Ionicons name="chatbubbles-outline" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.whyTitle}>Seamless Messaging</Text>
              <Text style={styles.whyDesc}>Direct communication channels between parents, teachers, and admin.</Text>
            </View>
            <View style={styles.whyCard}>
              <View style={[styles.whyIconWrap, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Ionicons name="bar-chart-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.whyTitle}>Powerful Analytics</Text>
              <Text style={styles.whyDesc}>Deep insights into student performance and school-wide trends.</Text>
            </View>
          </View>
        </View>

        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Trusted by Educators</Text>
          <View style={styles.trustCard}>
            <Ionicons name="chatbubble-ellipses" size={32} color={Colors.accent} style={styles.trustIcon} />
            <Text style={styles.trustQuote}>
              "TrustEdConnect has completely transformed how we communicate with parents. Attendance is marked in seconds, and parents are notified instantly. It's an absolute game-changer for our school."
            </Text>
            <View style={styles.trustAuthorRow}>
              <View style={styles.trustAvatar}>
                <Ionicons name="person" size={18} color={Colors.white} />
              </View>
              <View>
                <Text style={styles.trustAuthorName}>Principal, Kigali Academy</Text>
                <Text style={styles.trustAuthorRole}>Administrator</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <LinearGradient colors={['#1E3A8A', '#3B82F6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to transform your school?</Text>
            <Text style={styles.ctaDesc}>
              Join hundreds of schools already using TrustEdConnect to streamline their operations and connect with parents.
            </Text>
            <TouchableOpacity style={styles.ctaPrimaryBtn} onPress={goToRegister}>
              <Text style={styles.ctaPrimaryBtnText}>Create Free Account</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
            </TouchableOpacity>
            <Text style={styles.ctaSubtext}>No credit card required. Free 14-day trial.</Text>
          </LinearGradient>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLogoRow}>
            <View style={styles.footerLogoIcon}>
              <Ionicons name="school" size={16} color={Colors.white} />
            </View>
            <Text style={styles.footerBrand}>
              TrustEd<Text style={styles.logoHighlight}>Connect</Text>
            </Text>
          </View>
          <Text style={styles.footerCopyright}>© 2026 TrustEdConnect. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  heroSection: { backgroundColor: Colors.bg, paddingTop: 10, paddingBottom: 40, overflow: 'hidden' },
  heroMesh1: { position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  heroMesh2: { position: 'absolute', top: 200, left: -150, width: 350, height: 350, borderRadius: 175, backgroundColor: 'rgba(139, 92, 246, 0.1)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20, zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logoText: { fontSize: 20, fontWeight: '800', color: Colors.white },
  logoHighlight: { color: Colors.accent },
  loginBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  loginBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  heroContent: { paddingHorizontal: 24, paddingTop: 20, alignItems: 'center', zIndex: 10 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 185, 66, 0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(245, 185, 66, 0.3)' },
  heroBadgeText: { color: Colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  heroTitle: { fontSize: 38, fontWeight: '900', color: Colors.white, textAlign: 'center', lineHeight: 46, marginBottom: 20, letterSpacing: -1 },
  heroTitleAccent: { color: Colors.primary },
  heroSubtitle: { fontSize: 15, color: Colors.textGray, lineHeight: 24, textAlign: 'center', marginBottom: 32, paddingHorizontal: 10 },
  heroButtons: { width: '100%', flexDirection: 'row', gap: 12, marginBottom: 40 },
  primaryBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.white, paddingVertical: 16, borderRadius: 14 },
  primaryBtnText: { color: Colors.bg, fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },
  secondaryBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  mockupContainer: { marginHorizontal: 20, backgroundColor: Colors.cardBg, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 20, zIndex: 5 },
  mockupTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  mockupDots: { flexDirection: 'row', gap: 6 },
  mockupDot: { width: 10, height: 10, borderRadius: 5 },
  mockupProfile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mockupAvatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  mockupNameLine: { width: 60, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.1)' },
  mockupBody: { flexDirection: 'row', height: 180 },
  mockupSidebar: { width: 50, borderRightWidth: 1, borderRightColor: Colors.border, paddingVertical: 16, alignItems: 'center', gap: 16 },
  mockupSideIcon: { opacity: 0.8 },
  mockupMain: { flex: 1, padding: 16, gap: 12 },
  mockupTitle: { fontSize: 14, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  mockupStatsRow: { flexDirection: 'row', gap: 8 },
  mockupStatCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  mockupStatIcon: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  mockupStatValue: { fontSize: 14, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  mockupStatLabel: { fontSize: 10, color: Colors.textGray, fontWeight: '500' },
  mockupChartContainer: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  mockupChartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mockupChartTitle: { fontSize: 11, fontWeight: '700', color: Colors.white },
  mockupChartSubtitle: { fontSize: 9, color: Colors.textGray },
  mockupChartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 40 },
  mockupBar: { flex: 1, backgroundColor: Colors.primary, marginHorizontal: 2, borderRadius: 4, opacity: 0.8 },
  statsContainer: { paddingHorizontal: 20, marginTop: -30, marginBottom: 20, zIndex: 20 },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardBg, borderRadius: 20, paddingVertical: 24, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textGray, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  audienceSection: { paddingHorizontal: 20, paddingVertical: 30 },
  sectionTitle: { fontSize: 28, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 15, color: Colors.textGray, lineHeight: 22, textAlign: 'center', marginBottom: 40 },
  audienceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40, gap: 20 },
  audienceTextContainer: { flex: 1.2 },
  audienceIconWrap: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  audienceTitle: { fontSize: 20, fontWeight: '800', color: Colors.white, marginBottom: 10 },
  audienceDesc: { fontSize: 13.5, color: Colors.textGray, lineHeight: 21, marginBottom: 16 },
  audienceFeatures: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, fontWeight: '600', color: Colors.white },
  audienceGraphic: { flex: 0.8, height: 160, borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  graphicCircle: { position: 'absolute', width: 100, height: 100, borderRadius: 50, opacity: 0.15 },
  whySection: { backgroundColor: '#081832', paddingHorizontal: 20, paddingVertical: 50, borderTopWidth: 1, borderTopColor: Colors.border, borderBottomWidth: 1, borderBottomColor: Colors.border },
  whyGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20, gap: 16 },
  whyCard: { width: (width - 56) / 2, backgroundColor: Colors.cardBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  whyIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  whyTitle: { fontSize: 14, fontWeight: '800', color: Colors.white, marginBottom: 6 },
  whyDesc: { fontSize: 12, color: Colors.textGray, lineHeight: 18 },
  trustSection: { paddingHorizontal: 20, paddingVertical: 50 },
  trustTitle: { fontSize: 22, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: 24 },
  trustCard: { backgroundColor: Colors.cardBg, borderRadius: 24, padding: 30, borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 4, alignItems: 'center' },
  trustIcon: { marginBottom: 16, opacity: 0.9 },
  trustQuote: { fontSize: 16, color: Colors.white, lineHeight: 26, fontStyle: 'italic', textAlign: 'center', marginBottom: 24, fontWeight: '500' },
  trustAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trustAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  trustAuthorName: { fontSize: 14, fontWeight: '800', color: Colors.white },
  trustAuthorRole: { fontSize: 12, color: Colors.textGray, marginTop: 2 },
  ctaSection: { paddingHorizontal: 20, paddingVertical: 20, marginBottom: 20 },
  ctaCard: { borderRadius: 24, padding: 36, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  ctaTitle: { fontSize: 26, fontWeight: '900', color: Colors.white, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  ctaDesc: { fontSize: 14, color: '#BFDBFE', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  ctaPrimaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.white, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14, width: '100%', marginBottom: 16 },
  ctaPrimaryBtnText: { color: Colors.bg, fontSize: 16, fontWeight: '800' },
  ctaSubtext: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 30, alignItems: 'center', backgroundColor: '#081832', borderTopWidth: 1, borderTopColor: Colors.border },
  footerLogoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  footerLogoIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  footerBrand: { fontSize: 18, fontWeight: '800', color: Colors.white },
  footerCopyright: { fontSize: 12, color: Colors.textGray },
});