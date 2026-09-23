import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Timer } from '@/components/game/Timer';
import { Palette, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';

export default function DiscussScreen() {
  const { game, startVote } = useGame();
  const [minutes, setMinutes] = useState(3);
  const [starterSeed] = useState(() => Math.random());
  useBlockBack();

  if (!game) return <NoGame />;

  const alive = game.players.filter((p) => !p.eliminated);
  const eliminated = game.players.filter((p) => p.eliminated);
  const starter = alive[Math.floor(starterSeed * alive.length)];

  const goVote = () => {
    startVote();
    router.replace('/vote');
  };

  return (
    <Screen scroll footer={<PrimaryButton label="Passer au vote" onPress={goVote} />}>
      <View style={styles.header}>
        <Text style={styles.round}>Manche {game.round}</Text>
        <Text style={styles.title} accessibilityRole="header">
          Discussion
        </Text>
        <Text style={styles.subtitle}>
          Chacun donne un indice sur son mot, sans le prononcer.
          {starter ? (
            <>
              {' '}
              <Text style={styles.starter}>{starter.name}</Text> commence.
            </>
          ) : null}
        </Text>
      </View>

      <Timer minutes={minutes} onMinutesChange={setMinutes} />

      <Text style={styles.section}>En jeu · {alive.length}</Text>
      <View style={styles.list}>
        {alive.map((p) => (
          <PlayerChip key={p.id} name={p.name} />
        ))}
      </View>

      {eliminated.length > 0 ? (
        <>
          <Text style={styles.section}>Éliminés · {eliminated.length}</Text>
          <View style={styles.list}>
            {eliminated.map((p) => (
              <PlayerChip
                key={p.id}
                name={p.name}
                eliminated
                detail={
                  p.role === 'undercover'
                    ? 'Undercover'
                    : p.role === 'mrWhite'
                      ? 'Mister White'
                      : 'Civil'
                }
                detailColor={
                  p.role === 'undercover'
                    ? Palette.danger
                    : p.role === 'mrWhite'
                      ? Palette.mrWhite
                      : Palette.text
                }
              />
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Space.xs,
    marginBottom: Space.lg,
  },
  round: {
    color: Palette.accent,
    fontSize: Type.label,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: Palette.text,
    fontSize: Type.title + 4,
    fontWeight: '900',
  },
  subtitle: {
    color: Palette.textMuted,
    fontSize: Type.body - 1,
    lineHeight: 23,
  },
  starter: {
    color: Palette.text,
    fontWeight: '800',
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
