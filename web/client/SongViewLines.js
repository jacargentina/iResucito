// @flow
import React from 'react';
import { getChordsDiff } from '../../src/common';
import I18n from '../../src/translations';
import { WebParser } from './WebParser';

const SongViewLines = (props: any) => {
  const { lines, transportToNote } = props;

  if (!lines) {
    return null;
  }

  var diff = 0;
  if (transportToNote) {
    diff = getChordsDiff(lines[0], transportToNote, I18n.locale);
  }

  const itemsToRender = WebParser.getSongLinesForRender(
    lines,
    I18n.locale,
    diff
  );

  // Ajuste final para renderizado en screen
  var renderItems = itemsToRender.map<any>((it: SongLine, i) => {
    if (it.sufijo) {
      var sufijo = (
        <span key={i + 'sufijo'} style={it.sufijoStyle}>
          {it.sufijo}
        </span>
      );
    }
    it.prefijo = it.prefijo.replace(/ /g, '\u00a0');
    it.texto = it.texto.replace(/ /g, '\u00a0');
    return (
      <div key={i + 'texto'} style={it.style}>
        <span key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
          {it.prefijo}
        </span>
        {it.texto}
        {sufijo}
      </div>
    );
  });

  return renderItems;
};

export default SongViewLines;
