import * as React from 'react';
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
  Box,
  Heading,
  Switch,
} from '../gluestack';
import { useScrollToTop } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
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
const appName = pack.displayName;

export type SettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'SettingsScreen'
>;

export const SettingsScreen = () => {
  const { locale, keepAwake } = useSettingsStore();
  const [version, setVersion] = useState('');
  const [songsResume, setSongsResume] = useState('-');
  const { songs } = useSongsStore();
  const [settingsExists, setSettingsExists] = useState(false);

  useAndroidBackHandler(() => {
    return true;
  });

  useEffect(() => {
    const load = async () => {
      setVersion(DeviceInfo.getReadableVersion());
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
    return <Select.Item p="$2" key={l.value} label={l.label} value={l.value} />;
  });

  var currentLocale = locales.find((l) => l.value == locale);

  const ref = useRef(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      <VStack space="sm" p="$3">
        <Text>{i18n.t('settings_title.locale')}</Text>
        <Text fontSize="$sm" color="$muted500" mb="$2">
          {i18n.t('settings_note.locale')}
        </Text>
        <Select
          testID="locale-input"
          selectedValue={locale}
          selectedLabel={currentLocale?.label}
          onValueChange={(val) => {
            useSettingsStore.setState({ locale: val });
          }}>
          <Select.Trigger w="100%">
            <Select.Input />
            <Select.Icon mr="$2">
              <Icon as={ChevronDownIcon} />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Backdrop />
            <Select.Content pb="$8">
              <Select.DragIndicatorWrapper>
                <Select.DragIndicator />
              </Select.DragIndicatorWrapper>
              {localesItems}
            </Select.Content>
          </Select.Portal>
        </Select>
        <HStack space="sm" p="$3" justifyContent="center" alignItems="center">
          <Icon as={LineChart} size="md" />
          <Text fontSize="$sm" color="$muted500">
            {songsResume}
          </Text>
        </HStack>
      </VStack>
      <HStack
        space="sm"
        p="$3"
        justifyContent="space-between"
        alignItems="center">
        <VStack w="80%" space="$2">
          <Text>{i18n.t('settings_title.keep awake')}</Text>
          <Text fontSize="$sm" color="$muted500">
            {i18n.t('settings_note.keep awake')}
          </Text>
        </VStack>
        <Switch
          value={keepAwake}
          onValueChange={(val: boolean) =>
            useSettingsStore.setState({ keepAwake: val })
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
            height: 190,
            marginTop: 40,
          }}
          resizeMode="contain"
        />
        <Heading
          color="$rose500"
          mt="$10"
          style={{
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}>
          {appName}
        </Heading>
        <Text textAlign="center" fontSize="$md" mt="$5">
          <Text fontWeight="bold">
            {i18n.t('ui.version')}: {version}
          </Text>
          {'\n'} Javier Castro, 2017-2023
        </Text>
        <Text textAlign="center" fontSize="$sm" mt="$10">
          <Text fontWeight="bold">{i18n.t('ui.collaborators')}</Text>
          {Object.keys(CollaboratorsIndex).map((lang) => {
            return `\n ${CollaboratorsIndex[lang].join(', ')} (${lang})`;
          })}
        </Text>
        <HStack my="$5">
          <Button m="$5" bg="$rose500" borderRadius={32} onPress={sendMail}>
            <Icon as={MailIcon} color="white" />
          </Button>
          <Button m="$5" bg="$rose500" borderRadius={32} onPress={sendTwitter}>
            <Icon as={Twitter} color="white" />
          </Button>
        </HStack>
        <Text fontSize="$sm" textAlign="center">
          {i18n.t('ui.contribute message')}
        </Text>
        <Button my="$8" size="sm" onPress={goEditor}>
          <Icon as={ChromeIcon} color="white" mr="$2" />
          <Button.Text>{i18n.t('ui.contribute button')}</Button.Text>
        </Button>
        {settingsExists && (
          <Button
            my="$8"
            bg="$rose500"
            borderRadius={32}
            onPress={clearSettings}>
            <Button.Text color="white">
              {i18n.t('ui.clear song settings')}
            </Button.Text>
          </Button>
        )}
      </Box>
    </ScrollView>
  );
};
