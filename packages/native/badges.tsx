import * as React from 'react';
import { Avatar } from './gluestack';
import { colors } from '@iresucito/core';

const createBadge = (backgroundColor: string, color: string, text: string) => {
  return (
    <Avatar mr="$2" bgColor={backgroundColor}>
      <Avatar.FallbackText color={color}>{text}</Avatar.FallbackText>
    </Avatar>
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
