// @flow
import React, { useContext } from 'react';
import { Icon, ActionSheet } from 'native-base';
import { useRoute } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import I18n from '../../translations';

const ShareListButton = (props: any) => {
  const route = useRoute();
  const { listName } = route.params;
  const data = useContext(DataContext);
  const { shareList } = data.lists;

  const chooseShareFormat = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('list_export_options.native'),
          I18n.t('list_export_options.plain text'),
          I18n.t('list_export_options.pdf file'),
          I18n.t('ui.cancel'),
        ],
        cancelButtonIndex: 3,
        title: I18n.t('ui.export.type'),
      },
      (index) => {
        index = Number(index);
        switch (index) {
          case 0:
            shareList(listName, data.localeReal, 'native');
            break;
          case 1:
            shareList(listName, data.localeReal, 'text');
            break;
          case 2:
            shareList(listName, data.localeReal, 'pdf');
            break;
        }
      }
    );
  };
  return (
    <Icon
      name="share-outline"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={chooseShareFormat}
    />
  );
};

export default ShareListButton;
