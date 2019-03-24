// @flow
import React, { useContext, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { DataContext } from '../DataContext';
import I18n from '../translations';

const withI18nTitle = (Component: any, localeKey: string) => {
  const WithNavigation = withNavigation(Component);

  const I18nComponent = (props: any) => {
    const data = useContext(DataContext);
    const { settings } = data;
    const locale = settings.keys ? settings.keys.locale : 'default';
    const { navigation } = props;

    useEffect(() => {
      navigation.setParams({ title: I18n.t(localeKey) });
    }, [locale]);

    return <WithNavigation />;
  };

  I18nComponent.navigationOptions = () => {
    return { title: I18n.t(localeKey) };
  };

  return I18nComponent;
};

export default withI18nTitle;
