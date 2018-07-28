// @flow
import React from 'react';
import { Alert, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Icon, List, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import ListDetailItem from './ListDetailItem';
import {
  openChooserDialog,
  shareList,
  deleteListSong,
  saveLists
} from '../actions';
import { getSongsFromList } from '../selectors';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../translations';

const ListDetail = (props: any) => {
  if (props.listMap.get('type') == 'libre') {
    var songs = props.listMap.get('items').toArray();
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
                  props.listDeleteSong(song.titulo, props.list.name, key);
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
                  listName={props.list.name}
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
          listName={props.list.name}
          listKey="ambiental"
          listText={props.listMap.get('ambiental')}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="entrada"
          listText={props.listMap.get('entrada')}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="1-monicion"
          listText={props.listMap.get('1-monicion')}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="1"
          listText={props.listMap.get('1')}
        />
        {props.listMap.has('1-salmo') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="1-salmo"
            listText={props.listMap.get('1-salmo')}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={props.list.name}
          listKey="2-monicion"
          listText={props.listMap.get('2-monicion')}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="2"
          listText={props.listMap.get('2')}
        />
        {props.listMap.has('2-salmo') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="2-salmo"
            listText={props.listMap.get('2-salmo')}
            navigation={props.navigation}
          />
        )}
        {props.listMap.has('3-monicion') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="3-monicion"
            listText={props.listMap.get('3-monicion')}
          />
        )}
        {props.listMap.has('3') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="3"
            listText={props.listMap.get('3')}
          />
        )}
        {props.listMap.has('3-salmo') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="3-salmo"
            listText={props.listMap.get('3-salmo')}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={props.list.name}
          listKey="evangelio-monicion"
          listText={props.listMap.get('evangelio-monicion')}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="evangelio"
          listText={props.listMap.get('evangelio')}
        />
        {props.listMap.has('paz') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="paz"
            listText={props.listMap.get('paz')}
            navigation={props.navigation}
          />
        )}
        {props.listMap.has('comunion-pan') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="comunion-pan"
            listText={props.listMap.get('comunion-pan')}
            navigation={props.navigation}
          />
        )}
        {props.listMap.has('comunion-caliz') && (
          <ListDetailItem
            listName={props.list.name}
            listKey="comunion-caliz"
            listText={props.listMap.get('comunion-caliz')}
            navigation={props.navigation}
          />
        )}
        <ListDetailItem
          listName={props.list.name}
          listKey="salida"
          listText={props.listMap.get('salida')}
          navigation={props.navigation}
        />
        <ListDetailItem
          listName={props.list.name}
          listKey="nota"
          listText={props.listMap.get('nota')}
          navigation={props.navigation}
        />
      </List>
    </KeyboardAwareScrollView>
  );
};

const mapStateToProps = (state, props) => {
  var listMap = getSongsFromList(state, props);
  return {
    list: props.navigation.state.params.list,
    listMap: listMap,
    listCount: listMap.get('items') ? listMap.get('items').size : 0
  };
};

const mapDispatchToProps = dispatch => {
  return {
    listShare: (list, listMap) => {
      dispatch(shareList(list.name, listMap));
    },
    openChooser: (type, list, key) => {
      dispatch(openChooserDialog(type, list, key));
    },
    listDeleteSong: (songTitle, list, key) => {
      Alert.alert(
        `${I18n.t('ui.delete')} "${songTitle}"`,
        I18n.t('ui.delete confirmation'),
        [
          {
            text: I18n.t('ui.delete'),
            onPress: () => {
              dispatch(deleteListSong(list, key));
              dispatch(saveLists());
            },
            style: 'destructive'
          },
          {
            text: I18n.t('ui.cancel'),
            style: 'cancel'
          }
        ]
      );
    }
  };
};

const ShareList = props => {
  if (props.listMap.keys().length == 0) {
    return null;
  }
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() =>
        props.listShare(props.navigation.state.params.list, props.listMap)
      }
    />
  );
};

const ShareListButton = connect(mapStateToProps, mapDispatchToProps)(ShareList);

const AddSong = props => {
  if (props.listMap.get('type') !== 'libre') {
    return null;
  }
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
      onPress={() =>
        props.openChooser('Salmo', props.list.name, props.listCount)
      }
    />
  );
};

const ConnectedAddSong = connect(mapStateToProps, mapDispatchToProps)(AddSong);

ListDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.list.name
    : 'Lista',
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <ShareListButton {...props} />
      <ConnectedAddSong {...props} />
    </View>
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDetail);
