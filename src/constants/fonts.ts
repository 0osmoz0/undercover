import { Barlow_500Medium } from '@expo-google-fonts/barlow/500Medium';
import { Barlow_600SemiBold } from '@expo-google-fonts/barlow/600SemiBold';
import { Barlow_700Bold } from '@expo-google-fonts/barlow/700Bold';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';

/** Polices embarquées dans le bundle (aucun téléchargement au runtime). */
export const FontAssets = {
  BebasNeue_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
};

/**
 * Familles à utiliser dans les styles. Ne jamais combiner avec `fontWeight` :
 * chaque graisse est une famille distincte (sinon Android retombe sur la police système).
 */
export const Font = {
  display: 'BebasNeue_400Regular',
  body: 'Barlow_500Medium',
  bodySemi: 'Barlow_600SemiBold',
  bodyBold: 'Barlow_700Bold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;
