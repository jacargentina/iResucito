// @flow
import * as React from 'react';
import { useContext, useMemo, useEffect, useCallback, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { Text, Center, Spinner, useTheme } from 'native-base';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import ModalView from '../components/ModalView';
import { DataContext } from '../DataContext';
import I18n from '@iresucito/translations';
import SongList from './SongList';

const SongChooserDialog = (props: any): React.Node => {
  const layout = useWindowDimensions();
  const { colors } = useTheme();
  const data = useContext(DataContext);
  const { navigation, route } = props;
  const { searchItems } = data.search;
  const { setList } = data.lists;
  const { target } = route.params;
  const { listName, listKey } = target;

  const choosers = useMemo(() => {
    return searchItems.filter((x) => x.chooser !== undefined);
  }, [searchItems]);

  const [activeTab, setActiveTab] = useState(() => {
    if (listName && listKey) {
      var c = choosers.find(
        (t) => t.chooser_listKey && t.chooser_listKey.includes(listKey)
      );
      if (c) {
        const tab = choosers.indexOf(c);
        return tab;
      }
    }
    return 0;
  });

  const songAssign = useCallback(
    (song: Song) => {
      if (listName && listKey !== undefined) {
        setList(listName, listKey, song.key);
        navigation.goBack(null);
      }
    },
    [navigation, listName, listKey, setList]
  );

  const routes = useMemo(() => {
    return choosers.map((c, i) => {
      return { key: c.chooser, title: c.chooser.toUpperCase() };
    });
  }, [choosers]);

  const renderScene = useMemo(() => {
    var config = {};
    choosers.forEach((c) => {
      config[c.chooser] = () => (
        <SongList
          style={{ flexGrow: 1 }}
          filter={c.params?.filter}
          viewButton={true}
          onPress={(song) => songAssign(song)}
        />
      );
    });
    return SceneMap(config);
  }, [choosers, songAssign]);

  /* keyboardAvoidingView={false}; si es =true provoca el efecto siguiente:
     el usuario hace tap sobre el input de búsqueda
     el teclado se abre, y luego de unos pocos ms.
     el teclado se cierra automaticamente
  */
  return (
    <ModalView
      keyboardAvoidingView={false}
      left={
        <Text
          bold
          fontSize="md"
          mt="2"
          ml="4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {I18n.t('screen_title.find song')}
        </Text>
      }>
      <TabView
        lazy
        renderLazyPlaceholder={() => {
          return (
            <Center pt="5">
              <Spinner color="rose.500" size="lg" />
              <Text>{I18n.t('ui.loading')}</Text>
            </Center>
          );
        }}
        renderTabBar={(p: any) => {
          return (
            <TabBar
              {...p}
              scrollEnabled
              tabStyle={{ width: 'auto' }}
              style={{ backgroundColor: 'white' }}
              indicatorStyle={{
                backgroundColor: colors.rose['500'],
                marginHorizontal: 3,
              }}
              renderLabel={({ route: currentRoute, focused, color }) => (
                <Text
                  style={{
                    color: focused ? colors.rose['500'] : colors.gray['600'],
                    margin: 3,
                  }}>
                  {currentRoute.title}
                </Text>
              )}
            />
          );
        }}
        navigationState={{ index: activeTab, routes }}
        renderScene={renderScene}
        onIndexChange={setActiveTab}
        initialLayout={{ width: layout.width }}
      />
    </ModalView>
  );
};

export default SongChooserDialog;
