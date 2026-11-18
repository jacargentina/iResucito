import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import i18n from '../index';

const langsDir = join(__dirname, '..', 'langs');
const locales = readdirSync(langsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''));

const flatKeys = (obj: object, prefix = ''): string[] =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatKeys(v, `${prefix}${k}.`) : [prefix + k]
  );

const keysOf = (locale: string) =>
  flatKeys(JSON.parse(readFileSync(join(langsDir, `${locale}.json`), 'utf8')));

// Known gaps: these locales fall back to "en" for these keys.
// Remove an entry once the locale is translated; a new gap must fail.
const untranslated = [
  'songs.psalmist',
  'songs.assembly',
  'songs.priest',
  'songs.men',
  'songs.women',
  'songs.children',
  'songs.clamp',
  'songs.repeat',
  'ui.title',
  'ui.source',
  'ui.stage',
];
const knownMissing: Record<string, string[]> = {
  fr: untranslated,
  'lt-LT': untranslated,
  'pt-BR': untranslated,
};

describe('locale files', () => {
  const reference = keysOf('es');

  test.each(locales)('%s has the same keys as es', (locale) => {
    const keys = new Set(keysOf(locale));
    const missing = reference.filter((k) => !keys.has(k));
    const extra = [...keys].filter((k) => !reference.includes(k));
    expect(missing.sort()).toEqual((knownMissing[locale] ?? []).sort());
    expect(extra).toEqual([]);
  });

  test.each(locales)('%s is registered in i18n', (locale) => {
    expect(Object.keys(i18n.translations)).toContain(locale);
  });
});

describe('i18n', () => {
  test('falls back to en for a missing key', () => {
    i18n.locale = 'pt-BR';
    expect(i18n.t('songs.psalmist')).toBe(i18n.t('songs.psalmist', { locale: 'en' }));
  });
});
