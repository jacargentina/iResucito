import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  GestureResponderEvent,
  useColorScheme,
} from 'react-native';
import {
  Box,
  HStack,
  Text,
  Icon,
  Button,
  useMedia,
} from '@gluestack-ui/themed';
import color from 'color';
import { colors, Song, SongLine } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useSettingsStore, useSongPlayer } from '../hooks';
import { NativeParser, NativeStyle, NativeStyles } from '../util';
import { MinusIcon, PlusIcon } from 'lucide-react-native';
import { SongDownloader, SongPlayer } from '../components';

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

type Props = {
  song: Song;
  style?: any;
};

export const SongViewFrame = (props: Props) => {
  const media = useMedia();
  const { zoomLevel } = useSettingsStore();
  const { song, style } = props;
  const backColor = color(colors[song.stage]);
  const background = backColor.lighten(0.1).string();
  const minWidth = Dimensions.get('window').width;
  const scheme = useColorScheme();

  const fRender = NativeParser.getForRender(
    song.fullText,
    i18n.locale,
    song.transportTo
  );

  const [ctrlVisible, setCtrlVisible] = useState(false);
  const songPlayer = useSongPlayer();

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

  var height = 100;
  if (ctrlVisible) {
    height = height - 10;
  }
  if (songPlayer.song != null) {
    height = height - 18;
  }

  const ZoomControls = () => {
    if (!ctrlVisible) {
      return null;
    }

    return (
      <HStack
        py="$1"
        px="$4"
        h="10%"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={
          scheme == 'dark' ? '$backgroundDark900' : '$backgroundLight200'
        }>
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
          color={scheme == 'dark' ? '$textLight200' : '$textDark500'}
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
    );
  };

  return (
    <Box style={{ backgroundColor: background, ...style }}>
      <ScrollView
        horizontal
        style={{
          height: `${height}%`,
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
              {song.titulo}
            </Text>
            <Text onPress={toggleControls} style={sourceStyle}>
              {song.fuente}
            </Text>
            {song.error && <Text>{song.error}</Text>}
            {!song.error && (
              <SongViewLines
                onPress={toggleControls}
                lines={fRender.items}
                zoom={zoomLevel}
              />
            )}
          </Box>
        </ScrollView>
      </ScrollView>
      <ZoomControls />
      <SongPlayer />
      <SongDownloader />
    </Box>
  );
};
