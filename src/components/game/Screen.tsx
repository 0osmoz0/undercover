import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Space } from '@/constants/colors';

export type ScreenTone = 'neutral' | 'alert' | 'white';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Teinte d’ambiance très légère en haut de l’écran. */
  tone?: ScreenTone;
};

const TINTS: Record<Exclude<ScreenTone, 'neutral'>, readonly [string, string]> = {
  alert: ['rgba(227, 6, 19, 0.18)', 'rgba(227, 6, 19, 0)'],
  white: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0)'],
};

export function Screen({ children, scroll = false, footer, style, tone = 'neutral' }: ScreenProps) {
  return (
    <LinearGradient
      colors={[Palette.bgTop, Palette.bgMid, Palette.bgBottom]}
      locations={[0, 0.55, 1]}
      style={styles.root}>
      {tone !== 'neutral' ? (
        <LinearGradient colors={TINTS[tone]} style={styles.tint} pointerEvents="none" />
      ) : null}
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {scroll ? (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[styles.content, style]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          ) : (
            <View style={[styles.flex, styles.content, style]}>{children}</View>
          )}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tint: {
    ...StyleSheet.absoluteFill,
    bottom: '45%',
  },
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Space.lg,
    paddingTop: Space.lg,
    paddingBottom: Space.md,
  },
  footer: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.md,
    paddingTop: Space.sm,
    gap: Space.sm,
  },
});
