import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/game/PrimaryButton';
import { Screen } from '@/components/game/Screen';
import { ScreenHeader } from '@/components/game/ScreenHeader';
import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Les mots',
    body: 'Les Civils reçoivent tous le même mot. Les Undercover reçoivent un mot proche, mais différent. Mister White n’a aucun mot : il doit bluffer.',
  },
  {
    title: 'Le téléphone circule',
    body: 'Chacun découvre son mot (ou son absence de mot) en secret, puis passe le téléphone au joueur suivant.',
  },
  {
    title: 'La discussion',
    body: 'À tour de rôle, chacun donne un indice. Mister White invente à partir des indices des autres.',
  },
  {
    title: 'Le vote',
    body: 'Chaque joueur vote en secret. Le plus désigné est éliminé et son rôle révélé. En cas d’égalité, personne ne part.',
  },
  {
    title: 'Mister White',
    body: 'S’il est éliminé, il peut tenter de trouver le mot des Civils : s’il réussit, il gagne seul. S’il reste en vie jusqu’à 2 joueurs, il gagne aussi.',
  },
  {
    title: 'La victoire',
    body: 'Les Civils gagnent en éliminant tous les Undercover et Mister White. Les Undercover gagnent s’ils sont aussi nombreux que les Civils encore en jeu.',
  },
];

const ROLES: { name: string; color: string; body: string }[] = [
  { name: 'Civil', color: Palette.text, body: 'Le mot majoritaire. Trouvez les intrus.' },
  { name: 'Undercover', color: Palette.accent, body: 'Un mot voisin. Fondez-vous dans la masse.' },
  { name: 'Mister White', color: Palette.mrWhite, body: 'Aucun mot. Bluff total.' },
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
      <ScreenHeader kicker="Briefing de mission" title="Les règles" />

      <View style={styles.roles}>
        {ROLES.map((role) => (
          <View key={role.name} style={[styles.role, { borderTopColor: role.color }]}>
            <Text style={[styles.roleName, { color: role.color }]}>{role.name}</Text>
            <Text style={styles.roleBody}>{role.body}</Text>
          </View>
        ))}
      </View>

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
  roles: {
    flexDirection: 'row',
    gap: Space.sm,
    marginBottom: Space.xl,
  },
  role: {
    flex: 1,
    gap: Space.xs,
    paddingTop: Space.sm,
    borderTopWidth: 3,
  },
  roleName: {
    fontFamily: Font.display,
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  roleBody: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.small - 1,
    lineHeight: 18,
  },
  list: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  step: {
    flexDirection: 'row',
    gap: Space.md,
    paddingVertical: Space.lg - 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  number: {
    width: 44,
    color: Palette.accent,
    fontFamily: Font.display,
    fontSize: 40,
    lineHeight: 40,
    includeFontPadding: false,
  },
  stepText: {
    flex: 1,
    gap: Space.xs,
  },
  stepTitle: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: 1,
    includeFontPadding: false,
  },
  stepBody: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body - 1,
    lineHeight: 23,
  },
});
