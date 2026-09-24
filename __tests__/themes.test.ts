import { normalizeGuess } from '../lib/game';
import { getThemeById, getThemeGroups, THEMES } from '../lib/themes';

describe('themes catalog', () => {
  it('contient plusieurs themes dont les filieres ESIEE', () => {
    expect(THEMES.length).toBeGreaterThan(10);
    expect(getThemeById('esiee-info')?.title).toMatch(/Informatique/);
    expect(getThemeById('disney')?.pairs.length).toBeGreaterThan(0);
  });

  it('groupe les themes sans doublon', () => {
    const groups = getThemeGroups();
    expect(groups.map((g) => g.group)).toEqual(
      expect.arrayContaining(['Culture pop', 'ESIEE']),
    );
    const ids = groups.flatMap((g) => g.themes.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('respecte le nombre minimum de paires par groupe', () => {
    const quotas: Record<string, number> = {
      'Culture pop': 100,
      Lifestyle: 50,
      ESIEE: 70,
      Univers: 30,
    };
    THEMES.forEach((theme) => {
      const min = quotas[theme.group] ?? 1;
      expect({ id: theme.id, ok: theme.pairs.length >= min }).toEqual({ id: theme.id, ok: true });
    });
  });

  it('ne contient ni doublon ni paire identique dans un theme', () => {
    THEMES.forEach((theme) => {
      const keys = theme.pairs.map((p) => {
        const a = p.civilian.trim().toLowerCase();
        const b = p.undercover.trim().toLowerCase();
        expect(a).not.toBe(b);
        return [a, b].sort().join('|');
      });
      expect({ id: theme.id, size: new Set(keys).size }).toEqual({
        id: theme.id,
        size: keys.length,
      });
    });
  });
});

describe('normalizeGuess', () => {
  it('traite les apostrophes typographiques comme droites', () => {
    expect(normalizeGuess('Maman, j’ai raté l’avion')).toBe(
      normalizeGuess("Maman, j'ai raté l'avion"),
    );
  });
});
