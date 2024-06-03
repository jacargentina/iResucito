import { useState } from 'react';
import { Dimensions, ScrollView, GestureResponderEvent } from 'react-native';
import {
  Box,
  HStack,
  Text,
  Icon,
  Button,
  useMedia,
} from '@gluestack-ui/themed';
import color from 'color';
import { colors, SongLine } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useSettingsStore } from '../hooks';
import { NativeParser, NativeStyle, NativeStyles } from '../util';
import { MinusIcon, PlusIcon } from 'lucide-react-native';

const SongViewLines = (props: {
  lines: Array<SongLine<NativeStyle>>;
  onPress: (e: GestureResponderEvent) => void;
  zoom: number;
}) => {
  const { lines, onPress, zoom } = props;

  // Ajuste final para renderizado en screen
  var renderItems = lines.map((it, i) => {
    var itemStyle = { ...it.style };
    if (itemStyle.fontSize) {
      itemStyle.fontSize = itemStyle.fontSize * zoom;
      itemStyle.lineHeight = itemStyle.fontSize + 2; // ajustar para evitar solapamiento
    }
    var prefijoStyle = { ...(it.prefijoStyle || it.style) };
    if (prefijoStyle.fontSize) {
      prefijoStyle.fontSize = prefijoStyle.fontSize * zoom;
      prefijoStyle.lineHeight = prefijoStyle.fontSize + 2; // ajustar para evitar solapamiento
    }

    // en app nativa, es requerido tener fontSize y lineHeight
    // en el prefijo; caso contrario se renderiza muy feo!
    if (!prefijoStyle.fontSize && itemStyle.fontSize) {
      prefijoStyle.fontSize = itemStyle.fontSize;
    }
    if (!prefijoStyle.lineHeight && itemStyle.lineHeight) {
      prefijoStyle.lineHeight = itemStyle.lineHeight;
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
      return <Text key={i + 'texto'} onPress={onPress} numberOfLines={1} />;
    }

    return (
      <Text
        key={i + 'texto'}
        onPress={onPress}
        numberOfLines={1}
        style={itemStyle}>
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

export const SongViewFrame = (props: any) => {
  const media = useMedia();
  const { zoomLevel } = useSettingsStore();
  const { title, stage, source, text, transportToNote, error, style } = props;
  const backColor = color(colors[stage]);
  const background = backColor.lighten(0.1).string();
  const minWidth = Dimensions.get('window').width;

  const fRender = NativeParser.getForRender(text, i18n.locale, transportToNote);

  const [ctrlVisible, setCtrlVisible] = useState(false);

  const toggleControls = () => {
    setCtrlVisible((visible) => !visible);
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      var newzoom = (zoomLevel - 0.1).toFixed(2);
      useSettingsStore.setState({ zoomLevel: parseFloat(newzoom) });
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 2.2) {
      var newzoom = (zoomLevel + 0.1).toFixed(2);
      useSettingsStore.setState({ zoomLevel: parseFloat(newzoom) });
    }
  };

  var titleStyle = { ...NativeStyles.title };
  if (titleStyle.fontSize)
    titleStyle.fontSize = titleStyle.fontSize * zoomLevel;
  titleStyle.lineHeight = titleStyle.fontSize;

  var sourceStyle = { ...NativeStyles.source };
  if (sourceStyle.fontSize)
    sourceStyle.fontSize = sourceStyle.fontSize * zoomLevel;
  sourceStyle.lineHeight = sourceStyle.fontSize;

  return (
    <Box style={{ backgroundColor: background, ...style }}>
      <ScrollView
        horizontal
        style={{
          height: ctrlVisible ? '89%' : '100%',
        }}>
        <ScrollView
          style={{
            minWidth: minWidth,
          }}>
          <Box
            sx={{
              '@base': {
                p: '$2',
              },
              '@md': {
                p: '$4',
              },
            }}>
            <Text onPress={toggleControls} style={titleStyle}>
              {title}
            </Text>
            <Text onPress={toggleControls} style={sourceStyle}>
              {source}
            </Text>
            {error && <Text>{error}</Text>}
            {!error && (
              <SongViewLines
                onPress={toggleControls}
                lines={fRender.items}
                zoom={zoomLevel}
              />
            )}
          </Box>
        </ScrollView>
      </ScrollView>
      {ctrlVisible && (
        <HStack
          py="$1"
          px="$4"
          h="10%"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#efefef">
          <Button
            onPress={zoomOut}
            h="85%"
            w="18%"
            rounded="$2xl"
            bg="$primary500">
            <Icon as={MinusIcon} color="white" size={media.md ? 'xxl' : 'xl'} />
          </Button>
          <Text
            fontWeight="bold"
            color="black"
            fontSize={media.md ? '$5xl' : '$3xl'}
            lineHeight={media.md ? '$5xl' : '$3xl'}>
            {zoomLevel}
          </Text>
          <Button
            onPress={zoomIn}
            h="85%"
            w="18%"
            rounded="$2xl"
            bg="$primary500">
            <Icon as={PlusIcon} color="white" size={media.md ? 'xxl' : 'xl'} />
          </Button>
        </HStack>
      )}
    </Box>
  );
};
