// app/(tabs)/_layout.tsx - 5 Main Tabs Only
import { useFonts } from "expo-font";
export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    // Define your custom fonts here
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="admin" />
      <Stack.Screen name="teacher" />
      <Stack.Screen name="parent" />
    </Stack>
  );
}
