// @flow
import React, { useContext, useState, useEffect } from 'react';
import { Alert, View, Platform } from 'react-native';
import { Icon, List, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import ListDetailItem from './ListDetailItem';
import { DataContext } from '../../DataContext';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../translations';

const ListDetail = (props: any) => {
  const data = useContext(DataContext);
  const { lists, setList, getSongsFromList, shareList, save } = data.lists;

  const listName = props.navigation.state.params.list.name;
  const list = getSongsFromList(listName);

  const confirmListDeleteSong = (songTitle, list, key) => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${songTitle}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            setList(list, key, undefined);
            save();
          },
          style: 'destructive'
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  if (list['type'] == 'libre') {
    var songs = list['items'];
    if (songs.length === 0) {
      return (
        <Text note style={{ textAlign: 'center', marginTop: 20 }}>
          {I18n.t('ui.empty songs list')}
        </Text>
      );
    }
    return (
      <KeyboardAwareScrollView>
        <List>
          {songs.map((song, key) => {
            var swipeoutBtns = [
              {
                text: I18n.t('ui.delete'),
                type: Platform.OS == 'ios' ? 'delete' : 'default',
                backgroundColor: Platform.OS == 'android' ? '#e57373' : null,
                onPress: () => {
                  confirmListDeleteSong(song.titulo, list.name, key);
                }
              }
            ];
            return (
              <Swipeout
                key={key}
                right={swipeoutBtns}
                backgroundColor="white"
                autoClose={true}>
                <ListDetailItem
                  listName={list.name}
                  listKey={key}
                  listText={song}
                  navigation={props.navigation}
                />
              </Swipeout>
            );
          })}
        </List>
      </KeyboardAwareScrollView>
    );
  }
  return (
    <KeyboardAwareScrollView>
      <List>
        <ListDetailItem
          listName={list.name}
          listKey="ambiental"
          listText={list['ambiental']}
        />
        <ListDetailItem
          listName={list.name}
          listKey="entrada"
          listText={list['entrada']}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={list.name}
          listKey="1-monicion"
          listText={list['1-monicion']}
        />
        <ListDetailItem listName={list.name} listKey="1" listText={list['1']} />
        {list.hasOwnProperty('1-salmo') && (
          <ListDetailItem
            listName={list.name}
            listKey="1-salmo"
            listText={list['1-salmo']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={list.name}
          listKey="2-monicion"
          listText={list['2-monicion']}
        />
        <ListDetailItem listName={list.name} listKey="2" listText={list['2']} />
        {list.hasOwnProperty('2-salmo') && (
          <ListDetailItem
            listName={list.name}
            listKey="2-salmo"
            listText={list['2-salmo']}
            navigation={props.navigation}
          />
        )}
        {list.hasOwnProperty('3-monicion') && (
          <ListDetailItem
            listName={list.name}
            listKey="3-monicion"
            listText={list['3-monicion']}
          />
        )}
        {list.hasOwnProperty('3') && (
          <ListDetailItem
            listName={list.name}
            listKey="3"
            listText={list['3']}
          />
        )}
        {list.hasOwnProperty('3-salmo') && (
          <ListDetailItem
            listName={list.name}
            listKey="3-salmo"
            listText={list['3-salmo']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={list.name}
          listKey="evangelio-monicion"
          listText={list['evangelio-monicion']}
        />
        <ListDetailItem
          listName={list.name}
          listKey="evangelio"
          listText={list['evangelio']}
        />
        {list.hasOwnProperty('paz') && (
          <ListDetailItem
            listName={list.name}
            listKey="paz"
            listText={list['paz']}
            navigation={props.navigation}
          />
        )}
        {list.hasOwnProperty('comunion-pan') && (
          <ListDetailItem
            listName={list.name}
            listKey="comunion-pan"
            listText={list['comunion-pan']}
            navigation={props.navigation}
          />
        )}
        {list.hasOwnProperty('comunion-caliz') && (
          <ListDetailItem
            listName={list.name}
            listKey="comunion-caliz"
            listText={list['comunion-caliz']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={list.name}
          listKey="salida"
          listText={list['salida']}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={list.name}
          listKey="nota"
          listText={list['nota']}
          navigation={props.navigation}
        />
      </List>
    </KeyboardAwareScrollView>
  );
};

const ShareList = props => {
  const listName = props.navigation.state.params.list.name;
  const data = useContext(DataContext);
  const [, , , , , , , shareList] = data.lists;
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => shareList(listName)}
    />
  );
};

const AddSong = props => {
  if (props.navigation.state.params.list.type !== 'libre') {
    return null;
  }
  const listName = props.navigation.state.params.list.name;
  const data = useContext(DataContext);
  const targetList = data.lists[listName];
  const { show } = data.salmoChooserDialog;
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => show(listName, targetList.items.length)}
    />
  );
};

ListDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.list.name
    : 'Lista',
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <ShareList {...props} />
      <AddSong {...props} />
    </View>
  )
});

export default ListDetail;
