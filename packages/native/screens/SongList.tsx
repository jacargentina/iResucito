
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useNavigation,
  useRoute,
  useIsFocused,
  useFocusEffect,
  RouteProp,
} from '@react-navigation/native';
import { Keyboard, View } from 'react-native';
import { Text, Spinner, HStack } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import {
  HeaderButton,
  SearchBarView,
  ChoosePdfTypeForExport,
} from '../components';
import i18n from '@iresucito/translations';
import {
  setSongSetting,
  useSettingsStore,
  useSongsSelection,
  useSongsStore,
} from '../hooks';
import { SongListItem } from './SongListItem';
import { SongsStackParamList } from '../navigation';
import {
  ExportToPdfOptions,
  Song,
  SongToPdf,
  defaultExportToPdfOptions,
} from '@iresucito/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import { useAndroidBackHandler } from 'react-navigation-backhandler';

type SongListRouteProp = RouteProp<SongsStackParamList, 'SongList'>;

type SongDetailNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongDetail'
>;

type IsLoading = { isLoading: boolean; text: string };

export const SongList = (props: {
  viewButton?: boolean;
  filter?: any;
  sort?: any;
  onPress?: any;
}) => {
  const listRef = useRef<any>();
  const { songs } = useSongsStore();
  const { computedLocale } = useSettingsStore();
  const { selection, enabled, disable } = useSongsSelection();
  const navigation = useNavigation<SongDetailNavigationProp>();
  const route = useRoute<SongListRouteProp>();
  const isFocused = useIsFocused();
  const { viewButton } = props;
  const [totalText, setTotalText] = useState(i18n.t('ui.loading'));
  const [loading, setLoading] = useState<IsLoading>({
    isLoading: false,
    text: '',
  });
  const [showSalmosBadge, setShowSalmosBadge] = useState<boolean>();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState<Song[]>([]);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);

  useAndroidBackHandler(() => {
    if (enabled) disable();
    navigation.goBack();
    return true;
  });

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (enabled) disable();
      };
    }, [enabled])
  );

  useEffect(() => {
    if (songs) {
      const navFilter = route?.params?.filter ?? props.filter;
      var result = songs;
      if (navFilter) {
        for (var name in navFilter) {
          result = result.filter((s) => s[name] === navFilter[name]);
        }
      }
      if (textFilter) {
        result = result.filter((s) => {
          return (
            s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
            s.fullText.toLowerCase().includes(textFilter.toLowerCase())
          );
        });
      }
      const navSort = route?.params?.sort ?? props.sort;
      if (navSort) {
        result = result.sort(navSort);
      }
      setShowSalmosBadge(
        navFilter == null || !navFilter.hasOwnProperty('stage')
      );
      setSearch(result);
      if (result.length > 0) {
        setTotalText(i18n.t('ui.list total songs', { total: result.length }));
      } else {
        setTotalText(i18n.t('ui.no songs found'));
      }
    }
  }, [
    route?.params?.filter,
    props.filter,
    route?.params?.sort,
    props.sort,
    textFilter,
    songs,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HStack>
          {enabled && <HeaderButton iconName="XCircleIcon" onPress={disable} />}
          <HeaderButton
            iconName="FileTextIcon"
            onPress={async () => {
              if (enabled) {
                if (selection.length > 0) {
                  var items: Array<SongToPdf> = selection.map((key) => {
                    var s = songs.find((s) => s.key == key) as Song;
                    return {
                      song: s,
                      render: NativeParser.getForRender(
                        s.fullText,
                        i18n.locale
                      ),
                    };
                  });
                  setLoading({
                    isLoading: true,
                    text: i18n.t('ui.export.processing songs', {
                      total: items.length,
                    }),
                  });
                  const exportOpts: ExportToPdfOptions = {
                    ...defaultExportToPdfOptions,
                    disablePageNumbers: true,
                  };
                  const path = await generateSongPDF(
                    items,
                    exportOpts,
                    `iResucitó-songsSelection-${i18n.locale}`,
                    false
                  );
                  navigation.navigate('PDFViewer', {
                    uri: path,
                    title: i18n.t('pdf_export_options.selected songs'),
                  });
                  setLoading({ isLoading: false, text: '' });
                }
                disable();
              } else {
                setShowActionsheet(true);
              }
            }}
          />
        </HStack>
      ),
    });
  }, [navigation, setShowActionsheet, enabled, selection]);

  useEffect(() => {
    if (search.length > 0 && isFocused && textFilter && listRef.current) {
      listRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewOffset: 0,
        viewPosition: 1,
      });
    }
  }, [search, isFocused, textFilter]);

  const onPress = (song: Song) => {
    if (props.onPress) {
      props.onPress(song);
    } else {
      navigation.navigate('SongDetail', { song: song });
    }
  };

  if (loading.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
        <Spinner
          // @ts-ignore
          size="large"
        />
        <Text color="$backgroundDark500" style={{ textAlign: 'center' }}>
          {loading.text}
        </Text>
      </View>
    );
  }

  return (
    <SearchBarView
      value={textFilter}
      setValue={setTextFilter}
      placeholder={
        i18n.t('ui.search placeholder', { locale: computedLocale }) + '...'
      }>
      <ChoosePdfTypeForExport
        isOpen={showActionsheet}
        onClose={handleClose}
        setLoading={setLoading}
      />
      <Text fontWeight="bold" p="$2" px="$4" bg="$backgroundDark100" color="$textDark500">
        {totalText}
      </Text>
      <FlashList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search}
        estimatedItemSize={98}
        renderItem={({ item }) => {
          return (
            <SongListItem
              song={item}
              showBadge={showSalmosBadge}
              onPress={onPress}
              viewButton={viewButton || false}
              highlight={textFilter}
              setSongSetting={setSongSetting}
            />
          );
        }}
      />
    </SearchBarView>
  );
};
