import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { haptic } from '@/lib/haptics';

type TimerProps = {
  minutes: number;
  onMinutesChange?: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
};

const COUNTDOWN_ALERT = 10;

function format(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        haptic('warning');
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const total = minutes * 60;
  const finished = remaining === 0;
  const pristine = remaining === total && !running;
  const canAdjust = pristine && Boolean(onMinutesChange);
  const alert = running && remaining <= COUNTDOWN_ALERT;

  const progress = useSharedValue(1);
  const beat = useSharedValue(1);

  useEffect(() => {
    progress.set(withTiming(total > 0 ? remaining / total : 0, { duration: 260, easing: Easing.linear }));
  }, [remaining, total, progress]);

  useEffect(() => {
    if (!alert) return;
    haptic('selection');
    beat.set(
      withSequence(
        withTiming(1.07, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [alert, remaining, beat]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.get() }],
  }));
  const digitsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beat.get() }],
  }));

  const toggle = () => {
    haptic('medium');
    if (finished) {
      setRemaining(total);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    haptic('light');
    setRunning(false);
    setRemaining(total);
  };

  const caption = finished
    ? 'Temps écoulé — place au vote'
    : running
      ? 'Discussion en cours'
      : pristine
        ? `Chrono · ${minutes} min`
        : 'En pause';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StepButton
          label="−"
          visible={canAdjust}
          disabled={minutes <= minMinutes}
          onPress={() => onMinutesChange?.(minutes - 1)}
        />
        <Animated.View style={[styles.display, digitsStyle]}>
          <Text
            style={[
              styles.time,
              (alert || finished) && styles.timeAlert,
              !running && !pristine && !finished && styles.timePaused,
            ]}
            accessibilityRole="timer"
            accessibilityLabel={`${Math.floor(remaining / 60)} minutes ${remaining % 60} secondes restantes`}>
            {format(remaining)}
          </Text>
        </Animated.View>
        <StepButton
          label="+"
          visible={canAdjust}
          disabled={minutes >= maxMinutes}
          onPress={() => onMinutesChange?.(minutes + 1)}
        />
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, (alert || finished) && styles.fillAlert, barStyle]} />
      </View>
      <Text style={[styles.caption, finished && styles.captionAlert]}>{caption}</Text>

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          onPress={toggle}
          style={({ pressed }) => [
            styles.control,
            styles.controlMain,
            running && styles.controlMainRunning,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.controlMainLabel}>
            {finished ? 'Relancer' : running ? 'Pause' : pristine ? 'Lancer le chrono' : 'Reprendre'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Réinitialiser le chrono"
          onPress={reset}
          disabled={pristine}
          style={({ pressed }) => [
            styles.control,
            styles.controlSecondary,
            pressed && styles.pressed,
            pristine && styles.disabled,
          ]}>
          <Text style={styles.controlSecondaryLabel}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StepButton({
  label,
  onPress,
  disabled,
  visible,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  visible: boolean;
}) {
  if (!visible) return <View style={styles.stepPlaceholder} />;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label === '+' ? 'Ajouter une minute' : 'Retirer une minute'}
      onPress={() => {
        haptic('selection');
        onPress();
      }}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [styles.step, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.stepLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Space.md,
    gap: Space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
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
    fontFamily: Font.display,
    fontSize: 112,
    lineHeight: 112,
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  timeAlert: {
    color: Palette.accent,
  },
  timePaused: {
    color: Palette.textMuted,
  },
  track: {
    height: 4,
    backgroundColor: Palette.border,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    backgroundColor: Palette.text,
    transformOrigin: 'left',
  },
  fillAlert: {
    backgroundColor: Palette.accent,
  },
  caption: {
    color: Palette.textMuted,
    fontFamily: Font.mono,
    fontSize: Type.label + 1,
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  captionAlert: {
    color: Palette.accent,
  },
  step: {
    width: 48,
    height: 48,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPlaceholder: {
    width: 48,
  },
  stepLabel: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: 26,
    lineHeight: 30,
  },
  controls: {
    flexDirection: 'row',
    gap: Space.sm,
    marginTop: Space.sm,
  },
  control: {
    minHeight: 54,
    borderRadius: Radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.md,
  },
  controlMain: {
    flex: 2,
    borderWidth: 1.5,
    borderColor: Palette.accent,
  },
  controlMainRunning: {
    backgroundColor: Palette.accentSoft,
  },
  controlMainLabel: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
  controlSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  controlSecondaryLabel: {
    color: Palette.textMuted,
    fontFamily: Font.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.3,
  },
});
