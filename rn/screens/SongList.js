// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import { FlatList, Keyboard, Alert, View } from 'react-native';
import { Text, ListItem, Icon, ActionSheet, Spinner } from 'native-base';
import SearchBarView from './SearchBarView';
import SongListItem from './SongListItem';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import commonTheme from '../native-base-theme/variables/platform';
import { NativeParser } from '../util';
import { generatePDF } from '../pdf';
import { defaultExportToPdfOptions } from '../../common';

const SongList = (props: any) => {
  const listRef = useRef<?FlatList>();
  const data = useContext(DataContext);
  const { navigation, isFocused, viewButton } = props;
  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const { songs } = data.songsMeta;
  const [loading] = data.loading;
  const [showSalmosBadge, setShowSalmosBadge] = useState();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState();

  useEffect(() => {
    const navFilter = navigation.getParam('filter', props.filter);
    var result = songs;
    if (navFilter) {
      for (var name in navFilter) {
        result = result.filter(s => s[name] === navFilter[name]);
      }
    }
    if (textFilter) {
      result = result.filter(s => {
        return (
          s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
          s.fullText.toLowerCase().includes(textFilter.toLowerCase())
        );
      });
    }
    const navSort = navigation.getParam('sort', props.sort);
    if (navSort) {
      result = result.sort(navSort);
    }
    setShowSalmosBadge(navFilter == null || !navFilter.hasOwnProperty('stage'));
    setSearch(result);
    if (result.length > 0 && isFocused) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToIndex({
            index: 0,
            animated: true,
            viewOffset: 0,
            viewPosition: 1
          });
        }
      }, 50);
      setTotalText(I18n.t('ui.list total songs', { total: result.length }));
    } else {
      setTotalText(I18n.t('ui.no songs found'));
    }
  }, [textFilter, props.filter, I18n.locale]);

  useEffect(() => {
    navigation.setParams({ title: I18n.t(navigation.getParam('title_key')) });
  }, [I18n.locale]);

  const onPress = song => {
    if (props.onPress) {
      props.onPress(song);
    } else {
      navigation.navigate('SongDetail', { song: song });
    }
  };

  if (loading.isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Spinner color={commonTheme.brandPrimary} style={{ flex: 3 }} />
        <Text note style={{ flex: 1, textAlign: 'center' }}>
          {loading.text}
        </Text>
      </View>
    );
  }

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
      <ListItem itemDivider>
        <Text note>{totalText}</Text>
      </ListItem>
      <FlatList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search || []}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          return (
            <SongListItem
              key={item.nombre}
              showBadge={showSalmosBadge}
              songKey={item.key}
              onPress={onPress}
              viewButton={viewButton}
              highlight={textFilter}
              devModeDisabled={props.devModeDisabled}
            />
          );
        }}
      />
    </SearchBarView>
  );
};

const ClearRatings = () => {
  const data = useContext(DataContext);
  const { ratingsFileExists, clearSongsRatings } = data.songsMeta;

  if (!ratingsFileExists) {
    return null;
  }

  return (
    <Icon
      name="star-outline"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => {
        Alert.alert(
          `${I18n.t('ui.clear ratings')}`,
          I18n.t('ui.clear ratings confirmation'),
          [
            {
              text: I18n.t('ui.yes'),
              onPress: () => {
                clearSongsRatings();
              },
              style: 'destructive'
            },
            {
              text: I18n.t('ui.cancel'),
              style: 'cancel'
            }
          ]
        );
      }}
    />
  );
};

const ExportToPdf = withNavigation(props => {
  const data = useContext(DataContext);
  const { songs } = data.songsMeta;
  const [, setLoading] = data.loading;
  const { navigation } = props;

  const chooseExport = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('pdf_export_options.selected songs'),
          I18n.t('pdf_export_options.complete book'),
          I18n.t('ui.cancel')
        ],
        cancelButtonIndex: 2,
        title: I18n.t('ui.export.type')
      },
      index => {
        index = Number(index);
        switch (index) {
          case 0:
            Alert.alert('TODO', 'TBD');
            break;
          case 1:
            const localeNoCountry = I18n.locale.split('-')[0];
            const songToExport = songs.filter(
              s =>
                s.files.hasOwnProperty(I18n.locale) ||
                s.files.hasOwnProperty(localeNoCountry)
            );
            var items: Array<SongToPdf> = songToExport.map(s => {
              return {
                song: s,
                render: NativeParser.getForRender(s.fullText, I18n.locale)
              };
            });
            setLoading({
              isLoading: true,
              text: I18n.t('ui.export.processing songs', {
                total: songToExport.length
              })
            });
            generatePDF(
              items,
              defaultExportToPdfOptions,
              `-${I18n.locale}`
            ).then(path => {
              navigation.navigate('PDFViewer', {
                uri: path,
                title: I18n.t('ui.export.pdf viewer title')
              });
              setLoading({ isLoading: false, text: '' });
            });
            break;
        }
      }
    );
  };

  return (
    <Icon
      name="paper"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={chooseExport}
    />
  );
});

SongList.navigationOptions = (props: any) => {
  return {
    title: I18n.t(props.navigation.getParam('title_key')),
    headerBackTitle: I18n.t('ui.back'),
    headerTruncatedBackTitle: I18n.t('ui.back'),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ExportToPdf />
        <ClearRatings />
      </View>
    )
  };
};

export default withNavigationFocus(withNavigation(SongList));
