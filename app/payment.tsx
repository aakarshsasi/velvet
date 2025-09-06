import PaymentScreen from "@/src/screens/PaymentScreen";
import { Stack } from "expo-router";

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PaymentScreen />
    </>
  );
}
