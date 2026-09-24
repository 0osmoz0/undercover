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
});
