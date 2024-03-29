import { PdfStyles, SongsParser } from './';

const parser = new SongsParser(PdfStyles);
var diff = parser.getChordsDiff('Do', 'Do#', 'es');
//const result = parser.getChordsTransported('Sib', diff, 'es');

console.log(diff);
