import ProfileResultScreen from "@/src/screens/ProfileResult";
import { Stack } from "expo-router";

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileResultScreen />
    </>
  );
}
