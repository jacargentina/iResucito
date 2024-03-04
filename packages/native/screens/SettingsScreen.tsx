import { useEffect, useRef, useState } from 'react';
import { Image, Linking, Alert, ScrollView } from 'react-native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import {
  Button,
  HStack,
  Text,
  Icon,
  VStack,
  Select,
  SelectItem,
  SelectTrigger,
  SelectIcon,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  Box,
  Heading,
  Switch,
  useMedia,
  ButtonText,
} from '@gluestack-ui/themed';
import { useScrollToTop } from '@react-navigation/native';
import * as Application from 'expo-application';
import i18n from '@iresucito/translations';
import { getLocalesForPicker, CollaboratorsIndex } from '@iresucito/core';
import { useSettingsStore, useSongsStore } from '../hooks';
import { NativeExtras, getDefaultLocale } from '../util';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation';
import {
  ChevronDownIcon,
  ChromeIcon,
  LineChart,
  MailIcon,
  Twitter,
} from 'lucide-react-native';

const pack = require('../app.json');
const cristo = require('../img/cristo.jpg');
const appName = pack.expo.name;

export type SettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'SettingsScreen'
>;

export const SettingsScreen = () => {
  const media = useMedia();
  const { locale, keepAwake, ratingsEnabled } = useSettingsStore();
  const [version, setVersion] = useState('');
  const [songsResume, setSongsResume] = useState('-');
  const { songs } = useSongsStore();
  const [settingsExists, setSettingsExists] = useState(false);

  useAndroidBackHandler(() => {
    return true;
  });

  useEffect(() => {
    const load = async () => {
      setVersion(Application.nativeApplicationVersion as string);
      setSettingsExists(await NativeExtras.settingsExists());
    };
    load();
  }, []);

  useEffect(() => {
    if (songs) {
      var withLocale = songs.filter((s) => s.notTranslated === false);
      const message = i18n.t('ui.translated songs', {
        translated: withLocale.length,
        total: songs.length,
      });
      setSongsResume(message);
    }
  }, [songs]);

  const sendMail = () => {
    Linking.openURL(
      `mailto:javier.alejandro.castro@gmail.com?subject=iResucitó ${version}`
    ).catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  const sendTwitter = () => {
    Linking.openURL('https://www.twitter.com/javi_ale_castro').catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  const goEditor = () => {
    Linking.openURL('https://iresucito.vercel.app').catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  const clearSettings = () => {
    Alert.alert(
      i18n.t('ui.clear song settings'),
      i18n.t('ui.clear song settings confirmation'),
      [
        {
          text: i18n.t('ui.delete'),
          onPress: () => {
            NativeExtras.deleteSettings();
          },
          style: 'destructive',
        },
        {
          text: i18n.t('ui.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  var locales = getLocalesForPicker(getDefaultLocale());

  var localesItems = locales.map((l) => {
    return (
      <SelectItem
        p="$2"
        key={l.value}
        label={l.label}
        value={l.value}
        sx={{
          _text: media.md ? { fontSize: 20, lineHeight: 30 } : undefined,
        }}
      />
    );
  });

  var currentLocale = locales.find((l) => l.value == locale);

  const ref = useRef(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      <VStack space="sm" p={media.md ? '$6' : '$3'}>
        <Text fontSize={media.md ? '$2xl' : undefined}>
          {i18n.t('settings_title.locale')}
        </Text>
        <Text
          fontSize={media.md ? '$xl' : '$sm'}
          color="$backgroundDark500"
          mb="$2">
          {i18n.t('settings_note.locale')}
        </Text>
        <Select
          testID="locale-input"
          selectedValue={locale}
          selectedLabel={currentLocale?.label}
          onValueChange={(val) => {
            useSettingsStore.setState({ locale: val });
          }}>
          <SelectTrigger w="100%" size={media.md ? 'xl' : undefined}>
            <SelectInput />
            {/* @ts-ignore */}
            <SelectIcon mr="$2">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent pb="$8">
              <SelectDragIndicatorWrapper>
                <Select.DragIndicator />
              </SelectDragIndicatorWrapper>
              {localesItems}
            </SelectContent>
          </SelectPortal>
        </Select>
        <HStack space="sm" p="$3" justifyContent="center" alignItems="center">
          <Icon as={LineChart} size={media.md ? 'xl' : 'md'} />
          <Text fontSize={media.md ? '$xl' : '$sm'} color="$backgroundDark500">
            {songsResume}
          </Text>
        </HStack>
      </VStack>
      <HStack
        space="sm"
        p={media.md ? '$6' : '$3'}
        justifyContent="space-between"
        alignItems="center">
        <VStack w="80%" space="sm">
          <Text fontSize={media.md ? '$2xl' : undefined}>
            {i18n.t('settings_title.keep awake')}
          </Text>
          <Text fontSize={media.md ? '$xl' : '$sm'} color="$backgroundDark500">
            {i18n.t('settings_note.keep awake')}
          </Text>
        </VStack>
        <Switch
          size={media.md ? 'lg' : undefined}
          value={keepAwake}
          onValueChange={(val: boolean) =>
            useSettingsStore.setState({ keepAwake: val })
          }
        />
      </HStack>
      <HStack
        space="sm"
        p={media.md ? '$6' : '$3'}
        justifyContent="space-between"
        alignItems="center">
        <VStack w="80%" space="sm">
          <Text fontSize={media.md ? '$2xl' : undefined}>
            {i18n.t('settings_title.ratings enabled')}
          </Text>
          <Text fontSize={media.md ? '$xl' : '$sm'} color="$backgroundDark500">
            {i18n.t('settings_note.ratings enabled')}
          </Text>
        </VStack>
        <Switch
          size={media.md ? 'lg' : undefined}
          value={ratingsEnabled}
          onValueChange={(val: boolean) =>
            useSettingsStore.setState({ ratingsEnabled: val })
          }
        />
      </HStack>
      <Box
        flex={1}
        bg="white"
        alignItems="center"
        justifyContent="space-around">
        <Image
          source={cristo}
          style={{
            height: media.md ? 360 : 190,
            marginTop: 40,
          }}
          resizeMode="contain"
        />
        <Heading
          color="$rose500"
          mt="$10"
          fontSize={media.md ? 34 : undefined}
          fontWeight="bold"
          fontStyle="italic">
          {appName}
        </Heading>
        <Text textAlign="center" fontSize={media.md ? '$xl' : '$md'} mt="$5">
          <Text fontWeight="bold" fontSize={media.md ? '$xl' : '$md'}>
            {i18n.t('ui.version')}: {version}
          </Text>
          {'\n'} Javier Castro, 2017-2023
        </Text>
        <Text textAlign="center" fontSize={media.md ? '$md' : '$sm'} mt="$10">
          <Text fontWeight="bold" fontSize={media.md ? '$md' : '$sm'}>
            {i18n.t('ui.collaborators')}
          </Text>
          {Object.keys(CollaboratorsIndex).map((lang) => {
            return `\n ${CollaboratorsIndex[lang].join(', ')} (${lang})`;
          })}
        </Text>
        <HStack my="$5">
          <Button m="$5" bg="$rose500" borderRadius={32} onPress={sendMail}>
            <Icon
              as={MailIcon}
              color="white"
              size={media.md ? 'xl' : undefined}
            />
          </Button>
          <Button m="$5" bg="$rose500" borderRadius={32} onPress={sendTwitter}>
            <Icon
              as={Twitter}
              color="white"
              size={media.md ? 'xl' : undefined}
            />
          </Button>
        </HStack>
        <Text fontSize={media.md ? '$xl' : '$sm'} textAlign="center">
          {i18n.t('ui.contribute message')}
        </Text>
        <Button my="$8" size={media.md ? 'xl' : 'sm'} onPress={goEditor}>
          <Icon as={ChromeIcon} color="white" mr="$2" />
          <ButtonText>{i18n.t('ui.contribute button')}</ButtonText>
        </Button>
        {settingsExists && (
          <Button
            my="$8"
            bg="$rose500"
            borderRadius={32}
            size={media.md ? 'xl' : 'sm'}
            onPress={clearSettings}>
            <ButtonText color="white">
              {i18n.t('ui.clear song settings')}
            </ButtonText>
          </Button>
        )}
      </Box>
    </ScrollView>
  );
};
