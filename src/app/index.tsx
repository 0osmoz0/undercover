import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';

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
        <Text style={styles.kicker}>Jeu d’ambiance · 3 à 10 joueurs</Text>
        <Text style={styles.title} accessibilityRole="header">
          UNDER{'\n'}COVER
        </Text>
        <View style={styles.rule} />
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
    gap: Space.md,
  },
  kicker: {
    color: Palette.accent,
    fontSize: Type.label,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: Palette.text,
    fontSize: 64,
    lineHeight: 64,
    fontWeight: '900',
    letterSpacing: 4,
  },
  rule: {
    width: 56,
    height: 4,
    backgroundColor: Palette.accent,
  },
  subtitle: {
    color: Palette.textMuted,
    fontSize: Type.body,
    lineHeight: 25,
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
