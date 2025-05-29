import { HStack, useMedia } from '@gluestack-ui/themed';
import {
  Menu,
  MenuOptions,
  MenuOption,
  withMenuContext,
  MenuContextProps,
  MenuTrigger,
  MenuOptionCustomStyle,
} from 'react-native-popup-menu';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import i18n from '@iresucito/translations';
import { Song, cleanMultichord, getChordsScale } from '@iresucito/core';
import { setSongSetting, sharePDF, useSongAudio } from '../hooks';
import { config } from '../config/gluestack-ui.config';
import { useColorScheme, GestureResponderEvent } from 'react-native';
import { SongsStackParamList } from './SongsNavigator';
import { Button, ButtonIcon, ButtonText } from '@gluestack-ui/themed';
import * as icons from 'lucide-react-native';
import { PdfStyles, SongsParser } from '@iresucito/core';
import { generateSongPDF } from '../pdf';
import { ListsStackParamList } from '../navigation/ListsNavigator';
import * as Print from 'expo-print';

type SongDetailRouteProp = RouteProp<SongsStackParamList, 'SongDetail'>;

type SongDetailScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongDetail'
>;

type T = React.ComponentType<Omit<MenuContextProps, 'ctx'>>;

export const TransportNotesButton: T = withMenuContext(
  (props: MenuContextProps) => {
    const media = useMedia();
    const navigation = useNavigation<SongDetailScreenNavigationProp>();
    const route = useRoute<SongDetailRouteProp>();
    const { ctx } = props;
    const { song } = route.params;

    if (!song) {
      return null;
    }

    const chords = getChordsScale(i18n.locale);

    var menuOptionItems = chords.map((nota, i) => {
      var value = cleanMultichord(nota.source);
      var customStyles: MenuOptionCustomStyle | undefined =
        value == song.transportTo
          ? {
              optionWrapper: {
                backgroundColor: config.tokens.colors.rose400,
                paddingHorizontal: 10,
                paddingVertical: 10,
              },
              optionText: {
                color: 'white',
                fontSize: media.md ? 22 : undefined,
                fontWeight: 'bold',
              },
            }
          : {
              optionText: {
                fontSize: media.md ? 22 : undefined,
              },
            };
      return (
        <MenuOption
          key={i}
          value={value}
          text={value}
          customStyles={customStyles}
        />
      );
    });

    const changeTransport = async (newTransport: any) => {
      var updatedSong = await setSongSetting(
        song.key,
        i18n.locale,
        'transportTo',
        newTransport
      );
      navigation.replace('SongDetail', {
        song: updatedSong,
      });
    };

    const menuName = `menu-${song.key}-${song.transportTo}`;

    const showIcon =
      song.transportTo === null ||
      song.transportTo === undefined ||
      song.transportTo === '';

    return (
      <Menu name={menuName} onSelect={(value) => changeTransport(value)}>
        <HeaderButton
          iconName={showIcon ? 'MusicIcon' : undefined}
          text={song.transportTo}
          textStyle={{
            fontWeight: 'bold',
            lineHeight: media.md ? '$2xl' : '$lg',
            fontSize: media.md ? '$2xl' : '$lg',
          }}
          onPress={() => ctx.menuActions.openMenu(menuName)}
        />
        <MenuTrigger />
        <MenuOptions
          customStyles={{
            optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 },
          }}>
          {song.transportTo != null && (
            <MenuOption
              value={null}
              text="Original"
              customStyles={{
                optionText: {
                  fontSize: media.md ? 22 : undefined,
                },
              }}
            />
          )}
          {menuOptionItems}
        </MenuOptions>
      </Menu>
    );
  }
);

export const getSongDetailOptions = (song: Song) => {
  return {
    title: song ? song.titulo : 'Salmo',
    headerRight: () => (
      <HStack>
        <PlaySongButton />
        <ViewPdfButton />
        <TransportNotesButton />
      </HStack>
    ),
  };
};

export const getPdfViewerOptions = (title: string) => {
  return {
    title: `PDF - ${title}`,
    headerRight: () => (
      <HStack>
        <SharePDFButton />
        <PrintPDFButton />
      </HStack>
    ),
  };
};

