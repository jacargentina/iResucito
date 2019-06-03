// @flow
import React, { Fragment } from 'react';
import I18n from '../../translations';

const SongViewLines = (props: any) => {
  const { lines, repeat } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.map<any>((it: SongLine, i) => {
    if (it.sufijo) {
      var sufijo = (
        <span key={i + 'sufijo'} style={it.sufijoStyle}>
          {it.sufijo}
        </span>
      );
    }
    it.prefijo = it.prefijo.replace(/ /g, '\u00a0');
    it.texto = it.texto.replace(/ /g, '\u00a0');
    var inRepeat = repeat.find(r => r.start <= i && r.end > i);
    if (inRepeat) {
      var middle = (inRepeat.start + inRepeat.end) / 2;
      var bisText = i === middle ? I18n.t('songs.repeat') : '\u00a0';
      var texto = (
        <span style={{ display: 'inline-block', width: '50%' }}>
          <span key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
            {it.prefijo}
          </span>
          {it.texto}
        </span>
      );
      var bis = (
        <span
          style={{
            ...inRepeat.syle,
            display: 'inline-block',
            borderLeft: '2px solid red',
            width: '50%',
            paddingLeft: 10
          }}>
          {bisText}
        </span>
      );
    } else {
      var texto = (
        <Fragment>
          <span key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
            {it.prefijo}
          </span>
          {it.texto}
        </Fragment>
      );
    }
    return (
      <div key={i + 'texto'} style={{ ...it.style }}>
        {texto}
        {sufijo}
        {bis}
      </div>
    );
  });

  return renderItems;
};

export default SongViewLines;
