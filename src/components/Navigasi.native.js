// Android/iOS: tumpukan layar asli supaya tombol/gestur kembali bekerja wajar.
import { Stack } from 'expo-router';

export default function Navigasi() {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
