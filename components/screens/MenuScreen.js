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

const screens = [
  { title: 'Alfabético', route: 'List' },
  {
    title: 'Precatecumenado',
    route: 'List',
    params: { categoria: 'Precatecumenado' }
  },
  {
    title: 'Catecumenado',
    route: 'List',
    params: { categoria: 'Catecumenado' }
  },
  {
    title: 'Eleccion',
    route: 'List',
    params: { categoria: 'Eleccion' }
  },
  {
    title: 'Liturgia',
    route: 'List',
    params: { categoria: 'Liturgia' }
  }
];

const MenuScreen = props => {
  return (
    <Container>
      <FlatList
        data={screens}
        keyExtractor={item => item.title}
        renderItem={({ item }) => {
          return (
            <ListItem>
              <Button
                full
                block
                onPress={() => {
                  props.navigation.navigate(item.route, item.params);
                }}>
                <Text>{item.title}</Text>
              </Button>
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

export default connect()(MenuScreen);
