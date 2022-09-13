import * as React from 'react';
import { Text } from 'native-base';

const SongViewLines = (props: any) =>{
  const { lines, onPress, zoom } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.map<any>((it: SongLine, i) => {
    var itemStyle = { ...it.style };
    if (itemStyle.fontSize) {
      itemStyle.fontSize = itemStyle.fontSize * zoom;
      itemStyle.lineHeight = itemStyle.fontSize;
    }
    var prefijoStyle = { ...(it.prefijoStyle || it.style) };
    if (prefijoStyle.fontSize) {
      prefijoStyle.fontSize = prefijoStyle.fontSize * zoom;
      prefijoStyle.lineHeight = prefijoStyle.fontSize;
    }

    if (it.sufijo) {
      var sufijo = (
        <Text key={i + 'sufijo'} style={it.sufijoStyle}>
          {it.sufijo}
        </Text>
      );
    }

    if (it.texto === '') {
      return <Text key={i + 'texto'} onPress={onPress} noOfLines={1} />;
    }

    return (
      <Text key={i + 'texto'} onPress={onPress} noOfLines={1} style={itemStyle}>
        <Text key={i + 'prefijo'} style={prefijoStyle}>
          {it.prefijo}
        </Text>
        {it.texto}
        {sufijo}
      </Text>
    );
  });

  renderItems.push(
    <Text onPress={onPress} key="spacer">
      {'\n\n\n'}
    </Text>
  );

  return renderItems;
};

export default SongViewLines;
