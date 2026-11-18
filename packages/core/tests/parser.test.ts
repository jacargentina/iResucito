import { beforeEach, describe, expect, test } from 'vitest';
import i18n from '@iresucito/translations';
import { SongsParser, PdfStyles } from '../src';

const parser = new SongsParser(PdfStyles);

describe('isChordsLine', () => {
  test('detects a line made only of chords', () => {
    expect(parser.isChordsLine('La-   Re-  Mi', 'es')).toBe(true);
  });

  test('rejects a line with lyrics', () => {
    expect(parser.isChordsLine('Resucitó, resucitó', 'es')).toBe(false);
  });

  test('throws on missing locale', () => {
    expect(() => parser.isChordsLine('La-', undefined as any)).toThrow();
  });
});

describe('getSongItem', () => {
  // The clamp label follows the global i18n.locale, not the locale argument.
  beforeEach(() => {
    i18n.locale = 'es';
  });

  test('parses a clamp line', () => {
    const item = parser.getSongItem('clamp: 2', 'es');
    expect(item.type).toBe('posicionAbrazadera');
    expect(item.texto).toBe('Cejilla 2° traste');
  });

  test.each([
    ['repeat', 'bloqueRepetir'],
    ['footnote', 'bloqueNotaAlPie'],
    ['column', 'comenzarColumna'],
  ])('parses the "%s" marker', (text, type) => {
    expect(parser.getSongItem(text, 'es').type).toBe(type);
  });

  test('parses a psalmist line with its prefix', () => {
    const item = parser.getSongItem('S. Resucitó', 'es');
    expect(item.type).toBe('cantoConIndicador');
    expect(item.prefijo.trim()).toBe('S.');
    expect(item.texto).toBe('Resucitó');
  });
});

describe('getForRender', () => {
  const song = ['La-        Mi', 'S. Resucitó, resucitó', 'repeat'].join('\n');

  test('extracts repeat blocks as indicators', () => {
    const render = parser.getForRender(song, 'es');
    expect(render.items.map((i) => i.type)).not.toContain('bloqueRepetir');
    expect(render.indicators).toHaveLength(1);
    expect(render.indicators[0].type).toBe('bloqueRepetir');
  });

  test('transports chord lines to the target note', () => {
    const render = parser.getForRender(song, 'es', 'Mi');
    const chords = render.items.find((i) => parser.isChordsLine(i.texto, 'es'));
    expect(chords?.texto.trim().split(/\s+/)).toEqual(['Mi-', 'Si']);
  });
});
