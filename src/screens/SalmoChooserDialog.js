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
  const [initialTab, setInitialTab] = useState(0);

  const target = navigation.getParam('target');

  useEffect(() => {
    var tabs = search.searchItems.filter(x => x.chooser != undefined);
    setTabs(tabs);
    if (target.listName && target.listKey) {
      var initialTab = tabs.find(t => t.chooser_listKey === target.listKey);
      var tabIndex = initialTab ? tabs.indexOf(initialTab) : 0;
      setInitialTab(tabIndex);
    }
  }, []);

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
        initialPage={initialTab}
        renderTabBar={() => (items.length > 0 ? <ScrollableTab /> : <View />)}>
        {items}
      </Tabs>
    </BaseModal>
  );
};

export default SalmoChooserDialog;
