import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Icon, Text, Thumbnail } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import { showContactImportDialog, syncContact } from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import BaseCallToAction from './BaseCallToAction';
import { getProcessedContacts } from '../selectors';

var unknown = require('../../img/avatar.png');

const ListScreen = props => {
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
          var swipeoutBtns = [
            {
              text: 'Eliminar',
              type: Platform.OS == 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS == 'android' ? '#e57373' : null,
              onPress: () => {
                props.contactDelete(item);
              }
            }
          ];
          var contactFullName =
            Platform.OS == 'ios'
              ? `${item.givenName} ${item.familyName}`
              : item.givenName;

          return (
            <Swipeout
              key={item.recordID}
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <ListItem avatar>
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
              </ListItem>
            </Swipeout>
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
    }
  };
};

/* eslint-disable no-unused-vars */
const ImportContacts = props => {
  return (
    <Icon
      name="person-add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 40,
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

ListScreen.navigationOptions = props => ({
  title: 'Comunidad',
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="people"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  },
  headerRight: <ImportContactsButton />
});

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
