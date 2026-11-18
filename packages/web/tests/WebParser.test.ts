import { describe, expect, test } from 'vitest';
import { WebParser, WebStyles } from '~/components/WebParser';

describe('WebParser', () => {
  test('styles an assembly line with the assembly web style', () => {
    const item = WebParser.getSongItem('A. Resucitó', 'es');
    expect(item.type).toBe('cantoConIndicador');
    expect(item.style).toBe(WebStyles.assemblyLine);
    expect(item.prefijoStyle).toBe(WebStyles.assemblyPrefix);
  });

  test('styles a chords line with the notes web style', () => {
    const item = WebParser.getSongItem('La-   Mi', 'es');
    expect(item.type).toBe('notas');
    expect(item.style).toBe(WebStyles.notesLine);
  });

  test('renders a song with its repeat indicator', () => {
    const render = WebParser.getForRender(
      ['A. Resucitó', 'repeat'].join('\n'),
      'es'
    );
    expect(render.items).toHaveLength(1);
    expect(render.indicators.map((i) => i.type)).toEqual(['bloqueRepetir']);
  });
});
