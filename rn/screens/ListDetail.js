// @flow
import React, { Fragment, useContext, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { Alert, View, Platform } from 'react-native';
import { Icon, List, Text, ActionSheet } from 'native-base';
import Swipeout from 'react-native-swipeout';
import ListDetailItem from './ListDetailItem';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../../translations';

const ListDetail = (props: any) => {
  const data = useContext(DataContext);
  const [scroll, setScroll] = useState();
  const [noteFocused, setNoteFocused] = useState(false);
  const { navigation } = props;
  const { setList, getListForUI } = data.lists;

  const listName = navigation.getParam('listName');

  const confirmListDeleteSong = (songTitle, list, key) => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${songTitle}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            setList(list, key);
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

  const uiList = getListForUI(listName);

  if (uiList.type === 'libre') {
    var songs = uiList.items;
    return (
      <Fragment>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {songs.length === 0 && (
            <Text note style={{ textAlign: 'center', marginTop: 20 }}>
              {I18n.t('ui.empty songs list')}
            </Text>
          )}
          {songs.length > 0 && (
            <List>
              {songs.map((song, key) => {
                var swipeoutBtns = [
                  {
                    text: I18n.t('ui.delete'),
                    type: Platform.OS === 'ios' ? 'delete' : 'default',
                    backgroundColor:
                      Platform.OS === 'android' ? '#e57373' : null,
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
                    />
                  </Swipeout>
                );
              })}
            </List>
          )}
        </KeyboardAwareScrollView>
      </Fragment>
    );
  }
  /* eslint-disable dot-notation */
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      innerRef={ref => setScroll(ref)}>
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
        {uiList.hasOwnProperty('oracion-universal') && (
          <ListDetailItem
            listName={listName}
            listKey="oracion-universal"
            listText={uiList['oracion-universal']}
          />
        )}
        {uiList.hasOwnProperty('paz') && (
          <ListDetailItem
            listName={listName}
            listKey="paz"
            listText={uiList['paz']}
          />
        )}
        {uiList.hasOwnProperty('comunion-pan') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-pan"
            listText={uiList['comunion-pan']}
          />
        )}
        {uiList.hasOwnProperty('comunion-caliz') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-caliz"
            listText={uiList['comunion-caliz']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="salida"
          listText={uiList.salida}
        />
        {uiList.hasOwnProperty('encargado-pan') && (
          <ListDetailItem
            listName={listName}
            listKey="encargado-pan"
            listText={uiList['encargado-pan']}
          />
        )}
        {uiList.hasOwnProperty('encargado-flores') && (
          <ListDetailItem
            listName={listName}
            listKey="encargado-flores"
            listText={uiList['encargado-flores']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="nota"
          listText={uiList.nota}
          inputProps={{
            onFocus: () => {
              setNoteFocused(true);
            },
            onBlur: () => {
              setNoteFocused(false);
            },
            onContentSizeChange: () => {
              if (noteFocused && scroll) {
                scroll.props.scrollToEnd();
              }
            }
          }}
        />
      </List>
    </KeyboardAwareScrollView>
  );
};

const ShareList = withNavigation(props => {
  const listName = props.navigation.getParam('listName');
  const data = useContext(DataContext);
  const { shareList } = data.lists;

  const chooseShareFormat = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('list_export_options.native'),
          I18n.t('list_export_options.plain text'),
          I18n.t('ui.cancel')
        ],
        cancelButtonIndex: 2,
        title: I18n.t('ui.export.type')
      },
      index => {
        index = Number(index);
        switch (index) {
          case 0:
            shareList(listName, true);
            break;
          case 1:
            shareList(listName, false);
            break;
        }
      }
    );
  };
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={chooseShareFormat}
    />
  );
});

const AddSong = withNavigation((props: any) => {
  const data = useContext(DataContext);
  const { getListForUI } = data.lists;
  const { navigation } = props;

  const listName = navigation.getParam('listName');
  const uiList = getListForUI(listName);

  if (uiList.type !== 'libre') {
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
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={() =>
        navigation.navigate('SongChooser', {
          target: { listName: listName, listKey: uiList.items.length }
        })
      }
    />
  );
});

ListDetail.navigationOptions = props => {
  const listName = props.navigation.getParam('listName');
  return {
    title: listName ? listName : 'Lista',
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <ShareList />
        <AddSong />
      </View>
    )
  };
};

export default ListDetail;
