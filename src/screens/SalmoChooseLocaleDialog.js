// @flow
import React, { useContext, useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { Text, ListItem, Body, Left, Icon } from 'native-base';
import { FlatList, View } from 'react-native';
import { DataContext } from '../DataContext';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../translations';

const SalmoChooseLocaleDialog = (props: any) => {
  const data = useContext(DataContext);

  const { getLocaleReal } = data.settings;
  const { visible, items, hide, target } = data.salmoLocaleChooserDialog;
  const { setSongLocalePatch } = data.songsMeta;

  const localeFileSelected = file => {
    const locale = getLocaleReal();
    setSongLocalePatch(target, locale, file);
    hide();
  };

  return (
    <BaseModal
      visible={visible}
      closeModal={() => close()}
      title={I18n.t('screen_title.choose song')}
      fade={true}>
      {items.length == 0 && (
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
      {target && (
        <ListItem itemDivider>
          <Text>{I18n.t('ui.list_total_songs', { total: items.length })}</Text>
        </ListItem>
      )}
      {target && (
        <ListItem icon>
          <Left>
            <Icon name="musical-notes" />
          </Left>
          <Body>
            <Text>{target.titulo}</Text>
            <Text note>{target.fuente}</Text>
          </Body>
        </ListItem>
      )}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ file }) => {
          return (
            <ListItem
              onPress={() => {
                localeFileSelected(file);
              }}>
              <Body>
                <Text>{file.titulo}</Text>
                <Text note>{file.fuente}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </BaseModal>
  );
};

export default SalmoChooseLocaleDialog;
