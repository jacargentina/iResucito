import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Icon, Text, Badge } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import { getProcessedContacts } from '../selectors';
import { showContactImportDialog, deleteContact } from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import BaseCallToAction from './BaseCallToAction';

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
        keyExtractor={item => item.name}
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
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <ListItem avatar>
                <Left>
                  <Badge style={{ backgroundColor: 'transparent' }}>
                    <Icon name="person" />
                  </Badge>
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                  <Text note>{item.type}</Text>
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

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {
    contactDelete: contact => {
      Alert.alert(`Eliminar "${contact.name}"`, '¿Confirma el borrado?', [
        {
          text: 'Eliminar',
          onPress: () => dispatch(deleteContact(contact.name)),
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
