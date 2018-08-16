// @flow
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import BaseModal from './BaseModal';
import SalmoList from './SalmoList';
import {
  addSalmoToList,
  setSongLocalePatch,
  saveLists,
  closeChooserDialog
} from '../actions';
import I18n from '../translations';

const styles = StyleSheet.create({
  tabs: { fontSize: 14 }
});

const SalmoChooserDialog = (props: any) => {
  var items = props.tabs.map((v, i) => {
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
          onPress={salmo => props.songAssign(salmo, props.target)}
        />
      </Tab>
    );
  });
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      title={I18n.t('screen_title.find song')}
      fade={true}>
      <Tabs initialPage={0} renderTabBar={() => <ScrollableTab />}>
        {items}
      </Tabs>
    </BaseModal>
  );
};

const mapStateToProps = state => {
  var chooser = state.ui.get('chooser');
  var search = state.ui.get('search');
  var chooser_target = state.ui.get('chooser_target');
  var tabs = search.filter(x => x.chooser != undefined);
  return {
    target: chooser_target ? chooser_target.toJS() : null,
    visible: chooser === 'Salmo',
    tabs: tabs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(closeChooserDialog());
    },
    songAssign: (salmo, target) => {
      if (target.listName && target.listKey) {
        dispatch(addSalmoToList(salmo, target.listName, target.listKey));
        dispatch(saveLists());
        dispatch(closeChooserDialog());
      } else if (target.locale && target.file) {
        dispatch(setSongLocalePatch(salmo, target.locale, target.file)).then(
          () => {
            dispatch(closeChooserDialog());
          }
        );
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmoChooserDialog);
