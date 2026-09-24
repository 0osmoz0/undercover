import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Palette, Space, Type } from '@/constants/colors';
import { Font } from '@/constants/fonts';

import { Crosshair } from './Crosshair';
import { Kicker } from './Kicker';
import { ProgressTicks } from './ProgressTicks';

type PassPhoneProps = {
  step: string;
  current: number;
  total: number;
  name: string;
  hint: string;
};

/** Écran de transmission : uniquement le nom du prochain joueur, rien d’autre à l’écran. */
export function PassPhone({ step, current, total, name, hint }: PassPhoneProps) {
  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Kicker>{step}</Kicker>
          <Text style={styles.count}>
            {String(current + 1).padStart(2, '0')}
            <Text style={styles.countTotal}> / {String(total).padStart(2, '0')}</Text>
          </Text>
        </View>
        <ProgressTicks current={current} total={total} />
      </View>

      <View style={styles.center}>
        <Crosshair size={300} opacity={0.12} lockOn style={styles.reticle} />
        <Animated.Text entering={FadeIn.duration(400)} style={styles.label}>
          Passe le téléphone à
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.duration(520).delay(120)}
          style={styles.name}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.4}
          accessibilityRole="header">
          {name}
        </Animated.Text>
        <View style={styles.bar} />
      </View>

      <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.hintRow}>
        <View style={styles.eye} />
        <Text style={styles.hint}>{hint}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    gap: Space.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    color: Palette.text,
    fontFamily: Font.monoBold,
    fontSize: Type.small,
    letterSpacing: 1,
  },
  countTotal: {
    color: Palette.textFaint,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    paddingVertical: Space.xxl,
  },
  reticle: {
    position: 'absolute',
  },
  label: {
    color: Palette.textMuted,
    fontFamily: Font.mono,
    fontSize: Type.small,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  name: {
    alignSelf: 'stretch',
    color: Palette.text,
    fontFamily: Font.display,
    fontSize: Type.hero + 8,
    lineHeight: Type.hero + 12,
    letterSpacing: 1.5,
    textAlign: 'center',
    includeFontPadding: false,
  },
  bar: {
    width: 56,
    height: 4,
    backgroundColor: Palette.accent,
    marginTop: Space.sm,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    paddingVertical: Space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Palette.accent,
  },
  hint: {
    flex: 1,
    color: Palette.textMuted,
    fontFamily: Font.body,
    fontSize: Type.body - 1,
    lineHeight: 22,
  },
});
