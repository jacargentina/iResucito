// @flow
import React, { useContext, useEffect, useState } from 'react';
import SongViewFrame from './SongViewFrame';
import ModalView from './ModalView';
import I18n from '../translations';
import { DataContext } from '../DataContext';
import StarRating from 'react-native-star-rating';
import commonTheme from '../native-base-theme/variables/platform';

const SongPreviewScreenDialog = (props: any) => {
  const data = useContext(DataContext);
  const { getSongRating, setSongRating } = data.songsMeta;
  const { navigation } = props;
  const { lines, locale, titulo, fuente, etapa, key } = navigation.getParam(
    'data'
  );
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getSongRating(key).then(value => {
      setRating(value);
    });
  }, []);

  const changeRating = newValue => {
    setRating(newValue);
    setSongRating(key, newValue);
  };

  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewFrame
        lines={lines}
        locale={locale}
        titulo={titulo}
        fuente={fuente}
        etapa={etapa}
      />
      <StarRating
        containerStyle={{ padding: 10 }}
        disabled={false}
        maxStars={5}
        rating={rating}
        selectedStar={changeRating}
        fullStarColor={commonTheme.brandPrimary}
      />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
