import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import AdminSidebar from '../../../components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <View style={styles.container}>
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Pages */}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F7FB',
  },

  content: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#F5F7FB',
  },
});