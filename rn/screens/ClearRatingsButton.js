// @flow
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { Icon } from 'native-base';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const ClearRatingsButton = () => {
  const data = useContext(DataContext);
  const { ratingsFileExists, clearSongsRatings } = data.songsMeta;

  if (!ratingsFileExists) {
    return null;
  }

  return (
    <Icon
      name="star"
      type="FontAwesome"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={() => {
        Alert.alert(
          `${I18n.t('ui.clear ratings')}`,
          I18n.t('ui.clear ratings confirmation'),
          [
            {
              text: I18n.t('ui.yes'),
              onPress: () => {
                clearSongsRatings();
              },
              style: 'destructive',
            },
            {
              text: I18n.t('ui.cancel'),
              style: 'cancel',
            },
          ]
        );
      }}
    />
  );
};

export default ClearRatingsButton;
