import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Palette, Space, Type } from '@/constants/colors';

import { PrimaryButton } from './PrimaryButton';
import { Screen } from './Screen';

export function NoGame() {
  return (
    <Screen style={styles.center}>
      <View style={styles.block}>
        <Text style={styles.title}>Aucune partie en cours</Text>
        <Text style={styles.text}>Lance une nouvelle partie depuis l’accueil.</Text>
      </View>
      <PrimaryButton label="Retour à l’accueil" onPress={() => router.dismissTo('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    gap: Space.xl,
  },
  block: {
    gap: Space.sm,
    alignItems: 'center',
  },
  title: {
    color: Palette.text,
    fontSize: Type.heading,
    fontWeight: '800',
    textAlign: 'center',
  },
  text: {
    color: Palette.textMuted,
    fontSize: Type.body,
    textAlign: 'center',
  },
});
