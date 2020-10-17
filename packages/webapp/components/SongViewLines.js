// @flow
import React, { Fragment } from 'react';
import I18n from '../../../translations';
import { WebStyles } from './WebParser';

const SongViewLines = (props: any) => {
  const { lines, indicators } = props;

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
    var indicator = indicators.find((r) => r.start <= i && r.end > i);
    if (indicator) {
      var middle = Math.trunc((indicator.start + indicator.end) / 2);
      var indicatorText = (
        <div
          style={{
            display: 'inline-block',
          }}>
          {'\u00a0'}
        </div>
      );
      if (i === middle) {
        if (indicator.type == 'bloqueRepetir') {
          indicatorText = (
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                top: '-5px',
              }}>
              {I18n.t('songs.repeat')}
            </div>
          );
        } else if (indicator.type == 'bloqueNotaAlPie') {
          indicatorText = (
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                top: '-5px',
              }}>
              {'*'}
            </div>
          );
        }
      }
      var texto = (
        <span style={{ display: 'inline-block', width: '50%' }}>
          <span key={i + 'prefijo'} style={it.prefijoStyle}>
            {it.prefijo}
          </span>
          <span style={it.style}>{it.texto}</span>
        </span>
      );
      var bis = (
        <span
          style={{
            color: 'red',
            display: 'inline-block',
            borderLeft: '2px solid red',
            width: '45%',
            paddingLeft: 10,
          }}>
          {indicatorText}
        </span>
      );
    } else {
      if (it.type == 'inicioParrafo') {
        var texto = <span style={{ display: 'inline-block', width: '95%' }} />;
      } else {
        var texto = (
          <Fragment>
            <span key={i + 'prefijo'} style={it.prefijoStyle}>
              {it.prefijo}
            </span>
            <span style={it.style}>{it.texto}</span>
          </Fragment>
        );
      }
    }

    var lineNumber = (
      <div
        style={{
          display: 'inline-block',
          color: 'rgba(0,0,0,0.1)',
          textAlign: 'right',
          paddingRight: '3%',
          fontWeight: 'normal',
          fontSize: WebStyles.normalLine.fontSize,
          width: '5%',
        }}>
        {i + 1}
      </div>
    );

    return (
      <div key={i + 'texto'}>
        {lineNumber}
        {texto}
        {sufijo}
        {bis}
      </div>
    );
  });

  return renderItems;
};

export default SongViewLines;
