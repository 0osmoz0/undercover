import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';

export default function VoteScreen() {
  const { game, phase, submitVote, finishVoting, allVoted } = useGame();
  const [stage, setStage] = useState<'pass' | 'choose'>('pass');
  const [selected, setSelected] = useState<string | null>(null);
  const resolved = useRef(false);
  useBlockBack();

  const ready = phase === 'vote' && allVoted;

  useEffect(() => {
    if (!ready || resolved.current) return;
    resolved.current = true;
    finishVoting();
    // Navigation différée : la phase devient reveal | guess | ended
  }, [ready, finishVoting]);

  useEffect(() => {
    if (!resolved.current) return;
    if (phase === 'guess') {
      router.replace('/guess');
    } else if (phase === 'reveal' || phase === 'ended') {
      // Toujours montrer la révélation avant l’écran de fin
      router.replace('/reveal');
    }
  }, [phase]);

  if (!game) return <NoGame />;

  const alive = game.players.filter((p) => !p.eliminated);
  const voter = alive.find((p) => !game.votes[p.id]);
  const votedCount = alive.length - alive.filter((p) => !game.votes[p.id]).length;

  if (!voter || ready) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.progress}>Dépouillement…</Text>
      </Screen>
    );
  }

  const confirm = () => {
    if (!selected) return;
    submitVote(voter.id, selected);
    setSelected(null);
    setStage('pass');
  };

  if (stage === 'pass') {
    return (
      <Screen
        style={styles.center}
        footer={<PrimaryButton label="Je suis prêt à voter" onPress={() => setStage('choose')} />}>
        <Text style={styles.progress}>
          Vote secret · {votedCount + 1} / {alive.length}
        </Text>
        <View style={styles.passBlock}>
          <Text style={styles.passLabel}>Passe le téléphone à</Text>
          <Text style={styles.passName} numberOfLines={2} adjustsFontSizeToFit>
            {voter.name}
          </Text>
          <Text style={styles.passHint}>Personne d’autre ne doit voir ton choix.</Text>
        </View>
      </Screen>
    );
  }

  const targets = alive.filter((p) => p.id !== voter.id);

  return (
    <Screen
      scroll
      footer={
        <PrimaryButton
          label={selected ? 'Confirmer mon vote' : 'Choisis un joueur'}
          onPress={confirm}
          disabled={!selected}
        />
      }>
      <View style={styles.header}>
        <Text style={styles.progress}>{voter.name}</Text>
        <Text style={styles.title} accessibilityRole="header">
          Qui est l’Undercover ?
        </Text>
      </View>
      <View style={styles.list}>
        {targets.map((p) => (
          <PlayerChip
            key={p.id}
            name={p.name}
            selected={selected === p.id}
            onPress={() => setSelected(p.id)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.xl,
  },
  header: {
    gap: Space.xs,
    marginBottom: Space.lg,
  },
  progress: {
    color: Palette.accent,
    fontSize: Type.small,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: Palette.text,
    fontSize: Type.title,
    fontWeight: '900',
  },
  passBlock: {
    alignItems: 'center',
    gap: Space.md,
    alignSelf: 'stretch',
  },
  passLabel: {
    color: Palette.textMuted,
    fontSize: Type.heading,
    fontWeight: '600',
  },
  passName: {
    color: Palette.text,
    fontSize: Type.display,
    fontWeight: '900',
    textAlign: 'center',
  },
  passHint: {
    color: Palette.textFaint,
    fontSize: Type.body - 1,
    textAlign: 'center',
    marginTop: Space.md,
  },
  list: {
    gap: Space.sm,
  },
});
