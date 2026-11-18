import { describe, expect, test } from '@jest/globals';
import type * as Contacts from 'expo-contacts/legacy';
import type { Song } from '@iresucito/core';
import { getContactsForImport, ordenClasificacion } from '../util';

const contact = (fields: Partial<Contacts.ExistingContact>) =>
  ({ contactType: 'person', ...fields }) as Contacts.ExistingContact;

describe('ordenClasificacion', () => {
  test('sorts higher rated songs first and unrated last', () => {
    const songs = [{ rating: 2 }, { rating: undefined }, { rating: 5 }] as Song[];
    songs.sort(ordenClasificacion);
    expect(songs.map((s) => s.rating)).toEqual([5, 2, undefined]);
  });
});

describe('getContactsForImport', () => {
  test('dedupes by name, prefers the one with an image and marks imported', () => {
    const all = [
      contact({ id: '1', name: 'Pedro' }),
      contact({ id: '2', name: 'Pedro', image: { uri: 'x' } }),
      contact({ id: '3', name: 'Ana' }),
    ];
    const result = getContactsForImport(all, [{ id: '3' } as any]);
    expect(result.map((c) => [c.id, c.imported])).toEqual([
      ['3', true],
      ['2', false],
    ]);
  });
});
