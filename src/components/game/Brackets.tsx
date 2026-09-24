import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette } from '@/constants/colors';

type BracketsProps = {
  children: ReactNode;
  color?: string;
  size?: number;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
};

/** Cadre de visée : quatre coins en équerre autour du contenu. */
export function Brackets({
  children,
  color = Palette.accent,
  size = 26,
  thickness = 3,
  style,
}: BracketsProps) {
  const corner = { width: size, height: size, borderColor: color };
  return (
    <View style={[styles.frame, style]}>
      <View
        pointerEvents="none"
        style={[styles.corner, corner, { top: 0, left: 0, borderTopWidth: thickness, borderLeftWidth: thickness }]}
      />
      <View
        pointerEvents="none"
        style={[styles.corner, corner, { top: 0, right: 0, borderTopWidth: thickness, borderRightWidth: thickness }]}
      />
      <View
        pointerEvents="none"
        style={[styles.corner, corner, { bottom: 0, left: 0, borderBottomWidth: thickness, borderLeftWidth: thickness }]}
      />
      <View
        pointerEvents="none"
        style={[styles.corner, corner, { bottom: 0, right: 0, borderBottomWidth: thickness, borderRightWidth: thickness }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
  },
});
