import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Kicker } from '@/components/game/Kicker';
import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Palette, Radius, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';
import { useGame } from '@/context/game-context';
import { haptic } from '@/lib/haptics';
import { getThemeGroups, type ThemeDef } from '../../lib/themes';

export default function ThemesScreen() {
  const { selectedThemeId, setSelectedThemeId, selectedTheme } = useGame();
  const groups = getThemeGroups();

  const select = (theme: ThemeDef) => {
    haptic('selection');
    setSelectedThemeId(theme.id);
  };

  const continueToSetup = () => {
    if (!selectedThemeId) return;
    haptic('medium');
    router.push('/setup');
  };

  return (
    <Screen
      scroll
      footer={
        <PrimaryButton
          label={
            selectedTheme
              ? `Continuer · ${selectedTheme.title}`
              : 'Choisis un thème'
          }
          haptic="medium"
          disabled={!selectedThemeId}
          onPress={continueToSetup}
        />
      }>
      <Pressable
        accessibilityRole="button"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        hitSlop={12}
        style={styles.backWrap}>
        <Text style={styles.back}>‹ Accueil</Text>
      </Pressable>

      <ScreenHeader
        kicker="Briefing"
        title="Choisis un thème"
        subtitle="Les mots secrets viendront de ce pack. Culture pop, Disney, filières ESIEE…"
      />

      {groups.map((section) => (
        <View key={section.group} style={styles.section}>
          <Kicker color={Palette.textMuted} style={styles.sectionTitle}>
            {section.group}
          </Kicker>
          <View style={styles.list}>
            {section.themes.map((theme) => {
              const selected = theme.id === selectedThemeId;
              return (
                <Pressable
                  key={theme.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => select(theme)}
                  style={({ pressed }) => [
                    styles.card,
                    selected && styles.cardSelected,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.cardTop}>
                    <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>
                      {theme.title}
                    </Text>
                    <Text style={styles.count}>{theme.pairs.length} paires</Text>
                  </View>
                  <Text style={styles.cardSubtitle}>{theme.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  backWrap: {
    marginBottom: Space.md,
  },
  back: {
    color: Palette.textMuted,
    fontFamily: Font.bodySemi,
    fontSize: 16,
  },
  section: {
    marginBottom: Space.xl,
  },
  sectionTitle: {
    marginBottom: Space.md,
  },
  list: {
    gap: Space.sm,
  },
  card: {
    paddingVertical: Space.md,
    paddingHorizontal: Space.md,
    backgroundColor: Palette.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    gap: Space.xs,
  },
  cardSelected: {
    borderColor: Palette.accent,
    backgroundColor: Palette.surfaceRaised,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  cardTitle: {
    flex: 1,
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  cardTitleSelected: {
    color: Palette.accent,
  },
  count: {
    color: Palette.textFaint,
    fontFamily: Font.monoBold,
    fontSize: Type.label,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.small,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
