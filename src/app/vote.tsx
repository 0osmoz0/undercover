import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Crosshair } from '@/components/game/Crosshair';
import { Kicker } from '@/components/game/Kicker';
import { NoGame } from '@/components/game/NoGame';
import { PassPhone } from '@/components/game/PassPhone';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
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
        <Crosshair size={96} lockOn />
        <Kicker align="center">Dépouillement</Kicker>
        <Text style={styles.tally}>Les votes sont comptés…</Text>
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
        footer={
          <PrimaryButton
            label="Je suis prêt à voter"
            haptic="medium"
            onPress={() => setStage('choose')}
          />
        }>
        <PassPhone
          key={voter.id}
          step="Vote secret"
          current={votedCount}
          total={alive.length}
          name={voter.name}
          hint="Personne d’autre ne doit voir ton choix. Le vote reste anonyme."
        />
      </Screen>
    );
  }

  const targets = alive.filter((p) => p.id !== voter.id);

  return (
    <Screen
      scroll
      footer={
        <PrimaryButton
          label={selected ? 'Confirmer mon vote' : 'Choisis une cible'}
          haptic="heavy"
          onPress={confirm}
          disabled={!selected}
        />
      }>
      <ScreenHeader
        kicker={`${voter.name} · vote secret`}
        title="Qui est l’intrus ?"
        subtitle="Désigne le joueur que tu veux éliminer."
      />
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
    gap: Space.lg,
  },
  tally: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body,
  },
  list: {
    gap: Space.sm,
  },
});
