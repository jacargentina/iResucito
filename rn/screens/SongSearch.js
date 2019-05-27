// @flow
import React, { useContext, useEffect } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { FlatList, ScrollView, View } from 'react-native';
import { Spinner, ListItem, Left, Body, Text, Separator } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const titleLocaleKey = 'screen_title.search';

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
  const { navigation } = props;
  const { initialized, searchItems } = data.search;

  useEffect(() => {
    navigation.setParams({ title: I18n.t(titleLocaleKey) });
  }, [I18n.locale]);

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
          keyExtractor={(item, i) => String(i)}
          renderItem={({ item, index }) => {
            var nextItem = searchItems[index + 1];
            if (item.divider) {
              return (
                <Separator bordered>
                  <Text>{I18n.t(item.title_key)}</Text>
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
                  <Text>{I18n.t(item.title_key)}</Text>
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

SongSearch.navigationOptions = () => {
  return { title: I18n.t(titleLocaleKey), headerBackTitle: I18n.t('ui.back') };
};

export default SongSearch;
