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

export default function HomeScreen() {
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="school" size={28} color="#fff" />
            </View>
            <Text style={styles.logoText}>TrustED<Text style={styles.logoHighlight}>Connect</Text></Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn} onPress={handleLogin}>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color="#3B82F6" />
            <Text style={styles.heroBadgeText}>Smart Digital Solutions</Text>
          </View>
          <Text style={styles.heroTitle}>
            Empowering Schools With Smart Digital Solutions
          </Text>
          <Text style={styles.heroSubtitle}>
            A unified platform connecting administrators, teachers, and parents
            to create a thriving educational ecosystem.
          </Text>
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.heroPrimaryBtn}>
              <Text style={styles.heroPrimaryBtnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroSecondaryBtn}>
              <Ionicons name="play-circle" size={20} color="#3B82F6" />
              <Text style={styles.heroSecondaryBtnText}>Watch Demo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100K+</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Our Services</Text>
            <Text style={styles.sectionTitle}>Built for Every Role</Text>
            <Text style={styles.sectionSubtitle}>
              Tailored solutions for administrators, teachers, and parents — all
              in one place.
            </Text>
          </View>

          <View style={styles.servicesGrid}>
            <View style={[styles.serviceCard, styles.serviceCardAdmin]}>
              <View style={styles.serviceIconWrap}>
                <Ionicons name="business-outline" size={28} color="#3B82F6" />
              </View>
              <Text style={styles.serviceTitle}>For Administrators</Text>
              <Text style={styles.serviceDesc}>
                Primary/center high, entire-school technology strategy and
                operations, web management, network administration, and ongoing
                infrastructure maintenance.
              </Text>
              <View style={styles.serviceTags}>
                <Text style={styles.serviceTag}>Strategy</Text>
                <Text style={styles.serviceTag}>Operations</Text>
                <Text style={styles.serviceTag}>Security</Text>
              </View>
            </View>

            <View style={[styles.serviceCard, styles.serviceCardTeacher]}>
              <View style={styles.serviceIconWrap}>
                <Ionicons name="people-outline" size={28} color="#7C3AED" />
              </View>
              <Text style={styles.serviceTitle}>For Teachers</Text>
              <Text style={styles.serviceDesc}>
                Primary/center provides teachers with tech tools to enhance
                their teaching, track student progress, and create a more
                positive learning environment.
              </Text>
              <View style={styles.serviceTags}>
                <Text style={styles.serviceTag}>Teaching</Text>
                <Text style={styles.serviceTag}>Progress</Text>
                <Text style={styles.serviceTag}>Engagement</Text>
              </View>
            </View>

            <View style={[styles.serviceCard, styles.serviceCardParent]}>
              <View style={styles.serviceIconWrap}>
                <Ionicons name="heart-outline" size={28} color="#059669" />
              </View>
              <Text style={styles.serviceTitle}>For Parents</Text>
              <Text style={styles.serviceDesc}>
                Primary/center keeps parents informed and engaged in their
                child's education by providing real-time updates on attendance,
                grades, and other important information.
              </Text>
              <View style={styles.serviceTags}>
                <Text style={styles.serviceTag}>Real-time</Text>
                <Text style={styles.serviceTag}>Grades</Text>
                <Text style={styles.serviceTag}>Engagement</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.aboutSection]}>
          <View style={styles.aboutGrid}>
            <View style={styles.aboutContent}>
              <Text style={styles.sectionLabel}>About Us</Text>
              <Text style={styles.sectionTitle}>Who We Are</Text>
              <Text style={styles.aboutText}>
                We are a team of passionate individuals dedicated to making a
                positive impact in the world. Our mission is to create
                meaningful change and empower others to achieve their goals.
              </Text>
              <View style={styles.aboutHighlights}>
                <View style={styles.aboutHighlight}>
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  <Text style={styles.aboutHighlightText}>
                    Over 100,000 students benefited
                  </Text>
                </View>
                <View style={styles.aboutHighlight}>
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  <Text style={styles.aboutHighlightText}>
                    Medical care provided to thousands
                  </Text>
                </View>
                <View style={styles.aboutHighlight}>
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  <Text style={styles.aboutHighlightText}>
                    Jobs created & local economies supported
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.aboutImagePlaceholder}>
              <Ionicons name="people" size={80} color="#93C5FD" />
              <Text style={styles.aboutImageText}>Our Team</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.visionSection]}>
          <View style={styles.visionHeader}>
            <Text style={styles.sectionLabel}>Looking Ahead</Text>
            <Text style={styles.sectionTitle}>Our Vision & Future Goals</Text>
            <Text style={styles.sectionSubtitle}>
              Driving innovation and creating solutions that address the world's
              most pressing challenges.
            </Text>
          </View>
          <View style={styles.goalsGrid}>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons name="globe-outline" size={28} color="#3B82F6" />
              </View>
              <Text style={styles.goalTitle}>Expand Reach</Text>
              <Text style={styles.goalDesc}>
                Bring our solutions to underserved communities worldwide.
              </Text>
            </View>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons name="leaf-outline" size={28} color="#059669" />
              </View>
              <Text style={styles.goalTitle}>Sustainability</Text>
              <Text style={styles.goalDesc}>
                Develop new technologies that promote environmental
                sustainability.
              </Text>
            </View>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons names="handshake" size={28} color="#7C3AED" />
              </View>
              <Text style={styles.goalTitle}>Partnerships</Text>
              <Text style={styles.goalDesc}>
                Foster partnerships with governments and businesses for lasting
                change.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.dashboardSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Dashboard Preview</Text>
            <Text style={styles.sectionTitle}>
              Satisfaction Collection for School Needs
            </Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need, from attendance to analytics, in one
              intuitive dashboard.
            </Text>
          </View>

          <View style={styles.dashboardTabs}>
            <TouchableOpacity style={[styles.dashboardTab, styles.dashboardTabActive]}>
              <Ionicons name="school-outline" size={18} color="#3B82F6" />
              <Text style={styles.dashboardTabText}>Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dashboardTab}>
              <Ionicons name="home-outline" size={18} color="#6B7280" />
              <Text style={styles.dashboardTabText}>Parents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dashboardTab}>
              <Ionicons name="person-outline" size={18} color="#6B7280" />
              <Text style={styles.dashboardTabText}>Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dashboardGrid}>
            <View style={styles.dashboardItem}>
              <Ionicons name="people-outline" size={24} color="#3B82F6" />
              <Text style={styles.dashboardItemLabel}>Students</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="person-outline" size={24} color="#7C3AED" />
              <Text style={styles.dashboardItemLabel}>Parents</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="school-outline" size={24} color="#059669" />
              <Text style={styles.dashboardItemLabel}>Teachers</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="settings-outline" size={24} color="#D97706" />
              <Text style={styles.dashboardItemLabel}>Admin</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="calendar-outline" size={24} color="#DC2626" />
              <Text style={styles.dashboardItemLabel}>Attendance</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="stats-chart-outline" size={24} color="#3B82F6" />
              <Text style={styles.dashboardItemLabel}>Analytics</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="chatbubble-outline" size={24} color="#7C3AED" />
              <Text style={styles.dashboardItemLabel}>Communication</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="notifications-outline" size={24} color="#059669" />
              <Text style={styles.dashboardItemLabel}>Notifications</Text>
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Transform Your School?</Text>
            <Text style={styles.ctaDesc}>
              Join thousands of schools already using TrustEDConnect to create a
              smarter, more connected educational environment.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity style={styles.ctaPrimaryBtn}>
                <Text style={styles.ctaPrimaryBtnText}>Start Free Trial</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ctaSecondaryBtn}>
                <Text style={styles.ctaSecondaryBtnText}>Contact Sales</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <View style={styles.logoIconSmall}>
                <Ionicons name="school" size={20} color="#fff" />
              </View>
              <Text style={styles.footerBrandText}>
                TrustED<Text style={styles.logoHighlight}>Connect</Text>
              </Text>
            </View>
            <Text style={styles.footerTagline}>
              Empowering Schools With Smart Digital Solutions
            </Text>
          </View>
          <View style={styles.footerLinks}>
            <TouchableOpacity><Text style={styles.footerLink}>About</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Services</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
          </View>
          <View style={styles.footerSocial}>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-twitter" size={20} color="#6B7280" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-linkedin" size={20} color="#6B7280" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-youtube" size={20} color="#6B7280" /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-github" size={20} color="#6B7280" /></TouchableOpacity>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.footerCopyright}>© 2026 TrustEDConnect. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#3B82F6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: '#DBEAFE',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: '#EFF6FF',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 28,
    maxWidth: '90%',
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
    flexWrap: 'wrap',
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroSecondaryBtnText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#F8FAFC',
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginTop: 6,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCardAdmin: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  serviceCardTeacher: {
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  serviceCardParent: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  serviceTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  serviceTag: {
    fontSize: 11,
    fontWeight: '500',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aboutSection: {
    backgroundColor: '#FFFFFF',
  },
  aboutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  aboutContent: {
    flex: 1,
    minWidth: 280,
  },
  aboutText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
  },
  aboutHighlights: {
    gap: 10,
  },
  aboutHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aboutHighlightText: {
    fontSize: 14,
    color: '#1E293B',
  },
  aboutImagePlaceholder: {
    flex: 1,
    minWidth: 140,
    minHeight: 160,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 20,
  },
  aboutImageText: {
    color: '#1E293B',
    fontSize: 14,
    marginTop: 8,
  },
  visionSection: {
    backgroundColor: '#F8FAFC',
  },
  visionHeader: {
    marginBottom: 24,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  goalCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  dashboardSection: {
    backgroundColor: '#FFFFFF',
  },
  dashboardTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  dashboardTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dashboardTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dashboardItem: {
    width: (Dimensions.get('window').width - 60) / 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dashboardItemLabel: {
    fontSize: 11,
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  ctaCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaDesc: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 500,
  },
  ctaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  ctaPrimaryBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  ctaSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ctaSecondaryBtnText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 8,
    backgroundColor: '#FFFFFF',
  },
  footerTop: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logoIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  footerTagline: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '400',
  },
  footerSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottom: {
    alignItems: 'center',
  },
  footerCopyright: {
    fontSize: 12,
    color: '#94A3B8',
  },
});