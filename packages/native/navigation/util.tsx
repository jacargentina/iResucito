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
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@iresucito/translations';
import { Song, cleanMultichord, getChordsScale } from '@iresucito/core';
import { setSongSetting } from '../hooks';
import {
  ViewPdfButton,
  PrintPDFButton,
  SharePDFButton,
  HeaderButton,
} from '../components';
import { SongsStackParamList } from './index';
import { config } from '../config/gluestack-ui.config';

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
