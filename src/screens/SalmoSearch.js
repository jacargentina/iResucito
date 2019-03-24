// @flow
import React, { useContext } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { FlatList, ScrollView, View } from 'react-native';
import { Spinner, ListItem, Left, Body, Text, Separator } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Spinner color={commonTheme.brandPrimary} size="large" />
      <Text style={{ flex: 0, alignSelf: 'center' }}>
        {I18n.t('ui.loading')}
      </Text>
    </View>
  );
};

const SalmoSearch = (props: any) => {
  const data = useContext(DataContext);
  const { initialized, searchItems } = data.search;

  if (!initialized) {
    return <Loading />;
  }

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

export default SalmoSearch;
