import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Palette } from '@/constants/colors';
import { GameProvider } from '@/context/game-context';

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
          <Stack.Screen name="index" />
          <Stack.Screen name="setup" />
          <Stack.Screen name="rules" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
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
