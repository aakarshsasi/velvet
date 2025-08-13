import HomeScreen from "@/src/screens/Home";
import { Stack } from "expo-router";

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  );
}