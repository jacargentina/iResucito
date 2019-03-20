// @flow
import React, { useContext } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { FlatList, ScrollView } from 'react-native';
import { ListItem, Left, Body, Text, Separator } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../translations';

const SalmoSearch = (props: any) => {
  const data = useContext(DataContext);
  const { searchItems } = data.search;

  return (
    <AndroidBackHandler onBackPress={() => true}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <FlatList
          data={searchItems}
          keyExtractor={item => item.title}
          renderItem={({ item, index }) => {
            var nextItem = searchItems[index + 1];
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
    </AndroidBackHandler>
  );
};

SalmoSearch.navigationOptions = () => ({
  title: I18n.t('screen_title.search')
});

export default SalmoSearch;
