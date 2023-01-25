import * as React from 'react';
import { useEffect, useState } from 'react';
import { Image, Linking, Alert } from 'react-native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import {
  Button,
  HStack,
  Text,
  Icon,
  VStack,
  Select,
  Box,
  ScrollView,
  Heading,
  Switch,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import i18n from '@iresucito/translations';
import { getLocalesForPicker, CollaboratorsIndex } from '@iresucito/core';
import { useData } from '../DataContext';
import { getDefaultLocale } from '../util';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';

const pack = require('../app.json');
const cristo = require('../img/cristo.jpg');
const appName = pack.displayName;

type SettingsNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  'SettingsScreen'
>;

const SettingsScreen = () => {
  const data = useData();
  const navigation = useNavigation<SettingsNavigationProp>();
  const [locale, setLocale] = data.locale;
  const [keepAwake, setKeepAwake] = data.keepAwake;
  const [version, setVersion] = useState('');
  const [songsResume, setSongsResume] = useState('-');
  const { songs, settingsFileExists, clearSongSettings } = data.songsMeta;

  useAndroidBackHandler(() => {
    return true;
  });

  useEffect(() => {
    setVersion(DeviceInfo.getReadableVersion());
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
            clearSongSettings();
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

  var localesItems = getLocalesForPicker(getDefaultLocale()).map((l) => {
    return <Select.Item p={2} key={l.value} label={l.label} value={l.value} />;
  });

  return (
    <ScrollView>
      <VStack space={2} p="3">
        <Text>{i18n.t('settings_title.locale')}</Text>
        <Text fontSize="sm" color="muted.500">
          {i18n.t('settings_note.locale')}
        </Text>
        <Select
          selectedValue={locale}
          onValueChange={(val) => {
            // IMPORTANTE!
            // Workaround de problema en Android
            // https://github.com/facebook/react-native/issues/15556
            setTimeout(() => {
              setLocale(val);
              // Para forzar refresco del titulo segun idioma nuevo
              navigation.setParams({ title: '' });
            }, 10);
          }}>
          {localesItems}
        </Select>
        <HStack space={2} p="3" justifyContent="center" alignItems="center">
          <Icon as={Ionicons} name="podium-outline" size="md" />
          <Text fontSize="sm" color="muted.500">
            {songsResume}
          </Text>
        </HStack>
      </VStack>
      <HStack
        space={2}
        p="3"
        justifyContent="space-between"
        alignItems="center">
        <VStack w="80%" space={2}>
          <Text>{i18n.t('settings_title.keep awake')}</Text>
          <Text fontSize="sm" color="muted.500">
            {i18n.t('settings_note.keep awake')}
          </Text>
        </VStack>
        <Switch width="20%" value={keepAwake} onValueChange={setKeepAwake} />
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
          color="rose.500"
          mt="10"
          style={{
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}>
          {appName}
        </Heading>
        <Text textAlign="center" fontSize="md" mt="5">
          <Text bold>
            {i18n.t('ui.version')}: {version}
          </Text>
          {'\n'} Javier Castro, 2017-2023
        </Text>
        <Text textAlign="center" fontSize="sm" mt="10">
          <Text bold>{i18n.t('ui.collaborators')}</Text>
          {Object.keys(CollaboratorsIndex).map((lang) => {
            return `\n ${CollaboratorsIndex[lang].join(', ')} (${lang})`;
          })}
        </Text>
        <HStack my="5">
          <Button m="5" bg="rose.500" borderRadius={32} onPress={sendMail}>
            <Icon as={Ionicons} name="mail" color="white" />
          </Button>
          <Button m="5" bg="rose.500" borderRadius={32} onPress={sendTwitter}>
            <Icon as={Ionicons} name="logo-twitter" color="white" />
          </Button>
        </HStack>
        <Text fontSize="sm" textAlign="center">
          {i18n.t('ui.contribute message')}
        </Text>
        <Button
          my="8"
          size="sm"
          variant="ghost"
          startIcon={<Icon as={Ionicons} name="browsers-outline" />}
          onPress={goEditor}>
          {i18n.t('ui.contribute button')}
        </Button>
        {settingsFileExists && (
          <Button
            my="8"
            colorScheme="rose"
            _text={{ color: 'white' }}
            borderRadius={32}
            onPress={clearSettings}>
            {i18n.t('ui.clear song settings')}
          </Button>
        )}
      </Box>
    </ScrollView>
  );
};

export default SettingsScreen;
