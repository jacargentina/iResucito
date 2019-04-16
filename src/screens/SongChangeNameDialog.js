// @flow
import React, { useState, useEffect } from 'react';
import { Text, Input, Item } from 'native-base';
import { View } from 'react-native';
import ModalView from './ModalView';
import SongListItem from './SongListItem';
import I18n from '../translations';
import { getSongFileFromString } from '../SongsProcessor';
import commonTheme from '../native-base-theme/variables/platform';

const SongChangeNameDialog = (props: any) => {
  const { navigation } = props;
  const song = navigation.getParam('song');
  const nameToEdit = navigation.getParam('nameToEdit');
  const action = navigation.getParam('action');

  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState(nameToEdit);
  const [changeSong, setChangeSong] = useState(song);

  const runAction = () => {
    action(name);
    navigation.goBack(null);
  };

  useEffect(() => {
    if (name !== undefined) {
      setActionEnabled(name.length > 0 && name !== nameToEdit);
      const parsed = getSongFileFromString(name);
      const changed = Object.assign({}, song, parsed);
      setChangeSong(changed);
    }
  }, [name]);

  const saveButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={() => {
        if (actionEnabled) {
          runAction();
        }
      }}>
      {I18n.t('ui.apply')}
    </Text>
  );

  const cancelButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginLeft: 10
      }}
      onPress={() => navigation.goBack(null)}>
      {I18n.t('ui.cancel')}
    </Text>
  );

  return (
    <ModalView
      title={I18n.t('ui.rename')}
      right={saveButton}
      left={cancelButton}>
      <View style={{ padding: 10 }}>
        <Item error={!actionEnabled} success={actionEnabled}>
          <Input
            autoFocus
            onChangeText={setName}
            value={name}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Item>
        <Text style={{ margin: 10 }} note>
          {I18n.t('ui.song change name help')}
        </Text>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.original song')}
          </Text>
          <SongListItem
            songKey={song.key}
            devModeDisabled={true}
            showBadge={true}
            patchSectionDisabled={true}
          />
        </View>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.patched song')}
          </Text>
          <SongListItem
            song={changeSong}
            devModeDisabled={true}
            showBadge={true}
            patchSectionDisabled={true}
          />
        </View>
      </View>
    </ModalView>
  );
};

export default SongChangeNameDialog;
