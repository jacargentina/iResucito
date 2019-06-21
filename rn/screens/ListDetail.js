// @flow
import React, { Fragment, useContext, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { Alert, View, Platform } from 'react-native';
import { Icon, List, Text, Fab } from 'native-base';
import Swipeout from 'react-native-swipeout';
import ListDetailItem from './ListDetailItem';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';

const ListDetail = (props: any) => {
  const data = useContext(DataContext);
  const [scroll, setScroll] = useState();
  const [noteFocused, setNoteFocused] = useState(false);
  const { navigation } = props;
  const { setList, getListForUI } = data.lists;

  const { name: listName } = navigation.getParam('list');

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

  if (uiList.type == 'libre') {
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
                    type: Platform.OS == 'ios' ? 'delete' : 'default',
                    backgroundColor:
                      Platform.OS == 'android' ? '#e57373' : null,
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
        <Fab
          containerStyle={{}}
          style={{ backgroundColor: commonTheme.brandPrimary }}
          position="bottomRight"
          onPress={() =>
            navigation.navigate('SongChooser', {
              target: { listName: listName, listKey: uiList.items.length }
            })
          }>
          <Icon name="add" />
        </Fab>
      </Fragment>
    );
  }
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
  const list = props.navigation.getParam('list');
  const data = useContext(DataContext);
  const { shareList } = data.lists;
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => shareList(list.name)}
    />
  );
});

ListDetail.navigationOptions = props => {
  const list = props.navigation.getParam('list');
  return {
    title: list ? list.name : 'Lista',
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ShareList />
      </View>
    )
  };
};

export default ListDetail;
