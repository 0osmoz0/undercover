import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';
import { roleLabel, type Role } from '../../lib/game';

function roleColor(role: Role): string {
  if (role === 'undercover') return Palette.danger;
  if (role === 'mrWhite') return Palette.mrWhite;
  return Palette.success;
}

function onRoleColor(role: Role): string {
  if (role === 'undercover') return Palette.onAccent;
  return '#111111';
}

export default function RevealScreen() {
  const { game, winner, continueAfterReveal } = useGame();
  useBlockBack();

  if (!game) return <NoGame />;

  const eliminated = game.lastEliminatedId
    ? game.players.find((p) => p.id === game.lastEliminatedId)
    : undefined;
  const color = eliminated ? roleColor(eliminated.role) : Palette.accent;

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
      style={styles.center}
      footer={
        <PrimaryButton
          label={winner ? 'Voir les résultats' : 'Manche suivante'}
          onPress={next}
        />
      }>
      {eliminated ? (
        <>
          <Text style={styles.kicker}>Le village a tranché</Text>
          <View style={[styles.card, { borderColor: color }]}>
            <Text style={styles.name} numberOfLines={2} adjustsFontSizeToFit>
              {eliminated.name}
            </Text>
            <Text style={styles.verdict}>est éliminé·e. C’était</Text>
            <View style={[styles.roleBand, { backgroundColor: color }]}>
              <Text style={[styles.role, { color: onRoleColor(eliminated.role) }]}>
                {roleLabel(eliminated.role)}
              </Text>
            </View>
          </View>
          <Text style={styles.hint}>{hint()}</Text>
        </>
      ) : (
        <>
          <Text style={styles.kicker}>Résultat du vote</Text>
          <View style={[styles.card, { borderColor: Palette.accent }]}>
            <Text style={styles.name}>Égalité</Text>
            <Text style={styles.verdict}>Personne n’est éliminé cette manche.</Text>
          </View>
          <Text style={styles.hint}>Rediscutez et votez à nouveau.</Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    gap: Space.xl,
  },
  kicker: {
    color: Palette.textMuted,
    fontSize: Type.small,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.xl,
    paddingHorizontal: Space.lg,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    overflow: 'hidden',
  },
  name: {
    color: Palette.text,
    fontSize: Type.display,
    fontWeight: '900',
    textAlign: 'center',
  },
  verdict: {
    color: Palette.textMuted,
    fontSize: Type.body + 1,
    fontWeight: '600',
    textAlign: 'center',
  },
  roleBand: {
    alignSelf: 'stretch',
    paddingVertical: Space.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  role: {
    fontSize: Type.title,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  hint: {
    color: Palette.textMuted,
    fontSize: Type.body,
    textAlign: 'center',
  },
});
