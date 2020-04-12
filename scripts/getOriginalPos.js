const fs = require('fs');
const SourceMap = require('source-map');

function run(file, column, line) {
  const iosSourceMap = fs.readFileSync(file, 'utf-8');

  const parsed = JSON.parse(iosSourceMap);
  new SourceMap.SourceMapConsumer(parsed).then((mapConsumer) => {
    const result = mapConsumer.originalPositionFor({
      line: Number(line),
      column: Number(column),
    });
    console.log({ file, line, column, result });
  });
}

var program = require('commander');

program
  .version('1.0')
  .description('Get original position from soure map')
  .option('-f, --file [path]', 'Path to map file')
  .option('-c, --column [number]', 'Column number')
  .option('-l, --line [number]', 'Line number');

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var file = program.file || '../main.jsbundle.map';
  var column = program.column;
  var line = program.line;
  run(file, column, line);
}
