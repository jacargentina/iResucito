// Detectar 2 columnas y transformar en 1 sola
import { isChordsLine } from '../src/common';
var inquirer = require('inquirer');
var path = require('path');
var fs = require('fs');

const simulateCut = (locale, content, start) => {
  if (start === 0) return content;
  const lines = content.split('\n');
  const newLines = [lines[0]];
  var belowLines = [];
  for (var i = 1; i < lines.length; i++) {
    const line = lines[i];
    const preserve = line.substring(0, start).trim();
    const toMove = line.substring(start);
    newLines.push(preserve);
    belowLines.push(toMove);
  }
  if (belowLines.length > 0) {
    belowLines = belowLines.map(s => {
      if (!isChordsLine(s, locale)) {
        return s.trim();
      } else {
        return s;
      }
    });
    const updatedLines = newLines.concat(belowLines);
    return updatedLines.join('\n');
  }
  return content;
};

const processFile = (locale, filename) => {
  var original = fs.readFileSync(filename, 'utf8');
  var content = original;

  const showOptions = () => {
    console.log(content);
    return inquirer
      .prompt({
        type: 'list',
        name: 'action',
        message: 'Choose your action',
        choices: ['Cut', 'Save', 'Skip']
      })
      .then(answers => {
        if (answers.action == 'Cut') {
          return inquirer
            .prompt({
              type: 'input',
              name: 'start',
              message: 'Start at'
            })
            .then(answers => {
              content = simulateCut(locale, original, Number(answers.start));
              return showOptions();
            });
        } else if (answers.action == 'Save') {
          fs.writeFileSync(filename, content);
        }
      });
  };
  return showOptions();
};

inquirer
  .prompt({
    type: 'input',
    name: 'locale',
    message: 'Cual locale?'
  })
  .then(answers => {
    var locale = answers.locale;
    var sourcePath = `./songs/${locale}`;
    var archivos = fs.readdirSync(sourcePath);

    for (var i = 0; i < archivos.length; i++) {
      console.log(`${i} - ${archivos[i]}`);
    }

    inquirer
      .prompt({
        type: 'input',
        name: 'key',
        message: 'Start key?'
      })
      .then(ans => {
        var i = ans.key;

        const runLoop = () => {
          const fpath = path.resolve(`${sourcePath}/${archivos[i]}`);
          i++;
          return processFile(locale, fpath).then(() => {
            runLoop();
          });
        };

        runLoop();
      });
  });
