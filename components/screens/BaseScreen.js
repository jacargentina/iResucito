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
            autoCorrect={false}
          />
        </Item>
      </View>
    );
  }
  return (
    <Container>
      {searchView}
      <Content>{props.children}</Content>
    </Container>
  );
};

export default connect()(BaseScreen);
