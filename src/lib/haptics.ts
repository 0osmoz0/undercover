import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticKind = 'none' | 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning';

/** Retour tactile sans jamais bloquer ni lever d’erreur (web, appareils sans moteur haptique). */
export function haptic(kind: HapticKind = 'light') {
  if (kind === 'none' || Platform.OS === 'web') return;
  const run = () => {
    switch (kind) {
      case 'selection':
        return Haptics.selectionAsync();
      case 'medium':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case 'heavy':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case 'success':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case 'warning':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      default:
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  run().catch(() => {});
}
