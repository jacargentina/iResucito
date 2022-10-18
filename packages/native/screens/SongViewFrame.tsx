import * as React from 'react';
import { useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Box, HStack, Text, Icon, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import color from 'color';
import { colors } from '@iresucito/core';
import I18n from '@iresucito/translations';
import { useData } from '../DataContext';
import { NativeParser, NativeStyles } from '../util';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const data = useData();
  const [zoomLevel, setZoomLevel] = data.zoomLevel;
  const { title, stage, source, text, transportToNote, error, style } = props;
  const backColor = color(colors[stage]);
  const background = backColor.lighten(0.1).string();
  const minWidth = Dimensions.get('window').width;

  const fRender = NativeParser.getForRender(text, I18n.locale, transportToNote);

  const [ctrlVisible, setCtrlVisible] = useState(false);

  const toggleControls = () => {
    setCtrlVisible((visible) => !visible);
  };

  const zoomOut = () => {
    if (zoomLevel > 1) {
      var newzoom = (zoomLevel - 0.1).toFixed(2);
      setZoomLevel(parseFloat(newzoom));
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 2.2) {
      var newzoom = (zoomLevel + 0.1).toFixed(2);
      setZoomLevel(parseFloat(newzoom));
    }
  };

  var titleStyle = { ...NativeStyles.title };
  titleStyle.fontSize = titleStyle.fontSize * zoomLevel;
  titleStyle.lineHeight = titleStyle.fontSize;

  var sourceStyle = { ...NativeStyles.source };
  sourceStyle.fontSize = sourceStyle.fontSize * zoomLevel;
  sourceStyle.lineHeight = sourceStyle.fontSize;

  return (
    <Box style={{ backgroundColor: background, ...style }}>
      <ScrollView
        horizontal
        style={{
          height: ctrlVisible ? '89%' : '100%',
        }}
      >
        <ScrollView
          style={{
            minWidth: minWidth,
          }}
        >
          <Box px="2">
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
          m="2"
          h="10%"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#efefef"
        >
          <Button onPress={zoomOut} w="20%">
            <Icon as={Ionicons} name="remove" color="white" />
          </Button>
          <Text bold fontSize="xl">
            {zoomLevel}
          </Text>
          <Button onPress={zoomIn} w="20%">
            <Icon as={Ionicons} name="add" color="white" />
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default SongViewFrame;
