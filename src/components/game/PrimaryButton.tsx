import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Palette, Radius, Space } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { haptic, type HapticKind } from '@/lib/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'white';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  haptic?: HapticKind;
  accessibilityHint?: string;
};

const PRESS_SPRING = { damping: 18, stiffness: 420, mass: 0.6 };

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'lg',
  style,
  haptic: hapticKind = 'light',
  accessibilityHint,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const handlePress = () => {
    haptic(hapticKind);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={() => scale.set(withSpring(0.965, PRESS_SPRING))}
      onPressOut={() => scale.set(withSpring(1, PRESS_SPRING))}
      hitSlop={6}
      style={style}>
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.base,
            size === 'lg' ? styles.lg : styles.md,
            variantStyles[variant],
            pressed && pressedStyles[variant],
            disabled && (variant === 'ghost' ? styles.disabledGhost : styles.disabled),
            animatedStyle,
          ]}>
          <Text
            style={[
              styles.label,
              size === 'lg' ? styles.labelLg : styles.labelMd,
              { color: labelColor(variant) },
              disabled && variant !== 'ghost' && styles.labelDisabled,
            ]}>
            {label}
          </Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

function labelColor(variant: Variant): string {
  if (variant === 'white') return '#000000';
  if (variant === 'ghost') return Palette.textMuted;
  return Palette.text;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    paddingHorizontal: Space.lg,
  },
  lg: {
    minHeight: 66,
  },
  md: {
    minHeight: 52,
  },
  label: {
    fontFamily: Font.display,
    letterSpacing: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  labelLg: {
    fontSize: 28,
    lineHeight: 32,
  },
  labelMd: {
    fontSize: 22,
    lineHeight: 26,
  },
  disabled: {
    backgroundColor: Palette.surfaceRaised,
    borderColor: Palette.border,
  },
  disabledGhost: {
    opacity: 0.35,
  },
  labelDisabled: {
    color: Palette.textFaint,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: Palette.accent,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: Palette.danger,
    borderColor: Palette.danger,
  },
  white: {
    backgroundColor: Palette.mrWhite,
    borderColor: Palette.mrWhite,
  },
});

const pressedStyles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.accentPressed,
    borderColor: Palette.accentPressed,
  },
  secondary: {
    backgroundColor: Palette.accentSoft,
  },
  ghost: {
    opacity: 0.6,
  },
  danger: {
    opacity: 0.85,
  },
  white: {
    backgroundColor: '#CFCFCF',
    borderColor: '#CFCFCF',
  },
});
