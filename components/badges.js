import React from 'react';
import { Badge, Text } from 'native-base';
import colors from './colors';

const createBadge = (backgroundColor, color, text) => {
  return (
    <Badge style={{ backgroundColor: backgroundColor }}>
      <Text style={{ color: color }}>{text}</Text>
    </Badge>
  );
};

const badges = {
  Alfabético: createBadge('#e67e22', 'white', 'A'),
  Precatecumenado: createBadge(colors.Precatecumenado, 'black', 'P'),
  Catecumenado: createBadge(colors.Catecumenado, 'black', 'C'),
  Eleccion: createBadge(colors.Eleccion, 'black', 'E'),
  Liturgia: createBadge(colors.Liturgia, 'black', 'L')
};

export default badges;
