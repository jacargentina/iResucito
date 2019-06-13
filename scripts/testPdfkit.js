// tip: to fork this repl, click in the edit icon above than click "fork"

const Document = require('../pdfkit.standalone.js');
const fs = require('fs');

const defaultOptions = {
  margins: { top: 10, left: 50, right: 100, bottom: 10 },
  size: 'A4',
  layout: 'landscape'
};

const doc = new Document({ autoFirstPage: false });
doc.on('pageAdding', e => {
  e.options = defaultOptions;
});

doc.on('pageAdded', () => {
  doc.text('My size ' + doc.page.size);
  doc.text('My layout ' + doc.page.layout);
  doc.text('My margins ' + JSON.stringify(doc.page.margins));
});

doc.addPage(defaultOptions);

for (var i = 0; i < 90; i++) {
  doc.text('Hello world' + i);
}

doc.pipe(fs.createWriteStream('output.pdf'));
doc.end();
