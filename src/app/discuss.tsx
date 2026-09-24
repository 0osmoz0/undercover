import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Kicker } from '@/components/game/Kicker';
import { NoGame } from '@/components/game/NoGame';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Timer } from '@/components/game/Timer';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
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
    <Screen
      scroll
      footer={<PrimaryButton label="Passer au vote" haptic="medium" onPress={goVote} />}>
      <ScreenHeader
        kicker={`Manche ${String(game.round).padStart(2, '0')}`}
        title="Discussion"
        subtitle="Chacun donne un indice sur son mot, sans jamais le prononcer."
      />

      {starter ? (
        <View style={styles.starter} accessible accessibilityLabel={`${starter.name} commence`}>
          <Text style={styles.starterLabel}>Premier indice</Text>
          <Text style={styles.starterName} numberOfLines={1} adjustsFontSizeToFit>
            {starter.name}
          </Text>
        </View>
      ) : null}

      <Timer minutes={minutes} onMinutesChange={setMinutes} />

      <Kicker color={Palette.textMuted} style={styles.section}>
        {`En jeu · ${alive.length}`}
      </Kicker>
      <View style={styles.grid}>
        {alive.map((p) => (
          <PlayerChip key={p.id} name={p.name} compact style={styles.cell} />
        ))}
      </View>

      {eliminated.length > 0 ? (
        <>
          <Kicker color={Palette.textMuted} style={styles.section}>
            {`Éliminés · ${eliminated.length}`}
          </Kicker>
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
                      : Palette.textMuted
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
  starter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Space.md,
    marginBottom: Space.lg,
    paddingLeft: Space.md,
    borderLeftWidth: 3,
    borderColor: Palette.accent,
  },
  starterLabel: {
    color: Palette.textMuted,
    fontFamily: Font.monoBold,
    fontSize: Type.label,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  starterName: {
    flex: 1,
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  section: {
    marginTop: Space.xl,
    marginBottom: Space.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  cell: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  list: {
    gap: Space.sm,
  },
});
