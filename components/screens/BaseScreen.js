import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

import {
  Container,
  Header,
  Title,
  Subtitle,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Input,
  Item
} from 'native-base';

const BaseScreen = props => {
  if (props.searchHandler) {
    var searchView = (
      <View>
        <Item>
          <Input
            placeholder="Buscar..."
            onChangeText={text => props.searchHandler(text)}
            returnKeyType='search'
            autoCapitalize='none'
            clearButtonMode='always'
          />
        </Item>
      </View>
    );
  }
  return (
    <Container>
      <Header style={{ backgroundColor: '#3589de' }}>
        <Left>
          <Button
            transparent
            onPress={() => {
              props.navigation.navigate('DrawerOpen');
            }}>
            <Icon name="menu" style={{ color: 'white' }} />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: 'white' }}>{props.title}</Title>
        </Body>
        <Right />
      </Header>
      {searchView}
      <Content>{props.children}</Content>
    </Container>
  );
};

export default connect()(BaseScreen);
