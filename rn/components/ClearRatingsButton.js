// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Alert } from 'react-native';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';

const ClearRatingsButton = (): React.Node => {
  const options = useStackNavOptions();
  const data = useContext(DataContext);
  const { ratingsFileExists, clearSongsRatings } = data.songsMeta;

  if (!ratingsFileExists) {
    return null;
  }

  return (
    <Icon
      as={Ionicons}
      name="star-outline"
      size="md"
      style={{
        marginTop: 4,
        marginRight: 8,
        color: options.headerTitleStyle.color,
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
