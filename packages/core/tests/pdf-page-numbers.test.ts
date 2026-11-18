import { describe, expect, test } from 'vitest';
import { renderPdfFragments, type PdfSongInput } from './pdfFragments';

const song = (key: string, titulo: string): PdfSongInput => ({
  key,
  titulo,
  fuente: 'Sal 1',
  source: ['La-', 'S. Resucitó, resucitó', '', 'Mi', 'A. ALELUYA'].join('\n'),
});

// Page number printed at the bottom of each PDF page, indexed by PDF page.
const pageNumbers = async (songs: PdfSongInput[], addIndex: boolean) => {
  const { writer, fragments } = await renderPdfFragments(songs, 'es', addIndex);
  // pdfkit empties its page buffer on save, so count pages from the fragments.
  const pageCount = Math.max(...fragments.map((f) => f.page)) + 1;
  return Array.from({ length: pageCount }, (_, page) => {
    // The footer y is recomputed per page with the active font, so it can
    // differ by a couple of points between pages.
    const footer = fragments.find(
      (f) =>
        f.page === page &&
        Math.abs(f.y - writer.pageNumberLimits.y) < 5 &&
        /^\d+$/.test(f.text)
    );
    return footer?.text ?? null;
  });
};

describe('PDF page numbers', () => {
  test('a single song without index is page 1', async () => {
    expect(await pageNumbers([song('1', 'Uno')], false)).toEqual(['1']);
  });

  test('songs without index are numbered from 1', async () => {
    expect(
      await pageNumbers([song('1', 'Uno'), song('2', 'Dos')], false)
    ).toEqual(['1', '2']);
  });

  test('with index, the cover has no number and songs follow the index', async () => {
    const numbers = await pageNumbers([song('1', 'Uno'), song('2', 'Dos')], true);
    expect(numbers[0]).toBeNull();
    expect(numbers.slice(1, -2)).toEqual(
      numbers.slice(1, -2).map((_, i) => String(i + 1))
    );
    const lastIndexPage = Number(numbers[numbers.length - 3]);
    expect(numbers.slice(-2)).toEqual([
      String(lastIndexPage + 1),
      String(lastIndexPage + 2),
    ]);
  });
});
