// @flow
import React, { useContext, useState, useEffect } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import {
  Container,
  Content,
  Text,
  Icon,
  ActionSheet,
  Badge
} from 'native-base';
import KeepAwake from 'react-native-keep-awake';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import colors from '../colors';
import color from 'color';
import { notas } from '../../SongsProcessor';
import { NativeStyles, getSalmoTransported } from '../util';
import { DataContext } from '../../DataContext';
import AppNavigatorOptions from '../AppNavigatorOptions';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

const SalmoDetail = (props: any) => {
  const data = useContext(DataContext);
  const { transportNote } = data;
  const { keys } = data.settings;

  var salmo = props.navigation.state.params.salmo;
  var backColor = color(colors[salmo.etapa]);
  var background = backColor.lighten(0.1).string();
  var itemsToRender = getSalmoTransported(salmo, transportNote);
  // Ajuste final para renderizado en screen
  var lines = itemsToRender.map(it => {
    var c = Object.assign({}, it);
    if (c.notas === true) {
      c.texto = c.texto.replace(/ {2}/g, ' ');
    }
    return c;
  });

  useEffect(() => {
    if (keys.keepAwake) {
      KeepAwake.activate();
      return function() {
        KeepAwake.deactivate();
      };
    }
  }, []);

  if (salmo.error) {
    var render_items = <Text>{salmo.error}</Text>;
  } else {
    var render_items = lines.map((it, i) => {
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
    render_items.push(<Text key="spacer">{'\n\n\n'}</Text>);
  }
  var margin = 10;
  var minWidth = Dimensions.get('window').width - margin * 2;
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
            <Text style={NativeStyles.titulo}>{salmo.titulo}</Text>
            <Text style={NativeStyles.fuente}>{salmo.fuente}</Text>
            {render_items}
          </Content>
        </ScrollView>
      </ScrollView>
    </Container>
  );
};

const TransportNotesMenu = props => {
  const data = useContext(DataContext);
  const { transportNote, setTransportNote } = data;

  var menuOptionItems = notas.map((nota, i) => {
    if (transportNote === nota)
      var customStyles = {
        optionWrapper: {
          backgroundColor: commonTheme.brandPrimary,
          paddingHorizontal: 10,
          paddingVertical: 10
        },
        optionText: {
          color: 'white'
        }
      };
    return (
      <MenuOption
        key={i}
        value={nota}
        text={nota}
        customStyles={customStyles}
      />
    );
  });
  var trigger =
    transportNote === null || transportNote === undefined ? (
      <Icon
        name="musical-note"
        style={{
          marginTop: 4,
          marginRight: 8,
          width: 32,
          fontSize: 30,
          textAlign: 'center',
          color: AppNavigatorOptions.headerTitleStyle.color
        }}
      />
    ) : (
      <Badge style={{ marginTop: 6, marginRight: 6 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textAlign: 'center',
            color: AppNavigatorOptions.headerTitleStyle.color
          }}>
          {transportNote}
        </Text>
      </Badge>
    );
  return (
    <Menu onSelect={value => setTransportNote(value)}>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 }
        }}>
        {transportNote != null && <MenuOption value={null} text="Original" />}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

const ViewPdf = props => {
  const data = useContext(DataContext);
  const { generatePDF } = data;

  const viewPdf = (salmo, lines, navigation) => {
    generatePDF(salmo, lines).then(path => {
      navigation.navigate('PDFViewer', {
        uri: path,
        salmo: salmo
      });
    });
  };

  return (
    <Icon
      name="paper"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => viewPdf(props.salmo, props.lines, props.navigation)}
    />
  );
};

SalmoDetail.navigationOptions = (props: any) => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo',
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <ViewPdf {...props} />
      <TransportNotesMenu {...props} />
    </View>
  )
});

export default SalmoDetail;