export const useStackNavOptions = () => {
  const media = useMedia();
  const scheme = useColorScheme();
  let options: StackNavigationOptions = {
    cardStyle: {
      backgroundColor:
        scheme == 'dark' ? config.tokens.colors.backgroundDark900 : 'white',
    },
    headerStyle: {
      backgroundColor:
        scheme == 'dark'
          ? config.tokens.colors.primary900
          : config.tokens.colors.primary500,
    },
    headerTitleStyle: {
      color: 'white',
      fontSize: media.md ? 26 : 18,
      lineHeight: media.md ? 28 : 22,
    },
    headerBackTitleStyle: {
      color: 'white',
      fontSize: media.md ? 24 : 16,
      lineHeight: media.md ? 26 : 20,
    },
    headerTintColor: 'white',
    headerBackTitle: i18n.t('ui.back'),
    headerBackTestID: 'back-button',
    headerBackTruncatedTitle: i18n.t('ui.back'),
  };
  return options;
};

export const HeaderButton = (props: {
  testID?: string;
  iconName?: string;
  text?: string;
  textStyle?: any;
  onPress?: (e: GestureResponderEvent) => void;
}) => {
  const media = useMedia();
  const options = useStackNavOptions();
  const { testID, iconName, text, textStyle, onPress } = props;
  if (iconName && !icons[iconName]) {
    throw Error('No hay icono con nombre ' + iconName);
  }
  return (
    <Button
      testID={testID}
      onPress={onPress}
      borderWidth={0}
      px="$2"
      // @ts-ignore
      bgColor={options.headerStyle.backgroundColor}>
      {iconName ? (
        <ButtonIcon
          as={icons[iconName]}
          // @ts-ignore
          size={media.md ? 30 : undefined}
          // @ts-ignore
          color={options.headerTitleStyle.color}
        />
      ) : (
        <ButtonText {...textStyle}>{text}</ButtonText>
      )}
    </Button>
  );
};

type SongDetailRouteProp1 = RouteProp<SongsStackParamList, 'SongDetail'>;
type SongDetailRouteProp2 = RouteProp<ListsStackParamList, 'SongDetail'>;

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

export const ViewPdfButton = () => {
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const route = useRoute<SongDetailRouteProp1 | SongDetailRouteProp2>();
  const { song } = route.params;
  if (!song) {
    return null;
  }

  return (
    <HeaderButton
      testID="view-pdf-button"
      iconName="FileTextIcon"
      onPress={async () => {
        const { fullText } = song;
        const parser = new SongsParser(PdfStyles);
        const render = parser.getForRender(
          fullText,
          i18n.locale,
          song.transportTo
        );
        const result = await generateSongPDF(
          [
            {
              song,
              render,
            },
          ],
          {
            ...PdfStyles,
            disablePageNumbers: true,
          },
          song.titulo,
          false
        );
        navigation.navigate('PDFViewer', {
          data: result,
          title: song.titulo,
        });
      }}
    />
  );
};

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const PrintPDFButton = () => {
  const route = useRoute<PDFViewerRouteProp>();
  const { data } = route.params;
  return (
    <HeaderButton
      iconName="PrinterIcon"
      onPress={async () => {
        await Print.printAsync({
          uri: `data:application/pdf;base64,${data.base64}`,
        });
      }}
    />
  );
};

export const SharePDFButton = () => {
  const route = useRoute<PDFViewerRouteProp>();
  const { title, data } = route.params;
  return (
    <HeaderButton
      iconName="ShareIcon"
      onPress={() => sharePDF(title, data.uri)}
    />
  );
};

export const PlaySongButton = () => {
  const route = useRoute<SongDetailRouteProp1 | SongDetailRouteProp2>();
  const { song } = route.params;
  const { playAudio } = useSongAudio();
  if (!song) {
    return null;
  }

  return (
    <HeaderButton
      testID="play-song-button"
      iconName="PlayIcon"
      onPress={() => {
        playAudio(song);
      }}
    />
  );
};
