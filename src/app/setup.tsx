import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';

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
    setEntries((prev) => [...prev, makeEntry()]);
  };

  const removePlayer = (key: string) => {
    if (count <= MIN_PLAYERS) return;
    setEntries((prev) => prev.filter((e) => e.key !== key));
  };

  const start = () => {
    if (validation) return;
    try {
      startGame(trimmed, undercoverCount, mrWhiteCount);
      router.push('/assign/0');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible de lancer la partie.');
    }
  };

  const civilians = count - undercoverCount - mrWhiteCount;

  return (
    <Screen
      scroll
      footer={
        <>
          {error || validation ? (
            <Text style={[styles.validation, error ? styles.error : null]}>
              {error ?? validation}
            </Text>
          ) : null}
          <PrimaryButton label="Démarrer la partie" onPress={start} disabled={Boolean(validation)} />
        </>
      }>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={12}>
          <Text style={styles.back}>‹ Accueil</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          Les joueurs
        </Text>
        <Text style={styles.subtitle}>
          {count} joueurs · de {MIN_PLAYERS} à {MAX_PLAYERS}
        </Text>
      </View>

      <View style={styles.list}>
        {entries.map((entry, index) => (
          <View key={entry.key} style={styles.row}>
            <Text style={styles.index}>{index + 1}</Text>
            <TextInput
              value={entry.name}
              onChangeText={(text) => updateName(entry.key, text)}
              placeholder={`Joueur ${index + 1}`}
              placeholderTextColor={Palette.textFaint}
              style={styles.input}
              maxLength={18}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              selectionColor={Palette.accent}
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
          </View>
        ))}

        {count < MAX_PLAYERS ? (
          <Pressable
            accessibilityRole="button"
            onPress={addPlayer}
            style={({ pressed }) => [styles.add, pressed && styles.pressed]}>
            <Text style={styles.addLabel}>+ Ajouter un joueur</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Undercover</Text>
        <View style={styles.counter}>
          <CounterButton
            label="−"
            accessibilityLabel="Moins d’undercover"
            disabled={undercoverCount <= (mrWhiteCount > 0 ? 0 : 1)}
            onPress={() => setUndercoverOverride(undercoverCount - 1)}
          />
          <View style={styles.counterValue}>
            <Text style={styles.counterNumber}>{undercoverCount}</Text>
            <Text style={styles.counterCaption}>
              + {civilians} civil{civilians > 1 ? 's' : ''}
            </Text>
          </View>
          <CounterButton
            label="+"
            accessibilityLabel="Plus d’undercover"
            disabled={undercoverCount + mrWhiteCount >= count - 1}
            onPress={() => setUndercoverOverride(undercoverCount + 1)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mister White</Text>
        <Text style={styles.sectionHint}>
          Pas de mot — doit bluffer. Disponible dès 5 joueurs.
        </Text>
        <View style={styles.counter}>
          <CounterButton
            label="−"
            accessibilityLabel="Moins de Mister White"
            disabled={mrWhiteCount <= 0}
            onPress={() => setMrWhiteOverride(mrWhiteCount - 1)}
          />
          <View style={styles.counterValue}>
            <Text style={[styles.counterNumber, { color: Palette.mrWhite }]}>
              {mrWhiteCount}
            </Text>
            <Text style={styles.counterCaption}>
              {mrWhiteCount === 0 ? 'désactivé' : 'actif'}
            </Text>
          </View>
          <CounterButton
            label="+"
            accessibilityLabel="Plus de Mister White"
            disabled={count < 5 || mrWhiteCount >= 1 || undercoverCount + 1 >= count}
            onPress={() => setMrWhiteOverride(1)}
          />
        </View>
        {(undercoverOverride !== null || mrWhiteOverride !== null) &&
        (undercoverCount !== suggestedUc || mrWhiteCount !== suggestedMw) ? (
          <Pressable
            onPress={() => {
              setUndercoverOverride(null);
              setMrWhiteOverride(null);
            }}
            hitSlop={8}>
            <Text style={styles.suggest}>Revenir aux valeurs conseillées</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
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
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.counterBtn, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.counterBtnLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Space.xs,
    marginBottom: Space.lg,
  },
  back: {
    color: Palette.textMuted,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Space.md,
  },
  title: {
    color: Palette.text,
    fontSize: Type.title + 4,
    fontWeight: '900',
  },
  subtitle: {
    color: Palette.textMuted,
    fontSize: Type.small + 1,
    fontWeight: '600',
  },
  list: {
    gap: Space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  index: {
    width: 22,
    color: Palette.accent,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  input: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: Space.md,
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    color: Palette.text,
    fontSize: Type.body + 1,
    fontWeight: '600',
  },
  remove: {
    width: 48,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  removeLabel: {
    color: Palette.danger,
    fontSize: 28,
    fontWeight: '500',
  },
  add: {
    marginTop: Space.xs,
    marginLeft: 30,
    minHeight: 54,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    color: Palette.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginTop: Space.xl,
    gap: Space.md,
  },
  sectionTitle: {
    color: Palette.textMuted,
    fontSize: Type.label,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionHint: {
    color: Palette.textFaint,
    fontSize: Type.small,
    marginTop: -Space.sm,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Palette.border,
    padding: Space.sm,
  },
  counterBtn: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnLabel: {
    color: Palette.text,
    fontSize: 28,
    fontWeight: '600',
  },
  counterValue: {
    flex: 1,
    alignItems: 'center',
  },
  counterNumber: {
    color: Palette.accent,
    fontSize: 36,
    fontWeight: '900',
  },
  counterCaption: {
    color: Palette.textMuted,
    fontSize: Type.small,
    fontWeight: '600',
  },
  suggest: {
    color: Palette.textMuted,
    fontSize: Type.small,
    textDecorationLine: 'underline',
  },
  validation: {
    color: Palette.textMuted,
    fontSize: Type.small + 1,
    fontWeight: '700',
    textAlign: 'center',
  },
  error: {
    color: Palette.danger,
  },
  pressed: {
    opacity: 0.65,
  },
  disabled: {
    opacity: 0.3,
  },
});
