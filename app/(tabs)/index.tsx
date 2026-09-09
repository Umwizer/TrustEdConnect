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
const COLORS = {
  navyDeep: '#0A1442',     
  navyPanel: '#122156',    
  navyHeader: '#33456E',   
  navyCard: '#1A2A5E',     
  green: '#22C55E',        
  greenLight: '#4ADE80',   
  gold: '#F5B942',         
  white: '#FFFFFF',
  offWhite: '#E7ECFB',     
  muted: '#A9B4D6',       
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="school" size={28} color={COLORS.navyDeep} />
            </View>
            <Text style={styles.logoText}>
              TrustED<Text style={styles.logoHighlight}>Connect</Text>
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTagline}>
            "Empowering Schools With Smart Digital Solutions"
          </Text>
          <Text style={styles.heroSubtitle}>
            A unified platform connecting administrators, teachers, and parents
            to create a thriving educational ecosystem.
          </Text>

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
          <Text style={styles.sectionLabelCenter}>Our Top Services</Text>

          <View style={styles.servicesIconRow}>
            {[
              { icon: 'business-outline', color: '#3B82F6' },
              { icon: 'people-outline', color: '#7C3AED' },
              { icon: 'heart-outline', color: '#059669' },
              { icon: 'person-outline', color: '#DC2626' },
              { icon: 'shield-checkmark-outline', color: '#0EA5E9' },
              { icon: 'ribbon-outline', color: '#F59E0B' },
              { icon: 'chatbubbles-outline', color: '#14B8A6' },
            ].map((item, i) => (
              <View key={i} style={styles.serviceIconCard}>
                <Ionicons names={item.icon} size={20} color={item.color} />
              </View>
            ))}
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>For Administrators</Text>
            <Text style={styles.roleDesc}>
              Entire-school technology strategy and operations, web
              management, network administration, and ongoing infrastructure
              maintenance.
            </Text>
            <View style={styles.serviceTags}>
              <Text style={styles.serviceTag}>Strategy</Text>
              <Text style={styles.serviceTag}>Operations</Text>
              <Text style={styles.serviceTag}>Security</Text>
            </View>
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>For Teachers</Text>
            <Text style={styles.roleDesc}>
              Tech tools to enhance teaching, track student progress, and
              create a more positive learning environment.
            </Text>
            <View style={styles.serviceTags}>
              <Text style={styles.serviceTag}>Teaching</Text>
              <Text style={styles.serviceTag}>Progress</Text>
              <Text style={styles.serviceTag}>Engagement</Text>
            </View>
          </View>

          <View style={styles.roleBlock}>
            <Text style={styles.roleTitle}>For Parents</Text>
            <Text style={styles.roleDesc}>
              Keeps parents informed and engaged in their child's education
              with real-time updates on attendance, grades, and more.
            </Text>
            <View style={styles.serviceTags}>
              <Text style={styles.serviceTag}>Real-time</Text>
              <Text style={styles.serviceTag}>Grades</Text>
              <Text style={styles.serviceTag}>Engagement</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.aboutSection]}>
          <Text style={styles.sectionLabelCenter}>Introduction (Who We Are)</Text>
          <Text style={styles.aboutText}>
            We are a team of passionate individuals dedicated to making a
            positive impact in the world. Our mission is to create meaningful
            change and empower others to achieve their goals.
          </Text>
          <View style={styles.aboutHighlights}>
            <View style={styles.aboutHighlight}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              <Text style={styles.aboutHighlightText}>
                Over 100,000 students benefited
              </Text>
            </View>
            <View style={styles.aboutHighlight}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              <Text style={styles.aboutHighlightText}>
                Medical care provided to thousands
              </Text>
            </View>
            <View style={styles.aboutHighlight}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              <Text style={styles.aboutHighlightText}>
                Jobs created & local economies supported
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabelCenter}>Our Vision & Future Goals</Text>
          <Text style={styles.sectionSubtitleCenter}>
            Driving innovation and creating solutions that address the
            world's most pressing challenges.
          </Text>
          <View style={styles.goalsGrid}>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons name="globe-outline" size={26} color={COLORS.gold} />
              </View>
              <Text style={styles.goalTitle}>Expand Reach</Text>
              <Text style={styles.goalDesc}>
                Bring our solutions to underserved communities worldwide.
              </Text>
            </View>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons name="leaf-outline" size={26} color={COLORS.gold} />
              </View>
              <Text style={styles.goalTitle}>Sustainability</Text>
              <Text style={styles.goalDesc}>
                Develop new technologies that promote environmental
                sustainability.
              </Text>
            </View>
            <View style={styles.goalCard}>
              <View style={styles.goalIcon}>
                <Ionicons names="handshake" size={26} color={COLORS.gold} />
              </View>
              <Text style={styles.goalTitle}>Partnerships</Text>
              <Text style={styles.goalDesc}>
                Foster partnerships with governments and businesses for
                lasting change.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.dashboardSection]}>
          <Text style={styles.sectionLabelCenter}>Dashboard Preview</Text>
          <Text style={styles.sectionSubtitleCenter}>
            Everything you need, from attendance to analytics, in one
            intuitive dashboard.
          </Text>

          <View style={styles.dashboardTabs}>
            <TouchableOpacity style={[styles.dashboardTab, styles.dashboardTabActive]}>
              <Ionicons name="school-outline" size={18} color={COLORS.navyDeep} />
              <Text style={styles.dashboardTabTextActive}>Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dashboardTab}>
              <Ionicons name="home-outline" size={18} color={COLORS.muted} />
              <Text style={styles.dashboardTabText}>Parents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dashboardTab}>
              <Ionicons name="person-outline" size={18} color={COLORS.muted} />
              <Text style={styles.dashboardTabText}>Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dashboardCard}>
            <View style={styles.dashboardGrid}>
              {[
                { icon: 'people-outline', label: 'Students', color: '#3B82F6' },
                { icon: 'person-outline', label: 'Parents', color: '#7C3AED' },
                { icon: 'school-outline', label: 'Teachers', color: '#059669' },
                { icon: 'settings-outline', label: 'Admin', color: '#D97706' },
                { icon: 'calendar-outline', label: 'Attendance', color: '#DC2626' },
                { icon: 'stats-chart-outline', label: 'Analytics', color: '#3B82F6' },
                { icon: 'chatbubble-outline', label: 'Communication', color: '#7C3AED' },
                { icon: 'notifications-outline', label: 'Notifications', color: '#059669' },
              ].map((item, i) => (
                <View key={i} style={styles.dashboardItem}>
                  <Ionicons names={item.icon} size={22} color={item.color} />
                  <Text style={styles.dashboardItemLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Transform Your School?</Text>
            <Text style={styles.ctaDesc}>
              Join thousands of schools already using TrustEDConnect to create
              a smarter, more connected educational environment.
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
                <Ionicons name="school" size={20} color={COLORS.navyDeep} />
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
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-twitter" size={18} color={COLORS.muted} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-linkedin" size={18} color={COLORS.muted} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-youtube" size={18} color={COLORS.muted} /></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-github" size={18} color={COLORS.muted} /></TouchableOpacity>
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
    backgroundColor: COLORS.navyDeep,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.navyDeep,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.navyHeader,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: COLORS.greenLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // Hero
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: COLORS.navyHeader,
    alignItems: 'center',
  },
  heroTagline: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.greenLight,
    lineHeight: 28,
    letterSpacing: -0.2,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.offWhite,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navyDeep,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gold,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  // Sections (dark)
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.navyDeep,
  },
  sectionLabelCenter: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.greenLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitleCenter: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 22,
  },

  // Services icon row
  servicesIconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  serviceIconCard: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Role blocks (For Administrators / Teachers / Parents)
  roleBlock: {
    marginBottom: 22,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 6,
  },
  roleDesc: {
    fontSize: 14,
    color: COLORS.offWhite,
    lineHeight: 21,
    marginBottom: 10,
  },
  serviceTags: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  serviceTag: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.navyDeep,
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  // About / Who We Are
  aboutSection: {
    backgroundColor: COLORS.navyPanel,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.offWhite,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
  },
  aboutHighlights: {
    gap: 12,
    alignSelf: 'center',
  },
  aboutHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aboutHighlightText: {
    fontSize: 14,
    color: COLORS.white,
  },

  // Goals / Vision
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  goalCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.navyCard,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,185,66,0.25)',
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245,185,66,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 19,
  },

  // Dashboard preview
  dashboardSection: {
    backgroundColor: COLORS.navyDeep,
  },
  dashboardTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyPanel,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    alignSelf: 'center',
  },
  dashboardTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dashboardTabActive: {
    backgroundColor: COLORS.gold,
  },
  dashboardTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  dashboardTabTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navyDeep,
  },
  dashboardCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dashboardItem: {
    width: (width - 68) / 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dashboardItemLabel: {
    fontSize: 10,
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },

  // CTA
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.navyDeep,
  },
  ctaCard: {
    backgroundColor: COLORS.navyPanel,
    borderRadius: 20,
    padding: 26,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaDesc: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  ctaButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  ctaPrimaryBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 12,
  },
  ctaPrimaryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  ctaSecondaryBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  ctaSecondaryBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    marginTop: 4,
    backgroundColor: COLORS.navyHeader,
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
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  footerTagline: {
    fontSize: 12,
    color: COLORS.muted,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  footerLink: {
    color: COLORS.offWhite,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottom: {
    alignItems: 'center',
  },
  footerCopyright: {
    fontSize: 11,
    color: COLORS.muted,
  },
});