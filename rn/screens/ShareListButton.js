// @flow
import React, { useContext } from 'react';
import { Icon, ActionSheet } from 'native-base';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import I18n from '../../translations';

const ShareListButton = (props: any) => {
  const { route } = props;
  const { listName } = route.params;
  const data = useContext(DataContext);
  const { shareList } = data.lists;

  const chooseShareFormat = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('list_export_options.native'),
          I18n.t('list_export_options.plain text'),
          I18n.t('ui.cancel')
        ],
        cancelButtonIndex: 2,
        title: I18n.t('ui.export.type')
      },
      index => {
        index = Number(index);
        switch (index) {
          case 0:
            shareList(listName, true);
            break;
          case 1:
            shareList(listName, false);
            break;
        }
      }
    );
  };
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={chooseShareFormat}
    />
  );
};

export default ShareListButton;
