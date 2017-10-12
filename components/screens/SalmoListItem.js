import React from 'react';
import { ListItem, Left, Right, Body, Text } from 'native-base';
import badges from '../badges';

const SalmoListItem = props => {
  if (props.showBadge) {
    var badgeWrapper = <Left>{badges[props.salmo.etapa]}</Left>;
  }
  if (props.rightButtons) {
    var rightSide = <Right>{props.rightButtons}</Right>;
  }
  return (
    <ListItem
      avatar={props.showBadge}
      onPress={() => {
        props.navigation.navigate('SalmoDetail', { salmo: props.salmo });
      }}>
      {badgeWrapper}
      <Body>
        <Text>{props.salmo.titulo}</Text>
        <Text note>{props.salmo.fuente}</Text>
      </Body>
      {rightSide}
    </ListItem>
  );
};

export default SalmoListItem;
