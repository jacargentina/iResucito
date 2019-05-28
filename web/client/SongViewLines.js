// @flow
import React from 'react';

const SongViewLines = (props: any) => {
  const { lines } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.items.map<any>((it: SongLine, i) => {
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
