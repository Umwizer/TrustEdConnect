import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Colors = {
  primary: '#1E3A8A',
  bg: '#F8FAFC',
  white: '#FFFFFF',
  textDark: '#0F172A',
  textGray: '#64748B',
  border: '#E2E8F0',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  orange: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
};

const STUDENT_INFO = {
  name: 'John Doe',
  class: 'S4',
  academicYear: '2025-2026',
};

const FEE_SUMMARY = {
  total: '300,000 RWF',
  paid: '200,000 RWF',
  balance: '100,000 RWF',
  deadline: '30 September 2026',
  progress: 66.7,
};

const PAYMENT_HISTORY = [
  {
    id: 1,
    date: '15 Sept 2026',
    amount: '100,000 RWF',
    method: 'Bank Transfer',
    status: 'Completed',
    reference: 'TXN-2026-0915',
  },
  {
    id: 2,
    date: '10 Aug 2026',
    amount: '100,000 RWF',
    method: 'Mobile Money',
    status: 'Completed',
    reference: 'TXN-2026-0810',
  },
];

export default function FeesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>School Fees</Text>
            <Text style={styles.headerSubtitle}>
              {STUDENT_INFO.name} - {STUDENT_INFO.class}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Outstanding Balance</Text>
          <Text style={styles.balanceAmount}>{FEE_SUMMARY.balance}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${FEE_SUMMARY.progress}%` }]} />
          </View>
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressLabel}>Paid: {FEE_SUMMARY.paid}</Text>
            <Text style={styles.progressLabel}>Total: {FEE_SUMMARY.total}</Text>
          </View>
          <View style={styles.deadlineRow}>
            <Ionicons name="calendar-outline" size={16} color="#FEF3C7" />
            <Text style={styles.deadlineText}>Due: {FEE_SUMMARY.deadline}</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="wallet-outline" size={20} color={Colors.blue} />
            </View>
            <Text style={styles.summaryValue}>{FEE_SUMMARY.total}</Text>
            <Text style={styles.summaryLabel}>Total Fees</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.green} />
            </View>
            <Text style={styles.summaryValue}>{FEE_SUMMARY.paid}</Text>
            <Text style={styles.summaryLabel}>Amount Paid</Text>
          </View>
        </View>

        {/* Payment History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment History</Text>
        </View>

        {PAYMENT_HISTORY.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentIconWrap}>
              <Ionicons name="receipt-outline" size={20} color={Colors.green} />
            </View>
            <View style={styles.paymentContent}>
              <View style={styles.paymentTopRow}>
                <Text style={styles.paymentAmount}>{payment.amount}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{payment.status}</Text>
                </View>
              </View>
              <Text style={styles.paymentDate}>{payment.date}</Text>
              <Text style={styles.paymentMethod}>
                {payment.method} • {payment.reference}
              </Text>
            </View>
          </View>
        ))}

        {/* Pay Now Button */}
        <TouchableOpacity style={styles.payButton}>
          <Ionicons name="card-outline" size={20} color={Colors.white} />
          <Text style={styles.payButtonText}>Pay Remaining Balance</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, backgroundColor: Colors.bg },
  contentContainer: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark },
  headerSubtitle: { fontSize: 13, color: Colors.textGray, marginTop: 2 },
  balanceCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceLabel: { color: '#BFDBFE', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  balanceAmount: { color: Colors.white, fontSize: 32, fontWeight: '900', marginBottom: 20 },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 4,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressLabel: { color: '#BFDBFE', fontSize: 11, fontWeight: '600' },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,185,66,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  deadlineText: { color: '#FEF3C7', fontSize: 12, fontWeight: '600' },
  summaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: { fontSize: 16, fontWeight: '800', color: Colors.textDark, marginBottom: 2 },
  summaryLabel: { fontSize: 11, color: Colors.textGray, fontWeight: '600' },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  paymentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentContent: { flex: 1 },
  paymentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentAmount: { fontSize: 15, fontWeight: '800', color: Colors.textDark },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
  },
  statusText: { fontSize: 10, fontWeight: '700', color: Colors.green },
  paymentDate: { fontSize: 12, color: Colors.textGray, marginBottom: 2 },
  paymentMethod: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  payButtonText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});