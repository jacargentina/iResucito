// @flow
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Alert, View, Platform } from 'react-native';
import { Icon, List, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import ListDetailItem from './ListDetailItem';
import { DataContext } from '../DataContext';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../translations';

const ListDetail = (props: any) => {
  const data = useContext(DataContext);
  const [uiList, setUIList] = useState();
  const { lists, setList, getListForUI, shareList, save } = data.lists;
  const listName = props.navigation.state.params.list.name;

  useEffect(() => {
    setUIList(getListForUI(listName));
  }, [lists]);

  const confirmListDeleteSong = (songTitle, list, key) => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${songTitle}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            setList(list, key);
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

  if (!uiList) {
    return null;
  }

  if (uiList.type == 'libre') {
    var songs = uiList.items;
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
                  confirmListDeleteSong(song.titulo, listName, key);
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
                  listName={listName}
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
          listName={listName}
          listKey="ambiental"
          listText={uiList.ambiental}
        />
        <ListDetailItem
          listName={listName}
          listKey="entrada"
          listText={uiList.entrada}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={listName}
          listKey="1-monicion"
          listText={uiList['1-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="1"
          listText={uiList['1']}
        />
        {uiList.hasOwnProperty('1-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="1-salmo"
            listText={uiList['1-salmo']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="2-monicion"
          listText={uiList['2-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="2"
          listText={uiList['2']}
        />
        {uiList.hasOwnProperty('2-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="2-salmo"
            listText={uiList['2-salmo']}
            navigation={props.navigation}
          />
        )}
        {uiList.hasOwnProperty('3-monicion') && (
          <ListDetailItem
            listName={listName}
            listKey="3-monicion"
            listText={uiList['3-monicion']}
          />
        )}
        {uiList.hasOwnProperty('3') && (
          <ListDetailItem
            listName={listName}
            listKey="3"
            listText={uiList['3']}
          />
        )}
        {uiList.hasOwnProperty('3-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="3-salmo"
            listText={uiList['3-salmo']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="evangelio-monicion"
          listText={uiList['evangelio-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="evangelio"
          listText={uiList['evangelio']}
        />
        {uiList.hasOwnProperty('paz') && (
          <ListDetailItem
            listName={listName}
            listKey="paz"
            listText={uiList['paz']}
            navigation={props.navigation}
          />
        )}
        {uiList.hasOwnProperty('comunion-pan') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-pan"
            listText={uiList['comunion-pan']}
            navigation={props.navigation}
          />
        )}
        {uiList.hasOwnProperty('comunion-caliz') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-caliz"
            listText={uiList['comunion-caliz']}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="salida"
          listText={uiList.salida}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={listName}
          listKey="nota"
          listText={uiList.nota}
          navigation={props.navigation}
        />
      </List>
    </KeyboardAwareScrollView>
  );
};

const ShareList = props => {
  const listName = props.navigation.state.params.list.name;
  const data = useContext(DataContext);
  const { shareList } = data.lists;
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
  const data = useContext(DataContext);
  const { lists } = data.lists;
  const listName = props.navigation.state.params.list.name;
  const targetList = lists[listName];
  if (targetList.type !== 'libre') {
    return null;
  }
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
