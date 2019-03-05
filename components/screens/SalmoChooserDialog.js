// @flow
import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import BaseModal from './BaseModal';
import SalmoList from './SalmoList';
import { DataContext } from '../../DataContext';
import I18n from '../translations';

const styles = StyleSheet.create({
  tabs: { fontSize: 14 }
});

const SalmoChooserDialog = (props: any) => {
  const data = useContext(DataContext);

  const { visible, tabs, hide, target } = data.salmoChooserDialog;
  const { setList, save, filter } = data.lists;
  const { setSongLocalePatch } = data.songsMeta;

  const songAssign = salmo => {
    if (target.listName && target.listKey !== undefined) {
      setList(target.listName, target.listKey, salmo.nombre);
      save();
      hide();
    } else if (target.locale && target.file) {
      setSongLocalePatch(salmo, target.locale, target.file).then(() => {
        hide();
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
          navigation={props.navigation}
          filter={v.params ? v.params.filter : null}
          devModeDisabled={true}
          onPress={salmo => songAssign(salmo)}
        />
      </Tab>
    );
  });

  return (
    <BaseModal
      visible={visible}
      closeModal={hide}
      title={I18n.t('screen_title.find song')}
      fade={true}>
      <Tabs initialPage={0} renderTabBar={() => <ScrollableTab />}>
        {items}
      </Tabs>
    </BaseModal>
  );
};

export default SalmoChooserDialog;
