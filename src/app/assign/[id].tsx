import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NoGame } from '@/components/game/NoGame';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
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
        style={styles.center}
        footer={<PrimaryButton label="Voir mon mot" onPress={() => setRevealed(true)} />}>
        <Text style={styles.progress}>
          Joueur {index + 1} / {total}
        </Text>
        <View style={styles.passBlock}>
          <Text style={styles.passLabel}>Passe le téléphone à</Text>
          <Text style={styles.passName} numberOfLines={2} adjustsFontSizeToFit>
            {player.name}
          </Text>
          <Text style={styles.passHint}>
            Les autres, détournez les yeux.{'\n'}Seul {player.name} doit voir l’écran.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      style={styles.center}
      footer={
        <PrimaryButton
          label={isMrWhite ? 'J’ai compris' : 'J’ai mémorisé'}
          onPress={memorized}
        />
      }>
      {isMrWhite ? (
        <>
          <Text style={styles.progress}>{player.name}</Text>
          <View style={[styles.wordCard, styles.whiteCard]}>
            <Text style={styles.whiteRole}>Mister White</Text>
            <Text style={styles.whiteBlank}>???</Text>
          </View>
          <Text style={styles.wordHint}>
            Tu n’as pas de mot. Écoute les autres, bluffe, et essaie de
            survivre… ou de trouver le mot des Civils si tu es éliminé.
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.progress}>{player.name}, ton mot est</Text>
          <View style={styles.wordCard}>
            <Text
              style={styles.word}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              accessibilityRole="header">
              {player.word}
            </Text>
          </View>
          <Text style={styles.wordHint}>
            Mémorise-le, puis cache l’écran avant de passer le téléphone.
          </Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.xl,
  },
  progress: {
    color: Palette.textMuted,
    fontSize: Type.small,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
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
    lineHeight: 23,
    textAlign: 'center',
    marginTop: Space.md,
  },
  wordCard: {
    alignSelf: 'stretch',
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.lg,
    paddingVertical: Space.xl,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Palette.accent,
  },
  word: {
    color: Palette.accent,
    fontSize: Type.secret,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  wordHint: {
    color: Palette.textMuted,
    fontSize: Type.body - 1,
    lineHeight: 23,
    textAlign: 'center',
  },
  whiteCard: {
    borderColor: Palette.mrWhite,
    gap: Space.md,
  },
  whiteRole: {
    color: Palette.mrWhite,
    fontSize: Type.small,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  whiteBlank: {
    color: Palette.text,
    fontSize: Type.secret,
    fontWeight: '900',
    letterSpacing: 8,
  },
});
