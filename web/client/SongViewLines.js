// @flow
import React from 'react';
import I18n from '../../translations';
import { WebParser } from './WebParser';

const SongViewLines = (props: any) => {
  const { lines, transportToNote } = props;

  if (!lines) {
    return null;
  }

  const itemsToRender = WebParser.getForRender(
    lines,
    I18n.locale,
    transportToNote
  );

  // Ajuste final para renderizado en screen
  var renderItems = itemsToRender.lines.items.map<any>((it: SongLine, i) => {
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
