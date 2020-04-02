// @flow
import React, { useContext } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { FlatList, View } from 'react-native';
import { Spinner, ListItem, Left, Body, Text, Separator } from 'native-base';
import { DataContext } from '../DataContext';
import { useNavigation } from '@react-navigation/native';
import I18n from '../../translations';
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

const SongSearch = (props: any) => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { initialized, searchItems } = data.search;

  if (!initialized) {
    return <Loading />;
  }

  return (
    <AndroidBackHandler onBackPress={() => true}>
      <FlatList
        data={searchItems}
        keyExtractor={(item, i) => String(i)}
        renderItem={({ item, index }) => {
          var nextItem = searchItems[index + 1];
          if (item.divider) {
            return (
              <Separator bordered>
                <Text>{I18n.t(item.title_key).toUpperCase()}</Text>
              </Separator>
            );
          }
          return (
            <ListItem
              last={nextItem && nextItem.divider}
              avatar
              onPress={() => {
                navigation.navigate(item.route, item.params);
              }}>
              <Left>{item.badge}</Left>
              <Body>
                <Text>{I18n.t(item.title_key)}</Text>
                <Text note>{I18n.t(item.note_key)}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </AndroidBackHandler>
  );
};

export default SongSearch;
