import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { haptic } from '@/lib/haptics';

import { Kicker } from './Kicker';

type ScreenHeaderProps = {
  kicker?: string;
  kickerColor?: string;
  title: string;
  subtitle?: ReactNode;
  backLabel?: string;
};

export function ScreenHeader({ kicker, kickerColor, title, subtitle, backLabel }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {backLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Retour : ${backLabel}`}
          onPress={() => {
            haptic('selection');
            if (router.canGoBack()) router.back();
            else router.replace('/');
          }}
          hitSlop={14}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backLabel}>{backLabel}</Text>
        </Pressable>
      ) : null}
      {kicker ? <Kicker color={kickerColor}>{kicker}</Kicker> : null}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Space.sm,
    marginBottom: Space.lg,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Space.xs,
    minHeight: 44,
    marginBottom: Space.xs,
  },
  backChevron: {
    color: Palette.accent,
    fontFamily: Font.bodyBold,
    fontSize: 28,
    lineHeight: 30,
  },
  backLabel: {
    color: Palette.textMuted,
    fontFamily: Font.monoBold,
    fontSize: Type.label + 1,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.display,
    lineHeight: Type.display,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  subtitle: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.6,
  },
});
