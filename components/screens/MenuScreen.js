import React from 'react';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import {
  Container,
  ListItem,
  Left,
  Body,
  Text,
  Icon,
} from 'native-base';

const MenuScreen = props => {
  return (
    <Container>
      <FlatList
        data={props.screens}
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
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    screens: state.ui.get('menu')
  };
};

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {};
};

MenuScreen.navigationOptions = props => ({
  title: 'Búsqueda',
  tabBarIcon: ({ tintColor }) => {
    return <Icon name="menu" style={{ color: tintColor }} />;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
