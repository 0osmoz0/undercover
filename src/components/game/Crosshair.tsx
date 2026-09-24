import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Palette } from '@/constants/colors';

type CrosshairProps = {
  size?: number;
  color?: string;
  opacity?: number;
  /** Anime un « verrouillage » : le réticule se resserre sur la cible. */
  lockOn?: boolean;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Réticule repris du logo, dessiné en vues natives (aucune image). */
export function Crosshair({
  size = 64,
  color = Palette.accent,
  opacity = 1,
  lockOn = false,
  delay = 0,
  style,
}: CrosshairProps) {
  const progress = useSharedValue(lockOn ? 0 : 1);

  useEffect(() => {
    if (!lockOn) return;
    progress.set(
      withDelay(delay, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })),
    );
  }, [lockOn, delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: opacity * p,
      transform: [{ scale: 1.35 - 0.35 * p }, { rotate: `${(1 - p) * -45}deg` }],
    };
  });

  const stroke = Math.max(1.5, size / 44);
  const ring = size * 0.62;
  const tick = size * 0.3;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: size, height: size }, styles.center, style, animatedStyle]}>
      <View
        style={[
          styles.abs,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderWidth: stroke,
            borderColor: color,
          },
        ]}
      />
      <View style={[styles.abs, { width: stroke, height: tick, top: 0, backgroundColor: color }]} />
      <View
        style={[styles.abs, { width: stroke, height: tick, bottom: 0, backgroundColor: color }]}
      />
      <View style={[styles.abs, { height: stroke, width: tick, left: 0, backgroundColor: color }]} />
      <View
        style={[styles.abs, { height: stroke, width: tick, right: 0, backgroundColor: color }]}
      />
      <View
        style={[
          styles.abs,
          {
            width: stroke * 2.2,
            height: stroke * 2.2,
            borderRadius: stroke * 1.1,
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  abs: {
    position: 'absolute',
  },
});
