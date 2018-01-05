import React from 'react';
import { connect } from 'react-redux';
import { FlatList, ScrollView } from 'react-native';
import { ListItem, Left, Body, Text, Icon, Separator } from 'native-base';
import ListAddDialog from './ListAddDialog';
import SalmoChooserDialog from './SalmoChooserDialog';
import ContactChooserDialog from './ContactChooserDialog';
import ContactImportDialog from './ContactImportDialog';
import AcercaDe from './AcercaDe';
import I18n from '../translations';
import { getSearchItems } from '../selectors';

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
        data={props.items}
        keyExtractor={item => item.title}
        renderItem={({ item, index }) => {
          var nextItem = props.items[index + 1];
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
  title: I18n.t('screen_title.search'),
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

const mapStateToProps = state => {
  return {
    items: getSearchItems(state)
  };
};

export default connect(mapStateToProps)(SalmoSearch);
