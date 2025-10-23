import IAPTestComponent from "../src/components/IAPTestComponent";
import { Stack } from "expo-router";

export default function IAPTestPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <IAPTestComponent />
    </>
  );
}
