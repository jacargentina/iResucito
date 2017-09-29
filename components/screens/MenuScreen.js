import React from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import { Container, ListItem, Left, Right, Body, Text } from 'native-base';

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

MenuScreen.navigationOptions = {
  title: 'iResucitó'
};

const mapStateToProps = state => {
  return {
    screens: state.ui.get('menu')
  };
};

export default connect(mapStateToProps)(MenuScreen);
