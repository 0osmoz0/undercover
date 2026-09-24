import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

import { Brackets } from './Brackets';
import { Kicker } from './Kicker';

type SecretRevealProps = {
  playerName: string;
  /** `null` pour Mister White (aucun mot). */
  word: string | null;
};

/** Déclassification du mot : balayage de scan, apparition, puis pulsation lente. */
export function SecretReveal({ playerName, word }: SecretRevealProps) {
  const isMrWhite = word === null;
  const tone = isMrWhite ? Palette.mrWhite : Palette.accent;

  const reveal = useSharedValue(0);
  const pulse = useSharedValue(1);
  const glitch = useSharedValue(0);
  const frameHeight = useSharedValue(240);

  useEffect(() => {
    reveal.set(withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    pulse.set(
      withDelay(
        900,
        withRepeat(
          withSequence(
            withTiming(1.035, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      ),
    );
    if (isMrWhite) {
      glitch.set(
        withRepeat(
          withSequence(
            withDelay(1400, withTiming(6, { duration: 60 })),
            withTiming(-4, { duration: 60 }),
            withTiming(2, { duration: 50 }),
            withTiming(0, { duration: 70 }),
          ),
          -1,
        ),
      );
    }
  }, [isMrWhite, reveal, pulse, glitch]);

  const wordStyle = useAnimatedStyle(() => {
    const r = reveal.get();
    return {
      opacity: r,
      transform: [{ scale: (0.86 + 0.14 * r) * pulse.get() }],
    };
  });

  const scanStyle = useAnimatedStyle(() => {
    const r = reveal.get();
    return {
      opacity: 1 - r,
      transform: [{ translateY: r * frameHeight.get() }],
    };
  });

  const ghostStyle = useAnimatedStyle(() => ({
    opacity: reveal.get() * 0.9,
    transform: [{ translateX: 3 + glitch.get() }, { scale: pulse.get() }],
  }));

  return (
    <View style={styles.root}>
      <Kicker color={tone} align="center">
        {isMrWhite ? 'Identité · Mister White' : `Mot secret · ${playerName}`}
      </Kicker>

      <Brackets color={tone} style={styles.frame}>
        <View
          style={styles.frameInner}
          onLayout={(e) => frameHeight.set(e.nativeEvent.layout.height)}>
          <Animated.View
            pointerEvents="none"
            style={[styles.scan, { backgroundColor: tone }, scanStyle]}
          />
          {isMrWhite ? (
            <View
              accessible
              accessibilityRole="header"
              accessibilityLabel="Mister White : tu n’as pas de mot">
              <Animated.Text style={[styles.blank, styles.ghost, ghostStyle]}>???</Animated.Text>
              <Animated.Text style={[styles.blank, wordStyle]}>???</Animated.Text>
            </View>
          ) : (
            <Animated.Text
              style={[styles.word, wordStyle]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.45}
              accessibilityRole="header">
              {word}
            </Animated.Text>
          )}
        </View>
      </Brackets>

      <Animated.View entering={FadeIn.duration(400).delay(650)} style={styles.captionBlock}>
        {isMrWhite ? (
          <>
            <Text style={styles.captionTitle}>Tu n’as pas de mot.</Text>
            <Text style={styles.caption}>
              Écoute les indices, bluffe, survis. Si tu es démasqué, tu auras une chance de deviner
              le mot des Civils.
            </Text>
          </>
        ) : (
          <Text style={styles.caption}>
            Mémorise-le sans rien laisser paraître, puis cache l’écran avant de passer le
            téléphone.
          </Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    gap: Space.lg,
  },
  frame: {
    alignSelf: 'stretch',
  },
  frameInner: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.lg,
    paddingVertical: Space.xl,
    overflow: 'hidden',
  },
  scan: {
    position: 'absolute',
    top: 0,
    left: Space.md,
    right: Space.md,
    height: 2,
  },
  word: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.secret,
    lineHeight: Type.secret + 4,
    letterSpacing: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  blank: {
    color: Palette.mrWhite,
    fontFamily: Font.display,
    fontSize: 150,
    lineHeight: 150,
    letterSpacing: 10,
    textAlign: 'center',
    includeFontPadding: false,
  },
  ghost: {
    ...StyleSheet.absoluteFill,
    color: Palette.accent,
  },
  captionBlock: {
    gap: Space.xs,
    alignItems: 'center',
  },
  captionTitle: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
    fontSize: Type.body + 1,
    textAlign: 'center',
  },
  caption: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body - 1,
    lineHeight: 23,
    textAlign: 'center',
  },
});
