// @flow
import React, { useContext, useState, useEffect } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { FlatList, ScrollView, View } from 'react-native';
import { ListItem, Left, Body, Text, Icon, Separator } from 'native-base';
import * as Animatable from 'react-native-animatable';
import ListAddDialog from './ListAddDialog';
import SalmoChooserDialog from './SalmoChooserDialog';
import ContactChooserDialog from './ContactChooserDialog';
import ContactImportDialog from './ContactImportDialog';
import SalmoChooseLocaleDialog from './SalmoChooseLocaleDialog';
import AcercaDe from './AcercaDe';
import I18n from '../translations';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { DataContext } from '../DataContext';

const SalmoSearch = (props: any) => {
  const data = useContext(DataContext);
  const { searchItems } = data;
  return (
    <AndroidBackHandler onBackPress={() => true}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <AcercaDe navigation={props.navigation} />
        <ListAddDialog navigation={props.navigation} />
        <SalmoChooserDialog navigation={props.navigation} />
        <ContactImportDialog navigation={props.navigation} />
        <ContactChooserDialog navigation={props.navigation} />
        <SalmoChooseLocaleDialog navigation={props.navigation} />
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

class Loading extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  render() {
    var { style } = this.props;
    if (this.props.loading) {
      return (
        <View style={style}>
          <Icon
            active
            name="refresh"
            style={{
              width: 32,
              fontSize: 30,
              textAlign: 'center',
              color: AppNavigatorOptions.headerTitleStyle.color
            }}
          />
        </View>
      );
    }
    return null;
  }
}

const AnimatedLoading = Animatable.createAnimatableComponent(Loading);

SalmoSearch.navigationOptions = (props: any) => ({
  title: I18n.t('screen_title.search'),
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="search"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  },
  headerRight: (
    <AnimatedLoading animation="rotate" iterationCount="infinite" {...props} />
  )
});

export default SalmoSearch;
