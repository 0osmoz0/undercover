import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';
import { roleLabel, type Role } from '../../lib/game';

function roleColor(role: Role): string {
  if (role === 'undercover') return Palette.danger;
  if (role === 'mrWhite') return Palette.mrWhite;
  return Palette.success;
}

function winnerTitle(winner: string | null): string {
  if (winner === 'civilians') return 'Les Civils gagnent';
  if (winner === 'mrWhite') return 'Mister White gagne';
  return 'Les Undercover gagnent';
}

function roleSort(a: Role, b: Role): number {
  const order: Role[] = ['mrWhite', 'undercover', 'civilian'];
  return order.indexOf(a) - order.indexOf(b);
}

export default function EndScreen() {
  const { game, winner, resetGame } = useGame();

  if (!game) return <Screen>{null}</Screen>;

  const accent =
    winner === 'civilians'
      ? Palette.success
      : winner === 'mrWhite'
        ? Palette.mrWhite
        : Palette.danger;

  const winners = game.players.filter((p) => {
    if (winner === 'civilians') return p.role === 'civilian';
    if (winner === 'mrWhite') return p.role === 'mrWhite';
    return p.role === 'undercover';
  });

  const sorted = [...game.players].sort((a, b) =>
    a.role === b.role ? 0 : roleSort(a.role, b.role),
  );

  const replay = () => {
    router.dismissTo('/setup');
    resetGame();
  };

  const home = () => {
    router.dismissTo('/');
    resetGame();
  };

  return (
    <Screen
      scroll
      footer={
        <>
          <PrimaryButton label="Rejouer" onPress={replay} />
          <PrimaryButton label="Accueil" variant="ghost" size="md" onPress={home} />
        </>
      }>
      <View style={[styles.banner, { borderColor: accent }]}>
        <Text style={styles.kicker}>
          Fin de partie · {game.round} manche{game.round > 1 ? 's' : ''}
        </Text>
        <Text style={[styles.title, { color: accent }]} accessibilityRole="header">
          {winnerTitle(winner)}
        </Text>
        <Text style={styles.winners}>{winners.map((p) => p.name).join(' · ')}</Text>
        {game.mrWhiteGuessCorrect === true ? (
          <Text style={styles.guessNote}>Mister White a trouvé le mot des Civils.</Text>
        ) : null}
      </View>

      <View style={styles.words}>
        <WordBox label="Mot des Civils" word={game.wordPair.civilian} color={Palette.success} />
        <WordBox label="Mot Undercover" word={game.wordPair.undercover} color={Palette.danger} />
      </View>

      <Text style={styles.section}>Tous les rôles</Text>
      <View style={styles.list}>
        {sorted.map((p) => (
          <PlayerChip
            key={p.id}
            name={p.name}
            eliminated={p.eliminated}
            detail={`${roleLabel(p.role)} · ${p.role === 'mrWhite' ? 'pas de mot' : p.word}${p.eliminated ? ' · éliminé' : ''}`}
            detailColor={roleColor(p.role)}
          />
        ))}
      </View>
    </Screen>
  );
}

function WordBox({ label, word, color }: { label: string; word: string; color: string }) {
  return (
    <View style={[styles.wordBox, { borderTopColor: color }]}>
      <Text style={styles.wordLabel}>{label}</Text>
      <Text style={styles.word} numberOfLines={1} adjustsFontSizeToFit>
        {word}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: Space.sm,
    paddingVertical: Space.lg,
    paddingHorizontal: Space.lg,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
  },
  kicker: {
    color: Palette.textMuted,
    fontSize: Type.label,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Type.title + 4,
    lineHeight: Type.title + 10,
    fontWeight: '900',
  },
  winners: {
    color: Palette.text,
    fontSize: Type.body,
    fontWeight: '700',
  },
  guessNote: {
    color: Palette.mrWhite,
    fontSize: Type.small,
    fontWeight: '700',
  },
  words: {
    flexDirection: 'row',
    gap: Space.sm,
    marginTop: Space.lg,
  },
  wordBox: {
    flex: 1,
    gap: Space.xs,
    padding: Space.md,
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    borderTopWidth: 4,
  },
  wordLabel: {
    color: Palette.textMuted,
    fontSize: Type.label,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  word: {
    color: Palette.text,
    fontSize: Type.heading + 2,
    fontWeight: '900',
  },
  section: {
    color: Palette.textMuted,
    fontSize: Type.label,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: Space.xl,
    marginBottom: Space.sm,
  },
  list: {
    gap: Space.sm,
  },
});
