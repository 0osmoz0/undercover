import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { useBlockBack } from '@/hooks/use-block-back';
import { haptic } from '@/lib/haptics';

/**
 * Élimination simplifiée : le groupe décide à voix haute,
 * puis on tape le pseudo sur le téléphone.
 */
export default function EliminateScreen() {
  const { game, eliminatePlayerById } = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useBlockBack();

  if (!game) return <NoGame />;

  const alive = game.players.filter((p) => !p.eliminated);
  const target = alive.find((p) => p.id === selected);

  const confirm = () => {
    if (!selected || busy) return;
    setBusy(true);
    haptic('heavy');
    const next = eliminatePlayerById(selected);
    if (next?.phase === 'guess') {
      router.replace('/guess');
    } else {
      router.replace('/reveal');
    }
  };

  return (
    <Screen
      scroll
      footer={
        <PrimaryButton
          label={target ? `Éliminer ${target.name}` : 'Choisis un joueur'}
          haptic="heavy"
          onPress={confirm}
          disabled={!selected || busy}
          variant={selected ? 'danger' : 'primary'}
        />
      }>
      <ScreenHeader
        kicker={`Manche ${String(game.round).padStart(2, '0')} · élimination`}
        title="Qui part ?"
        subtitle="Décidez à voix haute, puis appuyez sur le pseudo. Son rôle sera révélé juste après."
      />

      <View style={styles.list}>
        {alive.map((p) => (
          <PlayerChip
            key={p.id}
            name={p.name}
            selected={selected === p.id}
            onPress={() => {
              haptic('selection');
              setSelected(p.id);
            }}
          />
        ))}
      </View>

      {selected ? (
        <Text style={styles.hint}>
          Tout le monde est d’accord ? Confirmez pour révéler le rôle.
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Space.sm,
  },
  hint: {
    marginTop: Space.lg,
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body - 1,
    textAlign: 'center',
    lineHeight: 22,
  },
});
