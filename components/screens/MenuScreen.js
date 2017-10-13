import React from 'react';
import { connect } from 'react-redux';
import { FlatList, ScrollView } from 'react-native';
import { ListItem, Left, Body, Text, Icon } from 'native-base';
import ListChooser from './ListChooser';
import ListAddDialog from './ListAddDialog';
import AcercaDe from './AcercaDe';
import menu from '../menu';

const MenuScreen = props => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
      <AcercaDe />
      <ListAddDialog />
      <ListChooser />
      <FlatList
        data={menu}
        keyExtractor={item => item.title}
        renderItem={({ item }) => {
          if (item.divider) {
            return (
              <ListItem itemDivider>
                <Text>{item.title}</Text>
              </ListItem>
            );
          }
          return (
            <ListItem
              avatar
              onPress={() => {
                props.navigation.navigate(item.route, item.params);
              }}>
              <Left>{item.badge}</Left>
              <Body>
                <Text>{item.title}</Text>
                <Text note>{item.note}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </ScrollView>
  );
};

MenuScreen.navigationOptions = () => ({
  title: 'Búsqueda',
  tabBarIcon: ({ tintColor }) => {
    return <Icon name="search" style={{ color: tintColor }} />;
  }
});

export default connect()(MenuScreen);
