// @flow
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
import colors from '../colors';
import color from 'color';
import { NativeStyles } from '../util';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { error, locale, etapa, titulo, fuente, lines, transportNote } = props;
  const backColor = color(colors[etapa]);
  const background = backColor.lighten(0.1).string();
  const margin = 10;
  const minWidth = Dimensions.get('window').width - margin * 2;
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
            <Text style={NativeStyles.titulo}>{titulo}</Text>
            <Text style={NativeStyles.fuente}>{fuente}</Text>
            {error && <Text>{error}</Text>}
            {!error && (
              <SongViewLines
                lines={lines}
                locale={locale}
                transportToNote={transportNote}
              />
            )}
          </Content>
        </ScrollView>
      </ScrollView>
    </Container>
  );
};

export default SongViewFrame;
