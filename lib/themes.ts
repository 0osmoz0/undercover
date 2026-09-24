import type { WordPair } from './game';
import themesData from '../data/themes.json';

export type ThemeDef = {
  id: string;
  title: string;
  subtitle: string;
  group: string;
  pairs: WordPair[];
};

export const THEMES = themesData.themes as ThemeDef[];

export function getThemeById(id: string): ThemeDef | undefined {
  return THEMES.find((theme) => theme.id === id);
}

export function getThemeGroups(): { group: string; themes: ThemeDef[] }[] {
  const order: string[] = [];
  const map = new Map<string, ThemeDef[]>();

  THEMES.forEach((theme) => {
    if (!map.has(theme.group)) {
      map.set(theme.group, []);
      order.push(theme.group);
    }
    map.get(theme.group)!.push(theme);
  });

  return order.map((group) => ({
    group,
    themes: map.get(group)!,
  }));
}
