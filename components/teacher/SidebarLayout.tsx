// components/teacher/SidebarLayout.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import TeacherSidebar from './TeacherSidebar';

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <View style={styles.container}>
      <TeacherSidebar />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#F5F7FB' },
  content: { flex: 1, minWidth: 0, backgroundColor: '#F5F7FB' },
});