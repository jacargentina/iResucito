import { SongsParser, PdfStyles } from '@iresucito/core';

test('getChordsDiff', () => {
  var parser = new SongsParser(PdfStyles);
  var diff_1 = parser.getChordsDiff('La-', 'Mi', 'es');
  expect(diff_1).toBe(-5);
  var diff_2 = parser.getChordsDiff('Do', 'Re', 'es');
  expect(diff_2).toBe(2);
  var diff_3 = parser.getChordsDiff('Do', 'La', 'es');
  expect(diff_3).toBe(9);
});

test('getChordsTransported', () => {
  var parser = new SongsParser(PdfStyles);
  const result_1 = parser.getChordsTransported('La-', -5, 'es');
  expect(result_1).toBe('Mi-');
  const result_2 = parser.getChordsTransported('Re-', -5, 'es');
  expect(result_2).toBe('La-');
  const result_3 = parser.getChordsTransported('Mi', 2, 'es');
  expect(result_3).toBe('Fa#');
  const result_4 = parser.getChordsTransported('La', 3, 'es');
  expect(result_4).toBe('Do');
});
