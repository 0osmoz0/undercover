import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { Palette, Space, Type } from '@/constants/colors';

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Les mots',
    body: 'Les Civils reçoivent tous le même mot. Les Undercover reçoivent un mot proche, mais différent. Personne ne sait dans quel camp il est.',
  },
  {
    title: 'Le téléphone circule',
    body: 'Chacun découvre son mot en secret, le mémorise, puis passe le téléphone au joueur suivant.',
  },
  {
    title: 'La discussion',
    body: 'À tour de rôle, chacun donne un indice sur son mot, sans le dire. Assez précis pour prouver votre camp, assez flou pour ne pas aider l’intrus.',
  },
  {
    title: 'Le vote',
    body: 'Chaque joueur vote en secret contre celui qu’il soupçonne. Le plus désigné est éliminé et son rôle révélé. En cas d’égalité, personne ne part.',
  },
  {
    title: 'La victoire',
    body: 'Les Civils gagnent s’ils éliminent tous les Undercover. Les Undercover gagnent s’ils sont aussi nombreux que les Civils encore en jeu.',
  },
];

export default function RulesScreen() {
  return (
    <Screen
      scroll
      footer={
        <PrimaryButton
          label="Compris"
          variant="secondary"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      }>
      <Text style={styles.title} accessibilityRole="header">
        Les règles
      </Text>
      <View style={styles.list}>
        {STEPS.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepBody}>{step.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Palette.text,
    fontSize: Type.title + 4,
    fontWeight: '900',
    marginBottom: Space.lg,
  },
  list: {
    gap: Space.lg,
  },
  step: {
    flexDirection: 'row',
    gap: Space.md,
  },
  number: {
    color: Palette.accent,
    fontSize: Type.heading,
    fontWeight: '900',
    width: 36,
    fontVariant: ['tabular-nums'],
  },
  stepText: {
    flex: 1,
    gap: Space.xs,
  },
  stepTitle: {
    color: Palette.text,
    fontSize: Type.body + 1,
    fontWeight: '800',
  },
  stepBody: {
    color: Palette.textMuted,
    fontSize: Type.body - 1,
    lineHeight: 23,
  },
});
