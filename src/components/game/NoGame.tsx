import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

import { Crosshair } from './Crosshair';
import { Kicker } from './Kicker';
import { PrimaryButton } from './PrimaryButton';
import { Screen } from './Screen';

export function NoGame() {
  return (
    <Screen
      style={styles.center}
      footer={
        <PrimaryButton label="Retour à l’accueil" onPress={() => router.dismissTo('/')} />
      }>
      <View style={styles.block}>
        <Crosshair size={72} opacity={0.5} lockOn />
        <Kicker align="center">Signal perdu</Kicker>
        <Text style={styles.title} accessibilityRole="header">
          Aucune partie en cours
        </Text>
        <Text style={styles.text}>Lance une nouvelle mission depuis l’accueil.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
  },
  block: {
    gap: Space.md,
    alignItems: 'center',
  },
  title: {
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.title,
    lineHeight: Type.title,
    letterSpacing: 1,
    textAlign: 'center',
    includeFontPadding: false,
  },
  text: {
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body,
    textAlign: 'center',
  },
});
