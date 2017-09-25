import React from 'react';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  Container,
  Content,
  ListItem,
  Left,
  Right,
  Body,
  Text,
  Button
} from 'native-base';

const MenuScreen = props => {
  return (
    <Container>
      <Content padder>
        <Button
          full
          style={{ margin: 10 }}
          onPress={() => {
            props.navigation.navigate('List');
          }}>
          <Text>Alfabetico</Text>
        </Button>
        <Button
          full
          style={{ margin: 10 }}
          onPress={() => {
            props.navigation.navigate('List', { categoria: 'Precatecumenado' });
          }}>
          <Text>Precatecumenado</Text>
        </Button>
        <Button full style={{ margin: 10 }}>
          <Text>Catecumenado</Text>
        </Button>
        <Button full style={{ margin: 10 }}>
          <Text>Eleccion</Text>
        </Button>
        <Button full style={{ margin: 10 }}>
          <Text>Liturgia</Text>
        </Button>
      </Content>
    </Container>
  );
};

MenuScreen.navigationOptions = {
  title: 'iResucitó'
};

export default connect()(MenuScreen);
