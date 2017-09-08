import React from 'react';
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

export default class HomeScreen extends React.Component {
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
    });
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: '#3589de'}}>
          <Left>
            <Button transparent>
              <Icon name="menu" style={{color: 'white'}}/>
            </Button>
          </Left>
          <Body>
            <Title style={{color: 'white'}}>Salmos</Title>
          </Body>
          <Right />
        </Header>
      </Container>
    );
  }
}
