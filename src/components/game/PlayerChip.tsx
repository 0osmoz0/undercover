import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { haptic } from '@/lib/haptics';

import { Crosshair } from './Crosshair';

type PlayerChipProps = {
  name: string;
  onPress?: () => void;
  selected?: boolean;
  eliminated?: boolean;
  detail?: string;
  detailColor?: string;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PlayerChip({
  name,
  onPress,
  selected = false,
  eliminated = false,
  detail,
  detailColor,
  disabled = false,
  compact = false,
  style,
}: PlayerChipProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  const content = (
    <>
      <View
        style={[
          styles.avatar,
          compact && styles.avatarCompact,
          selected && styles.avatarSelected,
          eliminated && styles.avatarEliminated,
        ]}>
        <Text style={[styles.initial, compact && styles.initialCompact, selected && styles.initialSelected]}>
          {initial}
        </Text>
      </View>
      <View style={styles.texts}>
        <Text
          numberOfLines={1}
          style={[styles.name, compact && styles.nameCompact, eliminated && styles.nameEliminated]}>
          {name}
        </Text>
        {detail ? (
          <Text
            numberOfLines={1}
            style={[styles.detail, detailColor ? { color: detailColor } : null]}>
            {detail}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <View style={styles.target}>
          <Text style={styles.targetLabel}>Cible</Text>
          <Crosshair size={26} />
        </View>
      ) : null}
    </>
  );

  if (!onPress) {
    return (
      <View
        style={[styles.chip, compact && styles.chipCompact, eliminated && styles.chipEliminated, style]}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={selected ? `${name}, sélectionné` : name}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        haptic('selection');
        onPress();
      }}
      style={({ pressed }) => [
        styles.chip,
        styles.interactive,
        selected && styles.chipSelected,
        pressed && !selected && styles.chipPressed,
        disabled && styles.chipDisabled,
        style,
      ]}>
      {selected ? <View style={styles.selectBar} /> : null}
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.sm + 2,
    paddingHorizontal: Space.md,
    backgroundColor: Palette.surface,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Palette.hairline,
    overflow: 'hidden',
  },
  chipCompact: {
    gap: Space.sm,
    paddingVertical: Space.sm,
    paddingHorizontal: Space.sm + 2,
  },
  interactive: {
    minHeight: 68,
  },
  chipSelected: {
    borderColor: Palette.accent,
    backgroundColor: Palette.accentSoft,
  },
  chipPressed: {
    backgroundColor: Palette.surfaceRaised,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipEliminated: {
    backgroundColor: 'transparent',
    borderColor: Palette.hairline,
  },
  selectBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Palette.accent,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.bgTop,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatarCompact: {
    width: 32,
    height: 32,
  },
  avatarSelected: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  avatarEliminated: {
    borderColor: Palette.hairline,
  },
  initial: {
    color: Palette.accent,
    fontFamily: Font.display,
    fontSize: 24,
    lineHeight: 28,
    includeFontPadding: false,
  },
  initialCompact: {
    fontSize: 19,
    lineHeight: 22,
  },
  initialSelected: {
    color: Palette.onAccent,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: Type.body + 2,
  },
  nameCompact: {
    fontSize: Type.body,
  },
  nameEliminated: {
    textDecorationLine: 'line-through',
    textDecorationColor: Palette.accent,
    color: Palette.textFaint,
  },
  detail: {
    color: Palette.textMuted,
    fontFamily: Font.mono,
    fontSize: Type.label + 1,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  target: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  targetLabel: {
    color: Palette.accent,
    fontFamily: Font.monoBold,
    fontSize: Type.label,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
