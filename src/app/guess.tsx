import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';

export default function GuessScreen() {
  const { game, phase, submitMrWhiteGuess, winner } = useGame();
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useBlockBack();

  useEffect(() => {
    if (!submitted) return;
    if (winner === 'mrWhite' || phase === 'ended') {
      router.replace('/end');
    } else if (phase === 'reveal') {
      router.replace('/reveal');
    }
  }, [submitted, phase, winner]);

  if (!game) return <NoGame />;

  const eliminated = game.lastEliminatedId
    ? game.players.find((p) => p.id === game.lastEliminatedId)
    : undefined;

  const submit = () => {
    if (!guess.trim() || submitted) return;
    submitMrWhiteGuess(guess);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.kicker}>Vérification…</Text>
      </Screen>
    );
  }

  return (
    <Screen
      style={styles.center}
      footer={
        <PrimaryButton
          label="Je tente ma chance"
          onPress={submit}
          disabled={!guess.trim()}
        />
      }>
      <Text style={styles.kicker}>Mister White éliminé</Text>
      <Text style={styles.title} accessibilityRole="header">
        {eliminated?.name ?? 'Mister White'}
      </Text>
      <Text style={styles.body}>
        Tu n’avais pas de mot. Trouve le mot des Civils pour gagner la partie.
      </Text>
      <TextInput
        value={guess}
        onChangeText={setGuess}
        placeholder="Ton guess…"
        placeholderTextColor={Palette.textFaint}
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={submit}
        selectionColor={Palette.mrWhite}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    gap: Space.lg,
  },
  kicker: {
    color: Palette.mrWhite,
    fontSize: Type.small,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  title: {
    color: Palette.text,
    fontSize: Type.display,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    color: Palette.textMuted,
    fontSize: Type.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  input: {
    minHeight: 58,
    paddingHorizontal: Space.lg,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Palette.mrWhite,
    color: Palette.text,
    fontSize: Type.heading,
    fontWeight: '700',
    textAlign: 'center',
  },
});
