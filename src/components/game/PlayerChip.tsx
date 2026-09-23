import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Space, Type } from '@/constants/colors';

type PlayerChipProps = {
  name: string;
  onPress?: () => void;
  selected?: boolean;
  eliminated?: boolean;
  detail?: string;
  detailColor?: string;
  disabled?: boolean;
};

export function PlayerChip({
  name,
  onPress,
  selected = false,
  eliminated = false,
  detail,
  detailColor,
  disabled = false,
}: PlayerChipProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  const content = (
    <>
      <View style={[styles.avatar, selected && styles.avatarSelected]}>
        <Text style={[styles.initial, selected && styles.initialSelected]}>{initial}</Text>
      </View>
      <View style={styles.texts}>
        <Text
          numberOfLines={1}
          style={[styles.name, eliminated && styles.nameEliminated]}>
          {name}
        </Text>
        {detail ? (
          <Text style={[styles.detail, detailColor ? { color: detailColor } : null]}>
            {detail}
          </Text>
        ) : null}
      </View>
    </>
  );

  if (!onPress) {
    return <View style={[styles.chip, eliminated && styles.chipEliminated]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        styles.interactive,
        selected && styles.chipSelected,
        pressed && !selected && styles.chipPressed,
        disabled && styles.chipDisabled,
      ]}>
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
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  interactive: {
    minHeight: 64,
  },
  chipSelected: {
    borderColor: Palette.accent,
    backgroundColor: Palette.surfaceRaised,
  },
  chipPressed: {
    backgroundColor: Palette.surfaceRaised,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipEliminated: {
    opacity: 0.55,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.bgTop,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  avatarSelected: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  initial: {
    color: Palette.accent,
    fontSize: 18,
    fontWeight: '800',
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
    fontSize: Type.body + 1,
    fontWeight: '700',
  },
  nameEliminated: {
    textDecorationLine: 'line-through',
    color: Palette.textMuted,
  },
  detail: {
    color: Palette.textMuted,
    fontSize: Type.small,
    fontWeight: '600',
  },
});
