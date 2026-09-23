import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';

const logo = require('../../assets/images/esiee-undercover-logo.png');

export default function HomeScreen() {
  return (
    <Screen
      style={styles.content}
      footer={
        <>
          <PrimaryButton label="Nouvelle partie" onPress={() => router.push('/setup')} />
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/rules')}
            hitSlop={10}
            style={({ pressed }) => [styles.rulesLink, pressed && styles.pressed]}>
            <Text style={styles.rulesText}>Comment on joue ?</Text>
          </Pressable>
        </>
      }>
      <View style={styles.hero}>
        <Image
          source={logo}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="ESIEE Paris Undercover"
        />
        <Text style={styles.kicker}>Jeu d’ambiance · 3 à 10 joueurs</Text>
        <Text style={styles.subtitle}>
          Un seul téléphone, un mot secret chacun.{'\n'}Démasquez l’intrus avant qu’il ne vous
          démasque.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: Space.md,
  },
  logo: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 500 / 571,
    marginBottom: Space.sm,
  },
  kicker: {
    color: Palette.accent,
    fontSize: Type.label,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitle: {
    color: Palette.textMuted,
    fontSize: Type.body,
    lineHeight: 25,
    textAlign: 'center',
  },
  rulesLink: {
    alignSelf: 'center',
    paddingVertical: Space.sm + 2,
    paddingHorizontal: Space.md,
  },
  rulesText: {
    color: Palette.text,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: Palette.accent,
  },
  pressed: {
    opacity: 0.6,
  },
});
