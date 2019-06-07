// @flow
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
import colors from '../../colors';
import color from 'color';
import { NativeParser, NativeStyles } from '../util';
import I18n from '../../translations';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { title, stage, source, text, transportToNote, error } = props;
  const backColor = color(colors[stage]);
  const background = backColor.lighten(0.1).string();
  const margin = 10;
  const minWidth = Dimensions.get('window').width - margin * 2;

  const fRender = NativeParser.getForRender(text, I18n.locale, transportToNote);

  return (
    <Container style={{ backgroundColor: background }}>
      <ScrollView
        horizontal
        style={{
          marginLeft: margin,
          marginRight: margin
        }}>
        <ScrollView>
          <Content
            style={{
              minWidth: minWidth
            }}>
            <Text style={NativeStyles.title}>{title}</Text>
            <Text style={NativeStyles.source}>{source}</Text>
            {error && <Text>{error}</Text>}
            {!error && <SongViewLines lines={fRender.items} />}
          </Content>
        </ScrollView>
      </ScrollView>
    </Container>
  );
};

export default SongViewFrame;
