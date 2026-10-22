import { useFonts } from 'expo-font';

export const F = { serif: 'YoungSerif', sans: 'Jakarta400', tulis: 'PlaywriteID' };

const KELUARGA = { 400: 'Jakarta400', 500: 'Jakarta400', 600: 'Jakarta600', 700: 'Jakarta700', 800: 'Jakarta800' };

export function berat(w = 400) {
  return { fontFamily: KELUARGA[w] || 'Jakarta400' };
}

export function useMuatFont() {
  const [siap] = useFonts({
    YoungSerif: require('../../assets/fonts/YoungSerif-Regular.ttf'),
    Jakarta400: require('../../assets/fonts/PlusJakartaSans-Regular.ttf'),
    Jakarta600: require('../../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    Jakarta700: require('../../assets/fonts/PlusJakartaSans-Bold.ttf'),
    Jakarta800: require('../../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    PlaywriteID: require('../../assets/fonts/PlaywriteID-Regular.ttf'),
  });
  return siap;
}
