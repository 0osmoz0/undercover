import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';

export default function EndScreen() {
  const { game, winner, resetGame } = useGame();

  // Pendant « Rejouer » / « Accueil », la partie est réinitialisée alors que l'écran se ferme encore.
  if (!game) return <Screen>{null}</Screen>;

  const civiliansWon = winner === 'civilians';
  const accent = civiliansWon ? Palette.success : Palette.danger;
  const winners = game.players.filter((p) =>
    civiliansWon ? p.role === 'civilian' : p.role === 'undercover',
  );
  const sorted = [...game.players].sort((a, b) =>
    a.role === b.role ? 0 : a.role === 'undercover' ? -1 : 1,
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
        <Text style={styles.kicker}>Fin de partie · {game.round} manche{game.round > 1 ? 's' : ''}</Text>
        <Text style={[styles.title, { color: accent }]} accessibilityRole="header">
          {civiliansWon ? 'Les Civils gagnent' : 'Les Undercover gagnent'}
        </Text>
        <Text style={styles.winners}>{winners.map((p) => p.name).join(' · ')}</Text>
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
            detail={`${p.role === 'undercover' ? 'Undercover' : 'Civil'} · ${p.word}${p.eliminated ? ' · éliminé' : ''}`}
            detailColor={p.role === 'undercover' ? Palette.danger : Palette.success}
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
