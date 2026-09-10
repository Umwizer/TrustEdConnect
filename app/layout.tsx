import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <SafeAreaView >
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    > <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="admin" />
    </Stack>
    </SafeAreaView>
  );
}
