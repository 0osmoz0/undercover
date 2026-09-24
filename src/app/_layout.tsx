import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Palette } from '@/constants/colors';
import { FontAssets } from '@/constants/fonts';
import { GameProvider } from '@/context/game-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Palette.bgTop,
    card: Palette.bgTop,
    text: Palette.text,
    primary: Palette.accent,
    border: Palette.border,
  },
};

const locked = { gestureEnabled: false, animation: 'fade' } as const;

export default function RootLayout() {
  const [loaded, error] = useFonts(FontAssets);
  const ready = loaded || Boolean(error);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <GameProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Palette.bgTop },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="setup" />
          <Stack.Screen
            name="rules"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="assign/[id]" options={locked} />
          <Stack.Screen name="discuss" options={locked} />
          <Stack.Screen name="vote" options={locked} />
          <Stack.Screen name="guess" options={locked} />
          <Stack.Screen name="reveal" options={locked} />
          <Stack.Screen name="end" options={locked} />
        </Stack>
      </GameProvider>
    </ThemeProvider>
  );
}
