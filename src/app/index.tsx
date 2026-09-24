import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Kicker } from '@/components/game/Kicker';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

const logo = require('../../assets/images/esiee-undercover-logo.png');

export default function HomeScreen() {
  const intro = useSharedValue(0);
  const rule = useSharedValue(0);

  useEffect(() => {
    intro.set(withTiming(1, { duration: 900, easing: Easing.out(Easing.exp) }));
    rule.set(withDelay(550, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })));
  }, [intro, rule]);

  const logoStyle = useAnimatedStyle(() => {
    const p = intro.get();
    return {
      opacity: p,
      transform: [{ translateY: (1 - p) * 18 }, { scale: 0.92 + 0.08 * p }],
    };
  });

  const ruleStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: rule.get() }],
  }));

  return (
    <Screen
      style={styles.content}
      footer={
        <Animated.View entering={FadeInDown.duration(500).delay(700)} style={styles.footer}>
          <PrimaryButton
            label="Nouvelle partie"
            haptic="medium"
            onPress={() => router.push('/setup')}
          />
          <PrimaryButton
            label="Comment on joue ?"
            variant="ghost"
            size="md"
            haptic="selection"
            onPress={() => router.push('/rules')}
          />
        </Animated.View>
      }>
      <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.topBar}>
        <Kicker>Dossier classifié</Kicker>
        <Text style={styles.topMeta}>ESIEE · PARIS</Text>
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image
            source={logo}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="ESIEE Paris Undercover"
          />
        </Animated.View>

        <Animated.View style={[styles.rule, ruleStyle]} />

        <Animated.View entering={FadeIn.duration(600).delay(650)} style={styles.copy}>
          <Text style={styles.tagline}>
            Un téléphone.{'\n'}Un mot secret chacun.{'\n'}
            <Text style={styles.taglineAccent}>Un intrus parmi vous.</Text>
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.duration(600).delay(850)} style={styles.meta}>
        <MetaItem value="3–10" label="Joueurs" />
        <View style={styles.metaDivider} />
        <MetaItem value="1" label="Téléphone" />
        <View style={styles.metaDivider} />
        <MetaItem value="0" label="Connexion" />
      </Animated.View>
    </Screen>
  );
}

function MetaItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metaItem} accessible accessibilityLabel={`${value} ${label}`}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topMeta: {
    color: Palette.textFaint,
    fontFamily: Font.mono,
    fontSize: Type.label,
    letterSpacing: 2,
  },
  hero: {
    alignItems: 'center',
    gap: Space.lg,
  },
  logoWrap: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: '88%',
    maxWidth: 320,
    aspectRatio: 500 / 571,
  },
  rule: {
    width: 64,
    height: 3,
    backgroundColor: Palette.accent,
  },
  copy: {
    alignItems: 'center',
  },
  tagline: {
    color: Palette.textMuted,
    fontFamily: Font.bodySemi,
    fontSize: Type.body + 2,
    lineHeight: 27,
    textAlign: 'center',
  },
  taglineAccent: {
    color: Palette.text,
    fontFamily: Font.bodyBold,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metaValue: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  metaLabel: {
    color: Palette.textFaint,
    fontFamily: Font.mono,
    fontSize: Type.label - 1,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: Palette.border,
  },
  footer: {
    gap: Space.xs,
  },
});
