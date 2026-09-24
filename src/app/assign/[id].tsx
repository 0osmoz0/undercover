import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PassPhone } from '@/components/game/PassPhone';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { SecretReveal } from '@/components/game/SecretReveal';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';

export default function AssignScreen() {
  const { game, hideWordAndAdvance } = useGame();
  const [revealed, setRevealed] = useState(false);
  useBlockBack();

  const index = game?.assignIndex ?? 0;
  const total = game?.players.length ?? 0;
  const done = Boolean(game) && index >= total;

  useEffect(() => {
    if (done) {
      router.replace('/discuss');
    }
  }, [done]);

  if (!game) return <NoGame />;
  if (done) return <Screen>{null}</Screen>;

  const player = game.players[index];
  const isMrWhite = player.role === 'mrWhite';

  const memorized = () => {
    setRevealed(false);
    const next = index + 1;
    hideWordAndAdvance();
    if (next < total) {
      router.setParams({ id: String(next) });
    }
  };

  if (!revealed) {
    return (
      <Screen
        footer={
          <PrimaryButton
            label="Voir mon mot"
            haptic="heavy"
            accessibilityHint={`Réservé à ${player.name}`}
            onPress={() => setRevealed(true)}
          />
        }>
        <PassPhone
          key={player.id}
          step="Distribution des mots"
          current={index}
          total={total}
          name={player.name}
          hint={`Les autres, détournez les yeux. Seul ${player.name} doit voir l’écran.`}
        />
      </Screen>
    );
  }

  return (
    <Screen
      tone={isMrWhite ? 'white' : 'neutral'}
      style={styles.center}
      footer={
        <PrimaryButton
          label={isMrWhite ? 'J’ai compris · Cacher' : 'J’ai mémorisé · Cacher'}
          variant={isMrWhite ? 'white' : 'primary'}
          haptic="medium"
          onPress={memorized}
        />
      }>
      <SecretReveal
        key={player.id}
        playerName={player.name}
        word={isMrWhite ? null : player.word}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
  },
});
