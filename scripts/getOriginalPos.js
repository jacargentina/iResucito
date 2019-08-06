const fs = require('fs');
const SourceMap = require('source-map');

const iosSourceMap = fs.readFileSync(
  '../main.jsbundle.map',
  'utf-8'
);

const parsed = JSON.parse(iosSourceMap);
new SourceMap.SourceMapConsumer(parsed).then(mapConsumer => {
  const result = mapConsumer.originalPositionFor({
    line: 1024,
    column: 588
  });
  console.log({ result });
});
