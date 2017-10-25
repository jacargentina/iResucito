import React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Thumbnail,
  ActionSheet
} from 'native-base';
import { Alert, FlatList, Platform, View } from 'react-native';
import BaseScreen from './BaseScreen';
import {
  showContactImportDialog,
  syncContact,
  setContactAttribute
} from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import BaseCallToAction from './BaseCallToAction';
import { getProcessedContacts } from '../selectors';
import colors from '../colors';

const unknown = require('../../img/avatar.png');
const contactAttributes = [
  // 'Responsable',
  'Salmista',
  // 'Ostiario',
  'Borrar',
  'Cancelar'
];

const Responsable_Index = contactAttributes.indexOf('Responsable');
const Salmista_Index = contactAttributes.indexOf('Salmista');
const Ostiario_Index = contactAttributes.indexOf('Ostiario');
const Borrar_Index = contactAttributes.indexOf('Borrar');
const Cancelar_Index = contactAttributes.indexOf('Cancelar');

const CommunityScreen = props => {
  if (props.items.length == 0)
    return (
      <BaseCallToAction
        icon="people"
        title="Lista de la Comunidad"
        text="Puede importar desde tus contactos los nombres de los hermanos de la comunidad y usarlos al crear las listas"
        buttonHandler={() => props.contactImport()}
        buttonText="Importar contactos"
      />
    );
  return (
    <BaseScreen>
      <FlatList
        data={props.items}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var contactFullName =
            Platform.OS == 'ios'
              ? `${item.givenName} ${item.familyName}`
              : item.givenName;

          var flags = (
            <View style={{ flexDirection: 'row' }}>
              {item.r === true && (
                <Icon
                  name="trophy"
                  style={{ marginRight: 4, color: colors.Responsable }}
                />
              )}
              {item.s === true && (
                <Icon
                  name="musical-notes"
                  style={{ marginRight: 4, color: colors.Salmista }}
                />
              )}
              {item.o === true && (
                <Icon name="water" style={{ color: colors.Ostiario }} />
              )}
            </View>
          );
          return (
            <ListItem
              avatar
              button
              onLongPress={() => {
                ActionSheet.show(
                  {
                    options: contactAttributes,
                    cancelButtonIndex: Cancelar_Index,
                    destructiveButtonIndex: Borrar_Index,
                    title: 'Acciones'
                  },
                  index => {
                    switch (index) {
                      case Responsable_Index:
                        props.contactToggleAttibute(item, 'r');
                        break;
                      case Salmista_Index:
                        props.contactToggleAttibute(item, 's');
                        break;
                      case Ostiario_Index:
                        props.contactToggleAttibute(item, 'o');
                        break;
                      case Borrar_Index:
                        props.contactDelete(item);
                        break;
                    }
                  }
                );
              }}>
              <Left>
                <Thumbnail
                  small
                  source={
                    item.hasThumbnail ? { uri: item.thumbnailPath } : unknown
                  }
                />
              </Left>
              <Body>
                <Text>{item.givenName}</Text>
                <Text note>{contactFullName}</Text>
              </Body>
              <Right>{flags}</Right>
            </ListItem>
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  return {
    items: getProcessedContacts(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    contactDelete: contact => {
      Alert.alert(`Eliminar "${contact.givenName}"`, '¿Confirma el borrado?', [
        {
          text: 'Eliminar',
          onPress: () => dispatch(syncContact(contact, false)),
          style: 'destructive'
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]);
    },
    contactImport: () => {
      dispatch(showContactImportDialog());
    },
    contactToggleAttibute: (contact, attribute) => {
      dispatch(setContactAttribute(contact, attribute));
    }
  };
};

/* eslint-disable no-unused-vars */
const ImportContacts = props => {
  return (
    <Icon
      name="sync"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 32,
        textAlign: 'center',
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() => props.contactImport()}
    />
  );
};

const ImportContactsButton = connect(mapStateToProps, mapDispatchToProps)(
  ImportContacts
);

CommunityScreen.navigationOptions = props => ({
  title: 'Comunidad',
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="contacts"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  },
  headerRight: <ImportContactsButton />
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityScreen);
