import { SongsParser } from './SongsParser';
import { PdfStyles } from './common';

const parser = new SongsParser(PdfStyles);
var diff = parser.getChordsDiff('Do', 'La', 'es');
console.log(diff);
const result = parser.getChordsTransported('Sib', 9, 'es');
console.log(result);
