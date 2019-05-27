// @flow
import React from 'react';
import { Badge, Text } from 'native-base';
import colors from './colors';
import commonTheme from './native-base-theme/variables/platform';
import textTheme from './native-base-theme/components/Text';

const noteStyles = textTheme(commonTheme)['.note'];

const createBadge = (backgroundColor, color, text) => {
  return (
    <Badge
      style={{
        backgroundColor: backgroundColor
      }}>
      <Text style={{ color: color, fontSize: noteStyles.fontSize }}>
        {text}
      </Text>
    </Badge>
  );
};

const badges = {
  alpha: createBadge('#e67e22', 'white', 'A'),
  precatechumenate: createBadge(colors.precatechumenate, 'black', 'P'),
  catechumenate: createBadge(colors.catechumenate, 'black', 'C'),
  election: createBadge(colors.election, 'black', 'E'),
  liturgy: createBadge(colors.liturgy, 'black', 'L')
};

export default badges;
