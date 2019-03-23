// @flow
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import BaseModal from './BaseModal';
import SalmoList from './SalmoList';
import { DataContext } from '../DataContext';
import I18n from '../translations';

const styles = StyleSheet.create({
  tabs: { fontSize: 14 }
});

const SalmoChooserDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { search } = data;
  const { setList } = data.lists;
  const { setSongLocalePatch } = data.songsMeta;
  const [tabs, setTabs] = useState([]);

  const target = navigation.getParam('target');

  useEffect(() => {
    if (search.searchItems) {
      var tabs = search.searchItems.filter(x => x.chooser != undefined);
      setTabs(tabs);
    }
  }, [search.searchItems]);

  const songAssign = salmo => {
    if (target.listName && target.listKey !== undefined) {
      setList(target.listName, target.listKey, salmo.nombre);
      navigation.goBack(null);
    } else if (target.locale && target.file) {
      setSongLocalePatch(salmo, target.locale, target.file).then(() => {
        navigation.goBack(null);
      });
    }
  };

  var items = tabs.map((v, i) => {
    return (
      <Tab
        key={i}
        heading={v.chooser.toUpperCase()}
        textStyle={styles.tabs}
        activeTextStyle={styles.tabs}>
        <SalmoList
          filter={v.params ? v.params.filter : null}
          devModeDisabled={true}
          onPress={salmo => songAssign(salmo)}
        />
      </Tab>
    );
  });

  return (
    <BaseModal title={I18n.t('screen_title.find song')}>
      <Tabs
        initialPage={0}
        renderTabBar={() => (items.length > 0 ? <ScrollableTab /> : <View />)}>
        {items}
      </Tabs>
    </BaseModal>
  );
};

export default SalmoChooserDialog;
