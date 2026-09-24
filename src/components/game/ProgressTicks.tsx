import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/colors';

type ProgressTicksProps = {
  /** Index 0-based de l’étape en cours. */
  current: number;
  total: number;
};

export function ProgressTicks({ current, total }: ProgressTicksProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current + 1 }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.tick,
            i < current && styles.done,
            i === current && styles.current,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'stretch',
  },
  tick: {
    flex: 1,
    height: 3,
    backgroundColor: Palette.border,
  },
  done: {
    backgroundColor: Palette.accent,
  },
  current: {
    backgroundColor: Palette.text,
  },
});
