import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
const COLORS = {
  navyDeep: "#0A1442",
  navyPanel: "#122156",
  navyHeader: "#33456E",
  navyCard: "#1A2A5E",
  green: "#22C55E",
  greenLight: "#4ADE80",
  gold: "#F5B942",
  white: "#FFFFFF",
  offWhite: "#E7ECFB",
  muted: "#A9B4D6",
};

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher Dashboard</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to TrustEdConnect!</Text>
        <Text style={styles.subText}>Your teacher dashboard is ready.</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.navyHeader,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoText: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  logoHighlight: {
    color: COLORS.greenLight,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700",
  },

  // Hero
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: COLORS.navyHeader,
    alignItems: "center",
  },
  heroTagline: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.greenLight,
    lineHeight: 28,
    letterSpacing: -0.2,
    marginBottom: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.offWhite,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.navyDeep,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
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
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  // Sections (dark)
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.navyDeep,
  },
  sectionLabelCenter: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.greenLight,
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitleCenter: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 22,
  },

  // Services icon row
  servicesIconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 28,
  },
  serviceIconCard: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // Role blocks (For Administrators / Teachers / Parents)
  roleBlock: {
    marginBottom: 22,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
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
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  serviceTag: {
    fontSize: 11,
    fontWeight: "600",
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
    textAlign: "center",
    marginBottom: 18,
  },
  aboutHighlights: {
    gap: 12,
    alignSelf: "center",
  },
  aboutHighlight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  aboutHighlightText: {
    fontSize: 14,
    color: COLORS.white,
  },

  // Goals / Vision
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  goalCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.navyCard,
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245,185,66,0.25)",
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(245,185,66,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  goalDesc: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 19,
  },

  // Dashboard preview
  dashboardSection: {
    backgroundColor: COLORS.navyDeep,
  },
  dashboardTabs: {
    flexDirection: "row",
    backgroundColor: COLORS.navyPanel,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    alignSelf: "center",
  },
  dashboardTab: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: COLORS.muted,
  },
  dashboardTabTextActive: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navyDeep,
  },
  dashboardCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
  },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dashboardItem: {
    width: (width - 68) / 4,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dashboardItemLabel: {
    fontSize: 10,
    color: "#475569",
    marginTop: 6,
    textAlign: "center",
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
    borderColor: "rgba(74,222,128,0.25)",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10,
  },
  ctaDesc: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
  },
  ctaButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
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
    fontWeight: "700",
  },
  ctaSecondaryBtn: {
    backgroundColor: "transparent",
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  ctaSecondaryBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: "700",
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    marginTop: 4,
    backgroundColor: COLORS.navyHeader,
  },
  footerTop: {
    alignItems: "center",
    marginBottom: 16,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  logoIconSmall: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBrandText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.white,
  },
  footerTagline: {
    fontSize: 12,
    color: COLORS.muted,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  footerLink: {
    color: COLORS.offWhite,
    fontSize: 13,
    fontWeight: "400",
  },
  footerSocial: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  socialBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  footerBottom: {
    alignItems: "center",
  },
  footerCopyright: {
    fontSize: 11,
    color: COLORS.muted,
  },
});
