import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Space } from '@/constants/colors';

type TimerProps = {
  minutes: number;
  onMinutesChange?: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
};

function format(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Timer({
  minutes,
  onMinutesChange,
  minMinutes = 1,
  maxMinutes = 5,
}: TimerProps) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [configuredMinutes, setConfiguredMinutes] = useState(minutes);

  if (configuredMinutes !== minutes) {
    setConfiguredMinutes(minutes);
    setRemaining(minutes * 60);
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return;
    const endAt = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const finished = remaining === 0;
  const pristine = remaining === minutes * 60 && !running;
  const canAdjust = pristine && Boolean(onMinutesChange);

  const toggle = () => {
    if (finished) {
      setRemaining(minutes * 60);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(minutes * 60);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StepButton
          label="−"
          disabled={!canAdjust || minutes <= minMinutes}
          onPress={() => onMinutesChange?.(minutes - 1)}
        />
        <View style={styles.display}>
          <Text
            style={[styles.time, finished && styles.timeFinished, running && styles.timeRunning]}
            accessibilityRole="timer">
            {format(remaining)}
          </Text>
          <Text style={styles.caption}>
            {finished ? 'Temps écoulé !' : running ? 'Discussion en cours' : `${minutes} min`}
          </Text>
        </View>
        <StepButton
          label="+"
          disabled={!canAdjust || minutes >= maxMinutes}
          onPress={() => onMinutesChange?.(minutes + 1)}
        />
      </View>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          onPress={toggle}
          style={({ pressed }) => [styles.control, styles.controlMain, pressed && styles.pressed]}>
          <Text style={styles.controlMainLabel}>
            {finished ? 'Relancer' : running ? 'Pause' : pristine ? 'Lancer le chrono' : 'Reprendre'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={reset}
          disabled={pristine}
          style={({ pressed }) => [
            styles.control,
            styles.controlSecondary,
            pressed && styles.pressed,
            pristine && styles.disabled,
          ]}>
          <Text style={styles.controlSecondaryLabel}>Réinitialiser</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StepButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label === '+' ? 'Ajouter une minute' : 'Retirer une minute'}
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [styles.step, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.stepLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Palette.border,
    padding: Space.md,
    gap: Space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  display: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    color: Palette.text,
    fontSize: 64,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timeRunning: {
    color: Palette.accent,
  },
  timeFinished: {
    color: Palette.danger,
  },
  caption: {
    color: Palette.textMuted,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  step: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    color: Palette.text,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 32,
  },
  controls: {
    flexDirection: 'row',
    gap: Space.sm,
  },
  control: {
    minHeight: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.md,
  },
  controlMain: {
    flex: 1.4,
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1.5,
    borderColor: Palette.accent,
  },
  controlMainLabel: {
    color: Palette.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  controlSecondary: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Palette.border,
  },
  controlSecondaryLabel: {
    color: Palette.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.35,
  },
});
