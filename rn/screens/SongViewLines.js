// @flow
import React from 'react';
import { Text } from 'native-base';

const SongViewLines = (props: any) => {
  const { lines } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.map<any>((it: SongLine, i) => {
    if (it.sufijo) {
      var sufijo = (
        <Text key={i + 'sufijo'} style={it.sufijoStyle}>
          {it.sufijo}
        </Text>
      );
    }
    return (
      <Text numberOfLines={1} key={i + 'texto'} style={it.style}>
        <Text key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
          {it.prefijo}
        </Text>
        {it.texto}
        {sufijo}
      </Text>
    );
  });

  renderItems.push(<Text key="spacer">{'\n\n\n'}</Text>);

  return renderItems;
};

export default SongViewLines;
