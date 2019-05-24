var fs = require('fs');
var json = fs.readFileSync('./songs/patches.json', 'utf8');

const obj = JSON.parse(json);

var str = JSON.stringify(
  obj,
  (k, v) => {
    if (k === 'date') {
      return Date.parse(v);
    }
    return v;
  },
  '  '
);

console.log(str);

fs.writeFileSync('./songs/patches.json', str);
