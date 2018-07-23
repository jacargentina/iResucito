// @flow
import React from 'react';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';
import { Text, ListItem, Body, Icon } from 'native-base';
import { FlatList, View } from 'react-native';
import { hideChooseLocaleDialog, setSongLocalePatch } from '../actions';
import { getLocaleReal, getAvailableSongsForPatch } from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

const SalmoChooseLocaleDialog = (props: any) => {
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      title={I18n.t('screen_title.choose song')}
      fade={true}>
      {props.items.length == 0 && (
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around'
          }}>
          <Icon
            name="link"
            style={{
              fontSize: 120,
              color: commonTheme.brandPrimary,
              alignSelf: 'center'
            }}
          />
          <Text note style={{ textAlign: 'center' }}>
            {I18n.t('ui.empty songs list')}
          </Text>
        </View>
      )}
      <FlatList
        data={props.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <ListItem
              onPress={() => {
                props.localeFileSelected(props.targetSalmo, props.locale, item);
              }}>
              <Body>
                <Text>{item}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </BaseModal>
  );
};

const mapStateToProps = (state, props) => {
  var visible = state.ui.get('locale_choose_visible');
  var targetSalmo = state.ui.get('locale_choose_target_salmo');
  return {
    targetSalmo: targetSalmo,
    visible: visible,
    locale: getLocaleReal(state),
    items: getAvailableSongsForPatch(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(hideChooseLocaleDialog());
    },
    localeFileSelected: (salmo, locale, file) => {
      dispatch(setSongLocalePatch(salmo, locale, file));
      dispatch(hideChooseLocaleDialog());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SalmoChooseLocaleDialog
);
