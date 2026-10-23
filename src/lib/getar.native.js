import * as Haptics from 'expo-haptics';

/** Getar ringan untuk momen penting (paraf, lunas, kirim). */
export function getar(jenis = 'ringan') {
  try {
    if (jenis === 'sukses') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // perangkat tanpa motor getar
  }
}
