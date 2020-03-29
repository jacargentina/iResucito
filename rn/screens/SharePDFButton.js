// @flow
import React, { useContext } from 'react';
import { Icon } from 'native-base';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { DataContext } from '../DataContext';

const SharePDFButton = (props: any) => {
  const data = useContext(DataContext);
  const { route } = props;
  const { sharePDF } = data;
  const { title, uri } = route.params;
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={() => sharePDF(title, uri)}
    />
  );
};

export default SharePDFButton;
