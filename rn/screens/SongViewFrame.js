// @flow
import React, { useContext, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { Container, Content, Text, Icon, Button } from 'native-base';
import { DataContext } from '../DataContext';
import colors from '../../colors';
import color from 'color';
import { NativeParser, NativeStyles } from '../util';
import I18n from '../../translations';
import SongViewLines from './SongViewLines';
import commonTheme from '../native-base-theme/variables/platform';

const SongViewFrame = (props: any) => {
  const data = useContext(DataContext);
  const [zoomLevel, setZoomLevel] = data.zoomLevel;
  const { title, stage, source, text, transportToNote, error, style } = props;
  const backColor = color(colors[stage]);
  const background = backColor.lighten(0.1).string();
  const margin = 10;
  const minWidth = Dimensions.get('window').width - margin * 2;

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

  var sourceStyle = { ...NativeStyles.source };
  sourceStyle.fontSize = sourceStyle.fontSize * zoomLevel;

  return (
    <Container style={{ backgroundColor: background, ...style }}>
      <ScrollView
        horizontal
        style={{
          marginLeft: margin,
          marginRight: margin,
        }}>
        <ScrollView>
          <Content
            style={{
              minWidth: minWidth,
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
          </Content>
        </ScrollView>
      </ScrollView>
      {ctrlVisible && (
        <View
          style={{
            flex: 0,
            padding: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#efefef',
          }}>
          <Button
            style={{ backgroundColor: commonTheme.brandPrimary }}
            onPress={zoomOut}>
            <Icon name="minus" type="FontAwesome" />
          </Button>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {zoomLevel}
          </Text>
          <Button
            style={{ backgroundColor: commonTheme.brandPrimary }}
            onPress={zoomIn}>
            <Icon name="plus" type="FontAwesome" />
          </Button>
        </View>
      )}
    </Container>
  );
};

export default SongViewFrame;
