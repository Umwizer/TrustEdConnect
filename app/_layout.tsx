// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="dark" translucent={false} />
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}