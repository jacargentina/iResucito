import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text } from 'native-base';
import { FlatList } from 'react-native';
import BaseScreen from './BaseScreen';
import SalmosAddDialog from './SalmosAddDialog';
import { getProcessedLists } from '../selectors';

const ListsScreen = props => {
  if (props.items.length == 0) {
    var sinItems = (
      <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
        Ningúna lista definida
      </Text>
    );
  }
  return (
    <BaseScreen {...props}>
      {sinItems}
      <SalmosAddDialog />
      <FlatList
        data={props.items}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          return (
            <ListItem icon>
              <Left>
                <Icon name="list" />
              </Left>
              <Body>
                <Text>{item.name}</Text>
              </Body>
              <Right>
                <Text>{item.count}</Text>
              </Right>
            </ListItem>
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  return {
    items: getProcessedLists(state)
  };
};

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {};
};

ListsScreen.navigationOptions = props => ({
  title: 'Listas',
  tabBarIcon: ({ tintColor }) => {
    return <Icon name="list" style={{ color: tintColor }} />;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListsScreen);
