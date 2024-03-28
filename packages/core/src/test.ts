import { SongsParser } from './SongsParser';
import { PdfStyles } from './pdf';

const parser = new SongsParser(PdfStyles);
var diff = parser.getChordsDiff('Do', 'Do#', 'es');
//const result = parser.getChordsTransported('Sib', diff, 'es');

console.log(diff);
