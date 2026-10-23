// Hormati pengaturan "kurangi gerakan" (web: prefers-reduced-motion).
import { AccessibilityInfo } from 'react-native';

let kurangi = false;
if (typeof window !== 'undefined') {
  try {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { kurangi = !!v; }).catch(() => {});
    AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => { kurangi = !!v; });
  } catch {
    // tidak didukung
  }
}

export const kurangiGerak = () => kurangi;
