import * as React from 'react';
import { Text } from 'native-base';
import { SongLine } from '@iresucito/core';
import { GestureResponderEvent } from 'react-native';

const SongViewLines = (props: {
  lines: SongLine[];
  onPress: (e: GestureResponderEvent) => void;
  zoom: number;
}) => {
  const { lines, onPress, zoom } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.map((it, i) => {
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

    var sufijo: any = null;

    if (it.sufijo) {
      sufijo = (
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

  return <>{renderItems}</>;
};

export default SongViewLines;
