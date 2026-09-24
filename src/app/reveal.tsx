import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Kicker } from '@/components/game/Kicker';
import { NoGame } from '@/components/game/NoGame';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen, type ScreenTone } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';
import { haptic } from '@/lib/haptics';
import { roleLabel, type Role } from '../../lib/game';

const BAND_DELAY = 700;
const BAND_DURATION = 480;

function toneFor(role: Role | undefined): ScreenTone {
  if (role === 'undercover') return 'alert';
  if (role === 'mrWhite') return 'white';
  return 'neutral';
}

export default function RevealScreen() {
  const { game, winner, continueAfterReveal } = useGame();
  useBlockBack();

  if (!game) return <NoGame />;

  const eliminated = game.lastEliminatedId
    ? game.players.find((p) => p.id === game.lastEliminatedId)
    : undefined;

  const next = () => {
    const ended = Boolean(winner);
    continueAfterReveal();
    router.replace(ended ? '/end' : '/discuss');
  };

  const hint = () => {
    if (!eliminated) return 'Rediscutez et votez à nouveau.';
    if (eliminated.role === 'mrWhite') {
      if (game.mrWhiteGuessCorrect === false) {
        return 'Mister White a raté son guess. La partie continue.';
      }
      return winner
        ? 'Mister White est tombé. Les Civils reprennent le dessus.'
        : 'Mister White est hors jeu.';
    }
    if (eliminated.role === 'undercover') {
      return winner
        ? 'Bien joué, plus d’intrus en jeu.'
        : 'Un intrus de moins… mais il en reste.';
    }
    return winner
      ? 'Aïe. Les intrus sont désormais trop nombreux.'
      : 'Un innocent est tombé. L’intrus court toujours.';
  };

  return (
    <Screen
      tone={toneFor(eliminated?.role)}
      style={styles.center}
      footer={
        <Animated.View entering={FadeIn.duration(400).delay(BAND_DELAY + BAND_DURATION)}>
          <PrimaryButton
            label={winner ? 'Voir les résultats' : 'Manche suivante'}
            variant={winner ? 'primary' : 'secondary'}
            haptic="medium"
            onPress={next}
          />
        </Animated.View>
      }>
      {eliminated ? (
        <>
          <Kicker align="center">{`Verdict · Manche ${String(game.round).padStart(2, '0')}`}</Kicker>
          <Animated.Text
            entering={FadeInDown.duration(520)}
            style={styles.name}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
            accessibilityRole="header">
            {eliminated.name}
          </Animated.Text>
          <Animated.Text entering={FadeIn.duration(400).delay(250)} style={styles.verdict}>
            est éliminé·e. C’était
          </Animated.Text>
          <RoleBand role={eliminated.role} />
          <Animated.Text
            entering={FadeIn.duration(500).delay(BAND_DELAY + BAND_DURATION + 150)}
            style={styles.hint}>
            {hint()}
          </Animated.Text>
        </>
      ) : (
        <>
          <Kicker align="center">Résultat du vote</Kicker>
          <Animated.Text
            entering={FadeInDown.duration(520)}
            style={styles.name}
            accessibilityRole="header">
            Égalité
          </Animated.Text>
          <View style={styles.tieRule} />
          <Animated.Text entering={FadeIn.duration(400).delay(250)} style={styles.verdict}>
            Personne n’est éliminé cette manche.
          </Animated.Text>
          <Text style={styles.hint}>Rediscutez et votez à nouveau.</Text>
        </>
      )}
    </Screen>
  );
}

/** Bandeau du rôle révélé en balayage, synchronisé avec un retour haptique. */
function RoleBand({ role }: { role: Role }) {
  const wipe = useSharedValue(0);

  useEffect(() => {
    wipe.set(
      withDelay(
        BAND_DELAY,
        withTiming(1, { duration: BAND_DURATION, easing: Easing.inOut(Easing.cubic) }),
      ),
    );
    const id = setTimeout(
      () => haptic(role === 'civilian' ? 'medium' : 'heavy'),
      BAND_DELAY + BAND_DURATION * 0.6,
    );
    return () => clearTimeout(id);
  }, [role, wipe]);

  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: wipe.get() }],
  }));
  const labelStyle = useAnimatedStyle(() => {
    const w = wipe.get();
    return {
      opacity: w < 0.55 ? 0 : (w - 0.55) / 0.45,
      transform: [{ translateY: (1 - w) * 10 }],
    };
  });

  const band =
    role === 'undercover'
      ? styles.bandUndercover
      : role === 'mrWhite'
        ? styles.bandWhite
        : styles.bandCivil;
  const labelColor = role === 'mrWhite' ? '#000000' : Palette.text;

  return (
    <View style={styles.bandWrap} accessible accessibilityLabel={`Rôle : ${roleLabel(role)}`}>
      <Animated.View style={[styles.band, band, bandStyle]} />
      <Animated.Text style={[styles.role, { color: labelColor }, labelStyle]}>
        {roleLabel(role)}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    gap: Space.md,
  },
  name: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.hero,
    lineHeight: Type.hero + 4,
    letterSpacing: 1.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  verdict: {
    color: Palette.textMuted,
    fontFamily: Font.mono,
    fontSize: Type.small,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bandWrap: {
    alignSelf: 'stretch',
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Space.md,
  },
  band: {
    ...StyleSheet.absoluteFill,
    transformOrigin: 'left',
  },
  bandUndercover: {
    backgroundColor: Palette.accent,
  },
  bandWhite: {
    backgroundColor: Palette.mrWhite,
  },
  bandCivil: {
    backgroundColor: Palette.surfaceRaised,
    borderWidth: 1.5,
    borderColor: Palette.text,
  },
  role: {
    fontFamily: Font.display,
    fontSize: 54,
    lineHeight: 58,
    letterSpacing: 4,
    includeFontPadding: false,
  },
  tieRule: {
    alignSelf: 'center',
    width: 56,
    height: 4,
    backgroundColor: Palette.accent,
  },
  hint: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
