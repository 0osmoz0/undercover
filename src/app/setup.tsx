import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Kicker } from '@/components/game/Kicker';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { haptic } from '@/lib/haptics';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;

type Entry = { key: string; name: string };

let entrySeq = 0;
const makeEntry = (name = ''): Entry => {
  entrySeq += 1;
  return { key: `entry-${entrySeq}`, name };
};

export default function SetupScreen() {
  const { startGame, suggestedUndercoverCount, suggestedMrWhiteCount } = useGame();
  const [entries, setEntries] = useState<Entry[]>(() => [
    makeEntry(),
    makeEntry(),
    makeEntry(),
    makeEntry(),
  ]);
  const [undercoverOverride, setUndercoverOverride] = useState<number | null>(null);
  const [mrWhiteOverride, setMrWhiteOverride] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  const count = entries.length;
  const maxSpecial = Math.max(1, count - 1);
  const suggestedUc = suggestedUndercoverCount(count);
  const suggestedMw = suggestedMrWhiteCount(count);

  let undercoverCount = Math.max(
    0,
    undercoverOverride ?? suggestedUc,
  );
  let mrWhiteCount = Math.max(0, Math.min(1, mrWhiteOverride ?? suggestedMw));

  // Au moins 1 civil, et au moins 1 rôle spécial.
  if (undercoverCount + mrWhiteCount >= count) {
    undercoverCount = Math.max(0, count - 1 - mrWhiteCount);
  }
  if (undercoverCount + mrWhiteCount === 0) {
    undercoverCount = 1;
  }
  undercoverCount = Math.min(undercoverCount, maxSpecial - mrWhiteCount);

  const trimmed = entries.map((e) => e.name.trim());
  const missing = trimmed.filter((n) => !n).length;
  const lower = trimmed.filter(Boolean).map((n) => n.toLowerCase());
  const hasDuplicates = new Set(lower).size !== lower.length;

  let validation: string | null = null;
  if (missing > 0) {
    validation = missing === 1 ? 'Il manque un nom.' : `Il manque ${missing} noms.`;
  } else if (hasDuplicates) {
    validation = 'Deux joueurs ont le même nom.';
  }

  const updateName = (key: string, name: string) => {
    setError(null);
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, name } : e)));
  };

  const addPlayer = () => {
    if (count >= MAX_PLAYERS) return;
    haptic('light');
    setEntries((prev) => [...prev, makeEntry()]);
  };

  const removePlayer = (key: string) => {
    if (count <= MIN_PLAYERS) return;
    haptic('light');
    setEntries((prev) => prev.filter((e) => e.key !== key));
  };

  const start = () => {
    if (validation) return;
    try {
      startGame(trimmed, undercoverCount, mrWhiteCount);
      router.push('/assign/0');
    } catch (e) {
      haptic('warning');
      setError(e instanceof Error ? e.message : 'Impossible de lancer la partie.');
    }
  };

  const civilians = count - undercoverCount - mrWhiteCount;
  const composition = [
    ...Array<'civilian'>(civilians).fill('civilian'),
    ...Array<'undercover'>(undercoverCount).fill('undercover'),
    ...Array<'mrWhite'>(mrWhiteCount).fill('mrWhite'),
  ];

  return (
    <Screen
      scroll
      footer={
        <>
          {error || validation ? (
            <Text
              style={[styles.validation, error ? styles.error : null]}
              accessibilityLiveRegion="polite">
              {error ?? validation}
            </Text>
          ) : null}
          <PrimaryButton
            label="Lancer la mission"
            haptic="heavy"
            onPress={start}
            disabled={Boolean(validation)}
          />
        </>
      }>
      <ScreenHeader
        backLabel="Accueil"
        kicker="Briefing · Agents"
        title="Les joueurs"
        subtitle={`${count} agents enregistrés · de ${MIN_PLAYERS} à ${MAX_PLAYERS}`}
      />

      <View style={styles.list}>
        {entries.map((entry, index) => {
          const focused = focusedKey === entry.key;
          return (
            <Animated.View
              key={entry.key}
              entering={FadeIn.duration(220)}
              exiting={FadeOut.duration(160)}
              layout={LinearTransition.duration(220)}
              style={[styles.row, focused && styles.rowFocused]}>
              <Text style={[styles.index, focused && styles.indexFocused]}>
                {String(index + 1).padStart(2, '0')}
              </Text>
              <TextInput
                value={entry.name}
                onChangeText={(text) => updateName(entry.key, text)}
                onFocus={() => setFocusedKey(entry.key)}
                onBlur={() => setFocusedKey((k) => (k === entry.key ? null : k))}
                placeholder={`Joueur ${index + 1}`}
                placeholderTextColor={Palette.textFaint}
                style={styles.input}
                maxLength={18}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                selectionColor={Palette.accent}
                accessibilityLabel={`Nom du joueur ${index + 1}`}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Retirer ${entry.name || `le joueur ${index + 1}`}`}
                onPress={() => removePlayer(entry.key)}
                disabled={count <= MIN_PLAYERS}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.remove,
                  pressed && styles.pressed,
                  count <= MIN_PLAYERS && styles.disabled,
                ]}>
                <Text style={styles.removeLabel}>×</Text>
              </Pressable>
            </Animated.View>
          );
        })}

        {count < MAX_PLAYERS ? (
          <Animated.View layout={LinearTransition.duration(220)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ajouter un joueur"
              onPress={addPlayer}
              style={({ pressed }) => [styles.add, pressed && styles.addPressed]}>
              <Text style={styles.addPlus}>+</Text>
              <Text style={styles.addLabel}>Ajouter un joueur</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Kicker color={Palette.textMuted}>Composition</Kicker>
          {(undercoverOverride !== null || mrWhiteOverride !== null) &&
          (undercoverCount !== suggestedUc || mrWhiteCount !== suggestedMw) ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                haptic('selection');
                setUndercoverOverride(null);
                setMrWhiteOverride(null);
              }}
              hitSlop={10}>
              <Text style={styles.suggest}>Valeurs conseillées</Text>
            </Pressable>
          ) : null}
        </View>

        <View
          style={styles.distribution}
          accessible
          accessibilityLabel={`${civilians} civils, ${undercoverCount} undercover, ${mrWhiteCount} Mister White`}>
          {composition.map((role, i) => (
            <View key={i} style={[styles.segment, segmentStyles[role]]} />
          ))}
        </View>
        <View style={styles.legend}>
          <Legend color={Palette.textFaint} label={`${civilians} civil${civilians > 1 ? 's' : ''}`} />
          <Legend color={Palette.accent} label={`${undercoverCount} undercover`} />
          <Legend color={Palette.mrWhite} label={`${mrWhiteCount} Mr White`} />
        </View>

        <RoleStepper
          title="Undercover"
          hint="Un mot proche, mais différent."
          value={undercoverCount}
          valueColor={Palette.accent}
          canDecrement={undercoverCount > (mrWhiteCount > 0 ? 0 : 1)}
          canIncrement={undercoverCount + mrWhiteCount < count - 1}
          onDecrement={() => setUndercoverOverride(undercoverCount - 1)}
          onIncrement={() => setUndercoverOverride(undercoverCount + 1)}
          name="undercover"
          lessLabel="Moins d’undercover"
          moreLabel="Plus d’undercover"
        />
        <RoleStepper
          title="Mister White"
          hint={count < 5 ? 'Aucun mot · disponible dès 5 joueurs.' : 'Aucun mot · doit bluffer.'}
          value={mrWhiteCount}
          valueColor={Palette.mrWhite}
          canDecrement={mrWhiteCount > 0}
          canIncrement={!(count < 5 || mrWhiteCount >= 1 || undercoverCount + 1 >= count)}
          onDecrement={() => setMrWhiteOverride(mrWhiteCount - 1)}
          onIncrement={() => setMrWhiteOverride(1)}
          name="Mister White"
          lessLabel="Moins de Mister White"
          moreLabel="Plus de Mister White"
        />
      </View>
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function RoleStepper({
  title,
  hint,
  value,
  valueColor,
  canDecrement,
  canIncrement,
  onDecrement,
  onIncrement,
  name,
  lessLabel,
  moreLabel,
}: {
  lessLabel: string;
  moreLabel: string;
  title: string;
  hint: string;
  value: number;
  valueColor: string;
  canDecrement: boolean;
  canIncrement: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  name: string;
}) {
  return (
    <View style={styles.stepper}>
      <View style={styles.stepperText}>
        <Text style={styles.stepperTitle}>{title}</Text>
        <Text style={styles.stepperHint}>{hint}</Text>
      </View>
      <CounterButton
        label="−"
        accessibilityLabel={lessLabel}
        disabled={!canDecrement}
        onPress={onDecrement}
      />
      <Text
        style={[styles.stepperValue, { color: valueColor }]}
        accessibilityLabel={`${value} ${name}`}>
        {value}
      </Text>
      <CounterButton
        label="+"
        accessibilityLabel={moreLabel}
        disabled={!canIncrement}
        onPress={onIncrement}
      />
    </View>
  );
}

function CounterButton({
  label,
  onPress,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPress={() => {
        haptic('selection');
        onPress();
      }}
      disabled={disabled}
      hitSlop={4}
      style={({ pressed }) => [
        styles.counterBtn,
        pressed && styles.counterBtnPressed,
        disabled && styles.disabled,
      ]}>
      <Text style={styles.counterBtnLabel}>{label}</Text>
    </Pressable>
  );
}

const segmentStyles = StyleSheet.create({
  civilian: { backgroundColor: Palette.textFaint },
  undercover: { backgroundColor: Palette.accent },
  mrWhite: { backgroundColor: Palette.mrWhite },
});

const styles = StyleSheet.create({
  list: {
    gap: Space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    minHeight: 60,
    paddingLeft: Space.xs,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  rowFocused: {
    borderColor: Palette.accent,
  },
  index: {
    width: 26,
    color: Palette.textFaint,
    fontFamily: Font.monoBold,
    fontSize: Type.small,
    letterSpacing: 1,
  },
  indexFocused: {
    color: Palette.accent,
  },
  input: {
    flex: 1,
    minHeight: 58,
    color: Palette.text,
    fontFamily: Font.bodySemi,
    fontSize: Type.body + 3,
  },
  remove: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: 28,
    lineHeight: 32,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    marginTop: Space.md,
    minHeight: 56,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Palette.accentLine,
  },
  addPressed: {
    backgroundColor: Palette.accentSoft,
  },
  addPlus: {
    color: Palette.accent,
    fontFamily: Font.display,
    fontSize: 28,
    lineHeight: 30,
    includeFontPadding: false,
  },
  addLabel: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
  section: {
    marginTop: Space.xxl,
    gap: Space.md,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggest: {
    color: Palette.accent,
    fontFamily: Font.monoBold,
    fontSize: Type.label,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  distribution: {
    flexDirection: 'row',
    gap: 3,
    height: 10,
  },
  segment: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
  },
  legendLabel: {
    color: Palette.textMuted,
    fontFamily: Font.mono,
    fontSize: Type.label + 1,
    letterSpacing: 0.5,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  stepperText: {
    flex: 1,
    gap: 2,
  },
  stepperTitle: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  stepperHint: {
    color: Palette.textFaint,
    fontFamily: Font.body,
    fontSize: Type.small,
  },
  stepperValue: {
    width: 40,
    fontFamily: Font.display,
    fontSize: 44,
    lineHeight: 46,
    textAlign: 'center',
    includeFontPadding: false,
  },
  counterBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnPressed: {
    borderColor: Palette.accent,
    backgroundColor: Palette.accentSoft,
  },
  counterBtnLabel: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: 26,
    lineHeight: 30,
  },
  validation: {
    color: Palette.textMuted,
    fontFamily: Font.monoBold,
    fontSize: Type.label + 1,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  error: {
    color: Palette.danger,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
});
