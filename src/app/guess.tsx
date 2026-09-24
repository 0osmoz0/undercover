import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Kicker } from '@/components/game/Kicker';
import { NoGame } from '@/components/game/NoGame';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';

export default function GuessScreen() {
  const { game, phase, submitMrWhiteGuess, winner } = useGame();
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);
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
      <Screen tone="white" style={styles.center}>
        <Kicker color={Palette.mrWhite} align="center">
          Vérification…
        </Kicker>
      </Screen>
    );
  }

  return (
    <Screen
      tone="white"
      style={styles.center}
      footer={
        <PrimaryButton
          label="Tenter ma chance"
          variant="white"
          haptic="heavy"
          onPress={submit}
          disabled={!guess.trim()}
        />
      }>
      <Animated.View entering={FadeIn.duration(400)} style={styles.top}>
        <Kicker color={Palette.mrWhite} align="center">
          Mister White démasqué
        </Kicker>
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={[styles.blank, styles.blankGhost]}>???</Text>
          <Text style={styles.blank}>???</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(150)} style={styles.block}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit>
          {eliminated?.name ?? 'Mister White'}
        </Text>
        <Text style={styles.body}>
          Dernière chance. Trouve le mot des Civils et tu remportes la partie, seul.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(350)}>
        <TextInput
          value={guess}
          onChangeText={setGuess}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Le mot des Civils…"
          placeholderTextColor={Palette.textFaint}
          style={[styles.input, focused && styles.inputFocused]}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={submit}
          selectionColor={Palette.mrWhite}
          accessibilityLabel="Ta proposition de mot"
        />
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    gap: Space.xl,
  },
  top: {
    alignItems: 'center',
    gap: Space.sm,
  },
  blank: {
    color: Palette.mrWhite,
    fontFamily: Font.display,
    fontSize: 96,
    lineHeight: 96,
    letterSpacing: 8,
    includeFontPadding: false,
  },
  blankGhost: {
    ...StyleSheet.absoluteFill,
    color: Palette.accent,
    transform: [{ translateX: 3 }],
  },
  block: {
    gap: Space.sm,
  },
  title: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.display,
    lineHeight: Type.display,
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
  },
  body: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  input: {
    minHeight: 64,
    paddingHorizontal: Space.lg,
    backgroundColor: Palette.surface,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Palette.border,
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: Type.heading,
    textAlign: 'center',
  },
  inputFocused: {
    borderColor: Palette.mrWhite,
  },
});
