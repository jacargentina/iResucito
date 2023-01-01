import { WebStyles } from './WebParser';
import i18n from '@iresucito/translations';
import { SongLine } from '@iresucito/core';

const SongViewLines = (props: any) => {
  const { lines, indicators } = props;

  let sufijo: any = null;
  let texto: any = null;
  let bis: any = null;

  // Ajuste final para renderizado en screen
  const renderItems = lines.map((it: SongLine, i: number) => {
    if (it.sufijo) {
      sufijo = (
        <span key={`${i}sufijo`} style={it.sufijoStyle}>
          {it.sufijo}
        </span>
      );
    }
    it.prefijo = it.prefijo.replace(/ /g, '\u00a0');
    it.texto = it.texto.replace(/ /g, '\u00a0');
    const indicator = indicators.find((r) => r.start <= i && r.end > i);
    if (indicator) {
      const middle = Math.trunc((indicator.start + indicator.end) / 2);
      let indicatorText = (
        <div
          style={{
            display: 'inline-block',
          }}>
          {'\u00a0'}
        </div>
      );
      if (i === middle) {
        if (indicator.type === 'bloqueRepetir') {
          indicatorText = (
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                top: '-5px',
              }}>
              {i18n.t('songs.repeat')}
            </div>
          );
        } else if (indicator.type === 'bloqueNotaAlPie') {
          indicatorText = (
            <div
              style={{
                display: 'inline-block',
                position: 'relative',
                top: '-5px',
              }}>
              *
            </div>
          );
        }
      }
      texto = (
        <span style={{ display: 'inline-block', width: '70%' }}>
          <span key={`${i}prefijo`} style={it.prefijoStyle}>
            {it.prefijo}
          </span>
          <span style={it.style}>{it.texto}</span>
        </span>
      );
      bis = (
        <span
          style={{
            color: 'red',
            display: 'inline-block',
            borderLeft: '2px solid red',
            width: '25%',
            paddingLeft: 10,
          }}>
          {indicatorText}
        </span>
      );
    } else if (it.type === 'inicioParrafo') {
      texto = <span style={{ display: 'inline-block', width: '95%' }} />;
      bis = null;
    } else {
      texto = (
        <>
          <span key={`${i}prefijo`} style={it.prefijoStyle}>
            {it.prefijo}
          </span>
          <span style={it.style}>{it.texto}</span>
        </>
      );
    }

    const lineNumber = (
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
      <div key={`${i}texto`}>
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
