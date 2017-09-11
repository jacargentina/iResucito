import React from 'react';
import { connect } from 'react-redux';

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
  Text
} from 'native-base';

const BaseScreen = props => {
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
      <Content>{props.children}</Content>
    </Container>
  );
};

export default connect()(BaseScreen);
