import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

type KickerProps = {
  children: ReactNode;
  color?: string;
  align?: 'left' | 'center';
  marker?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Étiquette « dossier » en mono : petit carré de couleur + texte espacé. */
export function Kicker({
  children,
  color = Palette.accent,
  align = 'left',
  marker = true,
  style,
}: KickerProps) {
  return (
    <View style={[styles.row, align === 'center' && styles.center, style]}>
      {marker ? <View style={[styles.marker, { backgroundColor: color }]} /> : null}
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  center: {
    justifyContent: 'center',
  },
  marker: {
    width: 6,
    height: 6,
  },
  text: {
    fontFamily: Font.monoBold,
    fontSize: Type.label,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    flexShrink: 1,
  },
});
