import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius, Space } from '@/constants/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'lg',
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        variantStyles[variant],
        pressed && pressedStyles[variant],
        disabled && styles.disabled,
        style,
      ]}>
      <Text
        style={[
          styles.label,
          size === 'lg' ? styles.labelLg : styles.labelMd,
          { color: variant === 'primary' ? Palette.onAccent : Palette.text },
          variant === 'ghost' && { color: Palette.textMuted },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Space.lg,
  },
  lg: {
    minHeight: 64,
  },
  md: {
    minHeight: 50,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  labelLg: {
    fontSize: 19,
  },
  labelMd: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
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
});

const pressedStyles = StyleSheet.create({
  primary: {
    backgroundColor: Palette.accentPressed,
    borderColor: Palette.accentPressed,
  },
  secondary: {
    backgroundColor: 'rgba(227, 6, 19, 0.12)',
  },
  ghost: {
    opacity: 0.6,
  },
  danger: {
    opacity: 0.85,
  },
});
