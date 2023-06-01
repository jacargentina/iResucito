import * as React from 'react';
import { Badge } from './gluestack';
import { colors } from '@iresucito/core';

const createBadge = (backgroundColor: string, color: string, text: string) => {
  return (
    <Badge w="$8" h="$9" mr="$2" p="$2" borderRadius={16} bg={backgroundColor}>
      <Badge.Text color={color} textAlign="center">
        {text}
      </Badge.Text>
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
