import React from 'react';
import { connect } from 'react-redux';
import { FlatList, ScrollView } from 'react-native';
import { ListItem, Left, Body, Text, Icon, Separator } from 'native-base';
import ListAddDialog from './ListAddDialog';
import SalmoChooserDialog from './SalmoChooserDialog';
import ContactChooserDialog from './ContactChooserDialog';
import ContactImportDialog from './ContactImportDialog';
import AcercaDe from './AcercaDe';
import search from '../search';

const SalmoSearch = props => {
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag">
      <AcercaDe />
      <ListAddDialog />
      <SalmoChooserDialog />
      <ContactImportDialog />
      <ContactChooserDialog />
      <FlatList
        data={search}
        keyExtractor={item => item.title}
        renderItem={({ item, index }) => {
          var nextItem = search[index + 1];
          if (item.divider) {
            return (
              <Separator bordered>
                <Text>{item.title}</Text>
              </Separator>
            );
          }
          return (
            <ListItem
              last={nextItem && nextItem.divider}
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

SalmoSearch.navigationOptions = () => ({
  title: 'Buscar',
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="search"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default connect()(SalmoSearch);
