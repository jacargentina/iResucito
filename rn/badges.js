// @flow
import * as React from 'react';
import { Badge } from 'native-base';
import colors from '../colors';

const createBadge = (backgroundColor, color, text): React.Node => {
  return (
    <Badge
      w="8"
      h="8"
      mr="2"
      p="2"
      borderRadius="20"
      bg={backgroundColor}
      _text={{ color: color, textAlign: 'center' }}>
      {text}
    </Badge>
  );
};

const badges: any = {
  alpha: createBadge('#e67e22', 'white', 'A'),
  precatechumenate: createBadge(colors.precatechumenate, 'black', 'P'),
  catechumenate: createBadge(colors.catechumenate, 'black', 'C'),
  election: createBadge(colors.election, 'black', 'E'),
  liturgy: createBadge(colors.liturgy, 'black', 'L'),
};

export default badges;
