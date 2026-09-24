import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Kicker } from '@/components/game/Kicker';
import { PlayerChip } from '@/components/game/PlayerChip';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { haptic } from '@/lib/haptics';
import { roleLabel, type Role } from '../../lib/game';

function roleColor(role: Role): string {
  if (role === 'undercover') return Palette.danger;
  if (role === 'mrWhite') return Palette.mrWhite;
  return Palette.success;
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
      ? Palette.text
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

  const title =
    winner === 'civilians'
      ? 'Les Civils\ngagnent'
      : winner === 'mrWhite'
        ? 'Mister White\ngagne'
        : 'Les Undercover\ngagnent';

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
      tone={winner === 'civilians' ? 'neutral' : winner === 'mrWhite' ? 'white' : 'alert'}
      footer={
        <>
          <PrimaryButton label="Rejouer" haptic="medium" onPress={replay} />
          <PrimaryButton label="Accueil" variant="ghost" size="md" onPress={home} />
        </>
      }>
      <View style={styles.banner}>
        <Kicker color={Palette.textMuted}>
          {`Mission terminée · ${game.round} manche${game.round > 1 ? 's' : ''}`}
        </Kicker>
        <VictoryTitle title={title} color={accent} />
        <Animated.Text entering={FadeIn.duration(500).delay(700)} style={styles.winners}>
          {winners.map((p) => p.name).join('  ·  ')}
        </Animated.Text>
        {game.mrWhiteGuessCorrect === true ? (
          <Animated.Text entering={FadeIn.duration(500).delay(850)} style={styles.guessNote}>
            Mister White a trouvé le mot des Civils.
          </Animated.Text>
        ) : null}
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(900)} style={styles.words}>
        <WordBox label="Mot des Civils" word={game.wordPair.civilian} color={Palette.text} />
        <WordBox label="Mot Undercover" word={game.wordPair.undercover} color={Palette.danger} />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(500).delay(1100)}>
        <Kicker color={Palette.textMuted} style={styles.section}>
          Dossiers déclassifiés
        </Kicker>
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
      </Animated.View>
    </Screen>
  );
}

/** Titre de victoire « tamponné » : arrive grand et incliné puis s’écrase en place. */
function VictoryTitle({ title, color }: { title: string; color: string }) {
  const { width } = useWindowDimensions();
  const available = Math.min(width, 560) - Space.lg * 2;
  const longest = Math.max(...title.split('\n').map((line) => line.length));
  const fontSize = Math.min(Type.hero, Math.floor(available / (longest * 0.43)));

  const stamp = useSharedValue(0);
  const rule = useSharedValue(0);

  useEffect(() => {
    stamp.set(withDelay(150, withSpring(1, { damping: 14, stiffness: 180, mass: 0.9 })));
    rule.set(withDelay(550, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })));
    const id = setTimeout(() => haptic('success'), 320);
    return () => clearTimeout(id);
  }, [stamp, rule]);

  const titleStyle = useAnimatedStyle(() => {
    const s = stamp.get();
    return {
      opacity: Math.min(1, s * 1.6),
      transform: [{ scale: 1.5 - 0.5 * s }, { rotate: `${(1 - s) * -6}deg` }],
    };
  });
  const ruleStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: rule.get() }],
  }));

  return (
    <View style={styles.titleWrap}>
      <Animated.Text
        style={[styles.title, { color, fontSize, lineHeight: fontSize * 0.95 }, titleStyle]}
        accessibilityRole="header"
        adjustsFontSizeToFit
        numberOfLines={2}>
        {title}
      </Animated.Text>
      <Animated.View style={[styles.titleRule, { backgroundColor: color }, ruleStyle]} />
    </View>
  );
}

function WordBox({ label, word, color }: { label: string; word: string; color: string }) {
  return (
    <View style={[styles.wordBox, { borderTopColor: color }]}>
      <Text style={styles.wordLabel}>{label}</Text>
      <Text style={[styles.word, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {word}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: Space.md,
    paddingTop: Space.lg,
  },
  titleWrap: {
    gap: Space.md,
  },
  title: {
    fontFamily: Font.display,
    letterSpacing: 1,
    includeFontPadding: false,
    transformOrigin: 'left',
  },
  titleRule: {
    width: 72,
    height: 4,
    transformOrigin: 'left',
  },
  winners: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: Type.body + 1,
  },
  guessNote: {
    color: Palette.mrWhite,
    fontFamily: Font.mono,
    fontSize: Type.small - 1,
    letterSpacing: 0.5,
  },
  words: {
    flexDirection: 'row',
    gap: Space.sm,
    marginTop: Space.xl,
  },
  wordBox: {
    flex: 1,
    gap: Space.xs,
    padding: Space.md,
    backgroundColor: Palette.surface,
    borderRadius: Radius.xs,
    borderTopWidth: 3,
  },
  wordLabel: {
    color: Palette.textMuted,
    fontFamily: Font.monoBold,
    fontSize: Type.label - 1,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  word: {
    fontFamily: Font.display,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  section: {
    marginTop: Space.xl,
    marginBottom: Space.md,
  },
  list: {
    gap: Space.sm,
  },
});
