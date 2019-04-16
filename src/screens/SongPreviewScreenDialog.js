// @flow
import React, { useContext, useState } from 'react';
import SongViewFrame from './SongViewFrame';
import ModalView from './ModalView';
import I18n from '../translations';
import { DataContext } from '../DataContext';
import StarRating from 'react-native-star-rating';
import commonTheme from '../native-base-theme/variables/platform';

const SongPreviewScreenDialog = (props: any) => {
  const data = useContext(DataContext);
  const { setSongRating } = data.songsMeta;
  const { navigation } = props;
  const {
    lines,
    locale,
    titulo,
    fuente,
    etapa,
    rating,
    key
  } = navigation.getParam('data');
  const [ratingValue, setRatingValue] = useState(rating);

  const changeRating = newValue => {
    setRatingValue(newValue);
    setSongRating(key, locale, newValue);
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
        rating={ratingValue}
        selectedStar={changeRating}
        fullStarColor={commonTheme.brandPrimary}
      />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
