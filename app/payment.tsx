import { Stack } from 'expo-router';
import PaymentScreenRevenueCat from '../src/screens/PaymentScreenRevenueCat';

export default function Page() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PaymentScreenRevenueCat />
    </>
  );
}
