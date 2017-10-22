import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import BaseModal from './BaseModal';
import SalmoList from './SalmoList';
import { closeSalmoChooserDialog } from '../actions';
import search from '../search';

const styles = StyleSheet.create({
  tabs: { fontSize: 14 }
});

class SalmoChooserDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var items = this.props.tabs.map((v, i) => {
      return (
        <Tab
          key={i}
          heading={v.chooser.toUpperCase()}
          textStyle={styles.tabs}
          activeTextStyle={styles.tabs}>
          <SalmoList filter={v.params.filter} />
        </Tab>
      );
    });
    return (
      <BaseModal
        visible={this.props.visible}
        closeModal={() => this.props.close()}
        title="Buscar Salmo">
        <Tabs initialPage={0} renderTabBar={() => <ScrollableTab />}>
          {items}
        </Tabs>
      </BaseModal>
    );
  }
}
const mapStateToProps = state => {
  var chooser_target_list = state.ui.get('chooser_target_list');
  var tabs = search.filter(x => x.chooser != undefined);
  return {
    visible: chooser_target_list !== null,
    tabs: tabs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(closeSalmoChooserDialog());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmoChooserDialog);
