//import { useWhatChanged } from '@simbathesailor/use-what-changed';
import { Alert } from 'react-native';
import { launchArguments } from 'expo-launch-arguments';
import * as Sharing from 'expo-sharing';
import * as Contacts from 'expo-contacts';
import * as FileSystem from 'expo-file-system';
import pathParse from 'path-parse';
import {
  getLocalizedListType,
  SongSettingsFile,
  Song,
  SearchItem,
  ListType,
  ShareListType,
  ListToPdf,
  Lists,
  ListForUI,
  LibreListForUI,
  PalabraListForUI,
  EucaristiaListForUI,
  LibreList,
  EucaristiaList,
  PalabraList,
  getListTitleValue,
  ListTitleValue,
  SongsProcessor,
  SongsSourceData,
  PdfStyles,
} from '@iresucito/core';
import i18n from '@iresucito/translations';
import {
  AlphaBadge,
  CatechumenateBadge,
  ElectionBadge,
  LiturgyBadge,
  PrecatechumenateBadge,
} from './badges';
import { GeneratePDFResult, generateListPDF } from './pdf';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { getDefaultLocale, ordenClasificacion, NativeExtras } from './util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

setAudioModeAsync({
  interruptionMode: 'doNotMix',
  interruptionModeAndroid: 'doNotMix',
  playsInSilentMode: true,
  shouldPlayInBackground: true,
});

const readSongSettingsFile = async (): Promise<
  SongSettingsFile | undefined
> => {
  if ((await NativeExtras.settingsExists()) === false) {
    return Promise.resolve(undefined);
  }
  const json = await NativeExtras.readSettings();
  try {
    return JSON.parse(json);
  } catch {
    // si el archivo está corrupto, eliminarlo
    await NativeExtras.deleteSettings();
  }
};

type SongsStore = {
  songs: Song[];
  load: (locale: string) => Promise<Song[]>;
};

const allLocales: SongsSourceData = {
  es: require('@iresucito/core/assets/songs/es.json'),
  en: require('@iresucito/core/assets/songs/en.json'),
  it: require('@iresucito/core/assets/songs/it.json'),
  'de-AT': require('@iresucito/core/assets/songs/de-AT.json'),
  de: require('@iresucito/core/assets/songs/de.json'),
  fr: require('@iresucito/core/assets/songs/fr.json'),
  'lt-LT': require('@iresucito/core/assets/songs/lt-LT.json'),
  pl: require('@iresucito/core/assets/songs/pl.json'),
  'pt-BR': require('@iresucito/core/assets/songs/pt-BR.json'),
  'pt-PT': require('@iresucito/core/assets/songs/pt-PT.json'),
  ru: require('@iresucito/core/assets/songs/ru.json'),
  'sw-TZ': require('@iresucito/core/assets/songs/sw-TZ.json'),
};

export const useSongsStore = create<SongsStore>((set) => ({
  songs: [],
  load: async (locale: string) => {
    try {
      var settingsObj = await readSongSettingsFile();
      var nativeSongs: SongsProcessor = new SongsProcessor(allLocales);
      // Construir metadatos de cantos
      var metaData = nativeSongs.getSongsMeta(locale, undefined, settingsObj);
      console.log(
        `songsStore loading ${metaData.length} songs for "${locale}"`
      );
      nativeSongs.loadSongs(locale, metaData);
      set((state) => ({ songs: metaData }));
      return metaData;
    } catch (err) {
      console.log('ERR', err);
      return [];
    }
  },
}));

export const setSongSetting = async (
  key: string,
  loc: string,
  setting: string,
  value: any
): Promise<Song> => {
  var settingsObj = await readSongSettingsFile();
  if (!settingsObj) {
    settingsObj = {};
  }
  if (!settingsObj[key]) {
    settingsObj[key] = {};
  }
  settingsObj[key] = Object.assign({}, settingsObj[key], {
    [loc]: { [setting]: value },
  });
  var json = JSON.stringify(settingsObj, null, ' ');
  await NativeExtras.saveSettings(json);
  var updated = await useSongsStore.getState().load(loc);
  return updated.find((song) => song.key == key) as Song;
};

type SelectionStore = {
  selection: string[];
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: (key: string) => void;
};

export const useSongsSelection = create(
  immer<SelectionStore>((set) => ({
    selection: [],
    enabled: false,
    enable: () => {
      set((state) => {
        state.selection = [];
        state.enabled = true;
      });
    },
    disable: () => {
      set((state) => {
        state.selection = [];
        state.enabled = false;
      });
    },
    toggle: (key: string) => {
      set((state) => {
        if (state.selection.indexOf(key) > -1) {
          state.selection.splice(state.selection.indexOf(key), 1);
        } else {
          state.selection.push(key);
        }
      });
    },
  }))
);

type SongPlayerStore = {
  player: AudioPlayer;
  song: Song | null;
  playingActive: boolean;
  playingTimeText: string | null;
  playingTimePercent: number | undefined;
  refreshIntervalId: any;
  refreshSongPosition: () => void;
  play: (song?: Song) => void;
  seek: (percent: number) => void;
  pause: () => void;
  stop: () => void;
};

import { es_audios } from '@iresucito/core';

function formatTime(rawSeconds) {
  const totalSeconds = Math.floor(rawSeconds); // quita milisegundos
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  // Asegura que los segundos siempre tengan dos dígitos
  const paddedSecs = secs.toString().padStart(2, '0');
  return `${mins}:${paddedSecs}`;
}

export const useSongPlayer = create(
  immer<SongPlayerStore>((set, get) => ({
    player: createAudioPlayer(null),
    song: null,
    playingActive: false,
    playingTimeText: null,
    playingTimePercent: undefined,
    refreshIntervalId: null,
    refreshSongPosition: () => {
      const player = get().player;
      if (player.currentStatus.didJustFinish) {
        get().stop();
      } else if (player.isLoaded) {
        set((state) => {
          const current = formatTime(player.currentTime);
          const total = formatTime(player.duration);
          state.playingTimeText = current + ' / ' + total;
          state.playingTimePercent = Math.round(
            (player.currentTime * 100) / player.duration
          );
        });
      }
    },
    play: (song?: Song) => {
      const player = get().player;
      if (song && get().song?.key !== song.key) {
        player.pause();
        player.replace(es_audios[song.key]);
        clearInterval(get().refreshIntervalId);
        set((state) => {
          state.playingTimeText = '-:-- / --:--';
          state.playingTimePercent = 0;
          state.song = song;
          state.refreshIntervalId = undefined;
        });
      }
      player.play();
      get().refreshSongPosition();
      set((state) => {
        state.refreshIntervalId = setInterval(get().refreshSongPosition, 1000);
        state.playingActive = true;
      });
    },
    seek: (percent: number) => {
      var player = get().player;
      var newPosition = (player.duration * percent) / 100;
      player.seekTo(newPosition);
      get().refreshSongPosition();
    },
    pause: () => {
      var player = get().player;
      if (player.playing) {
        player.pause();
        clearInterval(get().refreshIntervalId);
        set((state) => {
          state.playingActive = false;
        });
      }
    },
    stop: () => {
      var player = get().player;
      player.pause();
      player.seekTo(0);
      clearInterval(get().refreshIntervalId);
      set((state) => {
        state.song = null;
        state.playingActive = false;
        state.playingTimeText = null;
        state.playingTimePercent = undefined;
      });
    },
  }))
);

type ListsStore = {
  lists: Lists;
  lists_ui: ListForUI[];
  add: (listName: string, type: ListType) => void;
  rename: (listName: string, newName: string) => void;
  remove: (listName: string) => void;
  setList: (
    listName: string,
    listKey:
      | keyof LibreList
      | keyof EucaristiaList
      | keyof PalabraList
      | number,
    listValue: any,
    listKeyIndex?: number
  ) => void;
  importList: (listPath: string) => Promise<string | void>;
  shareList: (
    listName: string,
    type: ShareListType
  ) => Promise<string | GeneratePDFResult>;
  load_ui: () => void;
};

let initialLists = {};

if (launchArguments.FASTLANE_SNAPSHOT) {
  initialLists['El Buen Pastor'] = {
    type: 'eucaristia',
    ambiental: 'Javier',
    '1-monicion': 'Walter',
    '1': 'Hch 2,14a. 36-41',
    '1-salmo': '60', // El señor es mi pastor
    version: 1,
    entrada: '147', // Ven del libano
    '2-monicion': 'Armando',
    '2': 'Pe 2,20b-25',
    'evangelio-monicion': 'Pancho',
    evangelio: 'Jn 10,1-10',
    'oracion-universal': 'Pili',
    paz: '104',
    'comunion-pan': ['137'],
    'comunion-caliz': ['212'],
    salida: '157',
    'encargado-pan': 'Fernando',
    'encargado-flores': 'Juanita',
    nota: null,
  };
  initialLists['Agua'] = {
    type: 'palabra',
    '1-monicion': 'Juan José',
    '1': 'Ex 17, 6',
    '1-salmo': '63', // El pueblo que caminaba en las tinieblas
    version: 1,
    ambiental: null,
    entrada: null,
    '2-monicion': null,
    '2': null,
    '2-salmo': null,
    '3-monicion': null,
    '3': null,
    '3-salmo': null,
    'evangelio-monicion': null,
    evangelio: null,
    salida: null,
    nota: null,
  };
} else {
  console.log('sin datos de FASTLANE_SNAPSHOT');
}

export const useListsStore = create<ListsStore>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        lists: initialLists,
        lists_ui: [],
        add: (listName: string, type: ListType) => {
          set((state: ListsStore) => {
            switch (type) {
              case 'libre':
                state.lists[listName] = { type, version: 1, items: [] };
                break;
              case 'palabra':
                state.lists[listName] = {
                  type,
                  version: 1,
                  ambiental: null,
                  entrada: null,
                  '1-monicion': null,
                  '1': null,
                  '1-salmo': null,
                  '2-monicion': null,
                  '2': null,
                  '2-salmo': null,
                  '3-monicion': null,
                  '3': null,
                  '3-salmo': null,
                  'evangelio-monicion': null,
                  evangelio: null,
                  salida: null,
                  nota: null,
                };
                break;
              case 'eucaristia':
                state.lists[listName] = {
                  type,
                  version: 1,
                  ambiental: null,
                  entrada: null,
                  '1-monicion': null,
                  '1': null,
                  '2-monicion': null,
                  '2': null,
                  'evangelio-monicion': null,
                  evangelio: null,
                  'oracion-universal': null,
                  paz: null,
                  'comunion-pan': null,
                  'comunion-caliz': null,
                  salida: null,
                  'encargado-pan': null,
                  'encargado-flores': null,
                  nota: null,
                };
                break;
            }
          });
        },
        rename: (listName: string, newName: string) => {
          set((state: ListsStore) => {
            const list = state.lists[listName];
            delete state.lists[listName];
            state.lists[newName] = list;
          });
        },
        remove: (listName: string) => {
          set((state: ListsStore) => {
            delete state.lists[listName];
          });
        },
        setList: (
          listName: string,
          listKey:
            | keyof LibreList
            | keyof EucaristiaList
            | keyof PalabraList
            | number,
          listValue: any,
          listKeyIndex?: number
        ) => {
          set((state: ListsStore) => {
            const targetList = state.lists[listName];
            if (listValue !== undefined) {
              if (typeof listKey === 'string') {
                if (listKeyIndex !== undefined) {
                  if (!targetList[listKey]) {
                    targetList[listKey] = [];
                  }
                  var isPresent = targetList[listKey].find(
                    (s: any) => s === listValue
                  );
                  if (isPresent) {
                    return;
                  }
                  targetList[listKey][listKeyIndex] = listValue;
                } else {
                  targetList[listKey] = listValue;
                }
              } else if (typeof listKey === 'number' && 'items' in targetList) {
                var isPresent = targetList.items.find(
                  (s: any) => s === listValue
                );
                if (isPresent) {
                  return;
                }
                targetList.items[listKey] = listValue;
              }
            } else {
              if (typeof listKey === 'string') {
                if (listKeyIndex != undefined) {
                  targetList[listKey].splice(listKeyIndex, 1);
                  if (targetList[listKey].length == 0) {
                    targetList[listKey] = null;
                  }
                } else {
                  targetList[listKey] = undefined;
                }
              } else if (typeof listKey === 'number' && 'items' in targetList) {
                targetList.items.splice(listKey, 1);
              }
            }
          });
        },
        importList: async (listPath: string) => {
          const path = decodeURI(listPath);
          try {
            const content = await FileSystem.readAsStringAsync(path);
            // Obtener nombre del archivo
            // que será nombre de la lista
            const parsed = pathParse(listPath);
            var { name: listName } = parsed;
            // Generar nombre único para la lista
            var counter = 1;
            const lists = get().lists;
            while (lists.hasOwnProperty(listName)) {
              listName = `${listName} (${counter++})`;
            }
            const changedLists = Object.assign({}, lists, {
              [listName]: JSON.parse(content),
            });
            useListsStore.setState({ lists: changedLists });
            return listName;
          } catch (err) {
            console.log('importList: ' + (err as Error).message);
            Alert.alert(
              i18n.t('alert_title.corrupt file'),
              i18n.t('alert_message.corrupt file')
            );
          }
        },
        shareList: async (listName: string, format: ShareListType) => {
          switch (format) {
            case 'native':
              const fileName = listName.replace(' ', '-');
              const listPath = `${FileSystem.documentDirectory}${fileName}.ireslist`;
              const nativeList = get().lists[listName];
              await FileSystem.writeAsStringAsync(
                listPath,
                JSON.stringify(nativeList, null, ' ')
              );
              return listPath;
            case 'text':
              var list = get().lists_ui.find(
                (l) => l.name == listName
              ) as ListForUI;
              var items: (ListTitleValue | null)[] = [];
              if (list.type === 'libre') {
                var cantos = list.items;
                cantos.forEach((canto: Song, i: number) => {
                  items.push({ title: `${i + 1}`, value: [canto.titulo] });
                });
              } else {
                items.push(getListTitleValue(list, 'ambiental'));
                items.push(getListTitleValue(list, 'entrada'));
                items.push(getListTitleValue(list, '1-monicion'));
                items.push(getListTitleValue(list, '1'));
                items.push(getListTitleValue(list, '1-salmo'));
                items.push(getListTitleValue(list, '2-monicion'));
                items.push(getListTitleValue(list, '2'));
                items.push(getListTitleValue(list, '2-salmo'));
                items.push(getListTitleValue(list, '3-monicion'));
                items.push(getListTitleValue(list, '3'));
                items.push(getListTitleValue(list, '3-salmo'));
                items.push(getListTitleValue(list, 'evangelio-monicion'));
                items.push(getListTitleValue(list, 'evangelio'));
                items.push(getListTitleValue(list, 'oracion-universal'));
                items.push(getListTitleValue(list, 'paz'));
                items.push(getListTitleValue(list, 'comunion-pan'));
                items.push(getListTitleValue(list, 'comunion-caliz'));
                items.push(getListTitleValue(list, 'salida'));
                items.push(getListTitleValue(list, 'encargado-pan'));
                items.push(getListTitleValue(list, 'encargado-flores'));
                items.push(getListTitleValue(list, 'nota'));
              }
              var message = '';
              items.forEach((item) => {
                if (item != null) {
                  message += item.title + ': ' + item.value.join(', ') + '\n';
                }
              });
              const fileNameTxt = listName.replace(' ', '-');
              const listPathTxt = `${FileSystem.documentDirectory}${fileNameTxt}.txt`;
              await FileSystem.writeAsStringAsync(listPathTxt, message);
              return listPathTxt;
            case 'pdf':
              var list = get().lists_ui.find(
                (l) => l.name == listName
              ) as ListForUI;
              var listToPdf: ListToPdf = {
                ...list,
                localeType: getLocalizedListType(list.type, i18n.locale),
              };
              return await generateListPDF(listToPdf, PdfStyles);
          }
        },
        load_ui: () => {
          set((state: ListsStore) => {
            var { songs } = useSongsStore.getState();
            state.lists_ui = Object.keys(state.lists).map((listName) => {
              var datalist = state.lists[listName];
              switch (datalist.type) {
                case 'libre':
                  var l = datalist as LibreList;
                  var libre: LibreListForUI = {
                    name: listName,
                    version: datalist.version,
                    type: datalist.type,
                    localeType: getLocalizedListType(
                      datalist.type,
                      i18n.locale
                    ),
                    items: l.items.map((key) => {
                      return songs?.find((s) => s.key === key) as Song;
                    }),
                  };
                  return libre;
                case 'palabra':
                  var p = datalist as PalabraList;
                  var palabra: PalabraListForUI = {
                    name: listName,
                    version: datalist.version,
                    type: datalist.type,
                    localeType: getLocalizedListType(
                      datalist.type,
                      i18n.locale
                    ),
                    ambiental: datalist.ambiental,
                    entrada:
                      datalist.entrada != null
                        ? (songs?.find((s) => s.key === p.entrada) as Song)
                        : null,
                    '1-monicion': datalist['1-monicion'],
                    '1': datalist['1'],
                    '1-salmo':
                      datalist['1-salmo'] != null
                        ? (songs?.find((s) => s.key === p['1-salmo']) as Song)
                        : null,
                    '2-monicion': datalist['2-monicion'],
                    '2': datalist['2'],
                    '2-salmo':
                      datalist['2-salmo'] != null
                        ? (songs?.find((s) => s.key === p['2-salmo']) as Song)
                        : null,
                    '3-monicion': datalist['3-monicion'],
                    '3': datalist['3'],
                    '3-salmo':
                      datalist['3-salmo'] != null
                        ? (songs?.find((s) => s.key === p['3-salmo']) as Song)
                        : null,
                    'evangelio-monicion': datalist['evangelio-monicion'],
                    evangelio: datalist.evangelio,
                    salida:
                      datalist.salida != null
                        ? (songs?.find((s) => s.key === p.salida) as Song)
                        : null,
                    nota: datalist.nota,
                  };
                  return palabra;
                case 'eucaristia':
                  var e = datalist as EucaristiaList;
                  var eucaristia: EucaristiaListForUI = {
                    name: listName,
                    version: datalist.version,
                    type: datalist.type,
                    localeType: getLocalizedListType(
                      datalist.type,
                      i18n.locale
                    ),
                    ambiental: datalist.ambiental,
                    entrada:
                      datalist.entrada != null
                        ? (songs?.find((s) => s.key === e.entrada) as Song)
                        : null,
                    '1-monicion': datalist['1-monicion'],
                    '1': datalist['1'],
                    '2-monicion': datalist['2-monicion'],
                    '2': datalist['2'],
                    'evangelio-monicion': datalist['evangelio-monicion'],
                    evangelio: datalist.evangelio,
                    'oracion-universal': datalist['oracion-universal'],
                    'comunion-pan':
                      datalist['comunion-pan'] != null
                        ? songs?.filter((s) =>
                            e['comunion-pan']?.includes(s.key)
                          )
                        : null,
                    'comunion-caliz':
                      datalist['comunion-caliz'] != null
                        ? songs?.filter((s) =>
                            e['comunion-caliz']?.includes(s.key)
                          )
                        : null,
                    paz:
                      datalist.paz != null
                        ? (songs?.find((s) => s.key === e.paz) as Song)
                        : null,
                    salida:
                      datalist.salida != null
                        ? (songs?.find((s) => s.key === e.salida) as Song)
                        : null,
                    'encargado-pan': datalist['encargado-pan'],
                    'encargado-flores': datalist['encargado-flores'],
                    nota: datalist.nota,
                  };
                  return eucaristia;
              }
            });
          });
        },
      })),
      {
        name: 'lists',
        version: 1,
        storage: launchArguments.FASTLANE_SNAPSHOT
          ? undefined
          : createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ lists: state.lists }),
        migrate: (persistedState, version) => {
          if (version === 0) {
            var lists = (persistedState as any).lists as Lists;
            var new_lists = Object.keys(lists).map((listName) => {
              var list = lists[listName];
              if (list.type == 'eucaristia') {
                // pasan de ser un solo canto, a multiples cantos
                if (list['comunion-pan'] != null) {
                  var key = list['comunion-pan'] as unknown as string;
                  list['comunion-pan'] = [key];
                }
                if (list['comunion-caliz'] != null) {
                  var key = list['comunion-caliz'] as unknown as string;
                  list['comunion-caliz'] = [key];
                }
              }
              return list;
            });
          }
          return persistedState as ListsStore;
        },
      }
    )
  )
);

useListsStore.subscribe(
  (state) => state.lists,
  (lists) => {
    useListsStore.getState().load_ui();
  },
  {
    equalityFn: shallow,
    fireImmediately: true,
  }
);

export type BrotherContact = Contacts.Contact & {
  s: boolean;
};

type BrothersStore = {
  deviceContacts: Contacts.Contact[];
  deviceContacts_loaded: boolean;
  contacts: BrotherContact[];
  populateDeviceContacts: (reqPerm: boolean) => Promise<Contacts.Contact[]>;
  update: (id: string, item: Contacts.Contact) => void;
  addOrRemove: (contact: Contacts.Contact) => void;
  refreshContacts: () => void;
};

export const useBrothersStore = create<BrothersStore>()(
  persist(
    immer((set, get) => ({
      deviceContacts: [],
      contacts: [],
      deviceContacts_loaded: false,
      populateDeviceContacts: async (reqPerm: boolean) => {
        const hasPermission = await checkContactsPermission(reqPerm);
        const { data } = hasPermission
          ? await Contacts.getContactsAsync()
          : { data: [] };
        console.log(
          `brothersStore loading device contacts (permission = ${hasPermission}, count = ${data.length})`
        );
        set((state) => ({
          deviceContacts: data,
          deviceContacts_loaded: hasPermission,
        }));
        return get().contacts;
      },
      update: (id: string, item: Contacts.Contact) => {
        set((state: BrothersStore) => {
          var brother = state.contacts.find((c) => c.id === id);
          if (brother) {
            var idx = state.contacts.indexOf(brother);
            state.contacts[idx] = Object.assign(brother, item);
          }
        });
      },
      addOrRemove: (contact: Contacts.Contact) => {
        set((state: BrothersStore) => {
          var idx = state.contacts.findIndex((c) => c.id === contact.id);
          // Ya esta importado
          if (idx !== -1) {
            state.contacts = state.contacts.filter((l, i) => i !== idx);
          } else {
            var newBrother: BrotherContact = { s: false, ...contact };
            state.contacts.push(newBrother);
          }
        });
      },
      refreshContacts: async () => {
        set(async (state: BrothersStore) => {
          try {
            const devCts = await get().populateDeviceContacts(false);
            state.contacts.forEach((c, idx) => {
              // tomar el contacto actualizado
              var devContact = devCts.find((x) => x.id === c.id);
              if (devContact) {
                state.contacts[idx] = devContact as BrotherContact;
              }
            });
          } catch {}
        });
      },
    })),
    {
      name: 'contacts',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ contacts: state.contacts }),
      migrate: (persistedState, version) => {
        if (version === 0) {
          var contacts = (persistedState as any).contacts as BrotherContact[];
          contacts.forEach((ct) => {
            ct.id = ct['recordID'];
          });
        }
        return persistedState as BrothersStore;
      },
      onRehydrateStorage: () => (state) => {
        state?.refreshContacts();
      },
    }
  )
);

const checkContactsPermission = async (reqPerm: boolean) => {
  const perm1 = await Contacts.getPermissionsAsync();
  if (perm1.status === 'undetermined') {
    if (reqPerm) {
      const perm2 = await Contacts.requestPermissionsAsync();
      if (perm2.status === Contacts.PermissionStatus.GRANTED) {
        return true;
      }
      if (perm2.status === Contacts.PermissionStatus.DENIED) {
        throw new Error('denied');
      }
    } else {
      throw new Error('denied');
    }
  }
  if (perm1.status === Contacts.PermissionStatus.GRANTED) {
    return true;
  }
  if (perm1.status === Contacts.PermissionStatus.DENIED) {
    throw new Error('denied');
  }
};

export type SettingsStore = {
  locale: string;
  keepAwake: boolean;
  zoomLevel: number;
  computedLocale: string;
  searchItems: SearchItem[];
  hasHydrated: boolean;
  ratingsEnabled: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        locale: 'default',
        keepAwake: true,
        zoomLevel: 1,
        computedLocale: 'default',
        searchItems: [],
        hasHydrated: false,
        ratingsEnabled: false,
        setHasHydrated: (state: boolean) => {
          set({
            hasHydrated: state,
          });
        },
      }),
      {
        name: 'settings',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          locale: state.locale,
          keepAwake: state.keepAwake,
          zoomLevel: state.zoomLevel,
          ratingsEnabled: state.ratingsEnabled,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);

useSettingsStore.subscribe(
  (state) =>
    [state.locale, state.hasHydrated, state.ratingsEnabled] as [
      string,
      boolean,
      boolean
    ],
  async ([locale, hasHydrated, ratingsEnabled]) => {
    if (hasHydrated) {
      i18n.locale = locale === 'default' ? getDefaultLocale() : locale;
      await useSongsStore.getState().load(i18n.locale);
      useListsStore.getState().load_ui();
      var items: Array<SearchItem> = [];
      if (ratingsEnabled) {
        items.push({
          title_key: 'search_title.ratings',
          note_key: 'search_note.ratings',
          params: { filter: null, sort: ordenClasificacion },
          badge: null,
        });
      }
      items.push(
        {
          title_key: 'search_title.alpha',
          note_key: 'search_note.alpha',
          chooser: i18n.t('search_tabs.all', { locale: i18n.locale }),
          params: { filter: null },
          badge: <AlphaBadge />,
        },
        {
          title_key: 'search_title.stage',
          divider: true,
        },
        {
          title_key: 'search_title.precatechumenate',
          note_key: 'search_note.precatechumenate',
          params: { filter: { stage: 'precatechumenate' } },
          badge: <PrecatechumenateBadge />,
        },
        {
          title_key: 'search_title.catechumenate',
          note_key: 'search_note.catechumenate',
          params: { filter: { stage: 'catechumenate' } },
          badge: <CatechumenateBadge />,
        },
        {
          title_key: 'search_title.election',
          note_key: 'search_note.election',
          params: { filter: { stage: 'election' } },
          badge: <ElectionBadge />,
        },
        {
          title_key: 'search_title.liturgy',
          note_key: 'search_note.liturgy',
          params: { filter: { stage: 'liturgy' } },
          badge: <LiturgyBadge />,
        },
        {
          title_key: 'search_title.liturgical time',
          divider: true,
        },
        {
          title_key: 'search_title.advent',
          note_key: 'search_note.advent',
          params: { filter: { advent: true } },
          badge: null,
        },
        {
          title_key: 'search_title.christmas',
          note_key: 'search_note.christmas',
          params: { filter: { christmas: true } },
          badge: null,
        },
        {
          title_key: 'search_title.lent',
          note_key: 'search_note.lent',
          params: { filter: { lent: true } },
          badge: null,
        },
        {
          title_key: 'search_title.easter',
          note_key: 'search_note.easter',
          params: { filter: { easter: true } },
          badge: null,
        },
        {
          title_key: 'search_title.pentecost',
          note_key: 'search_note.pentecost',
          params: { filter: { pentecost: true } },
          badge: null,
        },
        {
          title_key: 'search_title.liturgical order',
          divider: true,
        },
        {
          title_key: 'search_title.entrance',
          note_key: 'search_note.entrance',
          params: { filter: { entrance: true } },
          badge: null,
          chooser: i18n.t('search_tabs.entrance', { locale: i18n.locale }),
          chooser_listKey: ['entrada'],
        },
        {
          title_key: 'search_title.peace and offerings',
          note_key: 'search_note.peace and offerings',
          params: { filter: { 'peace and offerings': true } },
          badge: null,
          chooser: i18n.t('search_tabs.peace and offerings', {
            locale: i18n.locale,
          }),
          chooser_listKey: ['paz'],
        },
        {
          title_key: 'search_title.fraction of bread',
          note_key: 'search_note.fraction of bread',
          params: { filter: { 'fraction of bread': true } },
          badge: null,
          chooser: i18n.t('search_tabs.fraction of bread', {
            locale: i18n.locale,
          }),
          chooser_listKey: ['comunion-pan'],
        },
        {
          title_key: 'search_title.communion',
          note_key: 'search_note.communion',
          params: { filter: { communion: true } },
          badge: null,
          chooser: i18n.t('search_tabs.communion', { locale: i18n.locale }),
          chooser_listKey: ['comunion-pan', 'comunion-caliz'],
        },
        {
          title_key: 'search_title.exit',
          note_key: 'search_note.exit',
          params: { filter: { exit: true } },
          badge: null,
          chooser: i18n.t('search_tabs.exit', { locale: i18n.locale }),
          chooser_listKey: ['salida'],
        },
        {
          title_key: 'search_title.signing to the virgin',
          note_key: 'search_note.signing to the virgin',
          params: { filter: { 'signing to the virgin': true } },
          badge: null,
          chooser: i18n.t('search_tabs.signing to the virgin', {
            locale: i18n.locale,
          }),
        },
        {
          title_key: `search_title.children's songs`,
          note_key: `search_note.children's songs`,
          params: { filter: { "children's songs": true } },
          badge: null,
        },
        {
          title_key: 'search_title.lutes and vespers',
          note_key: 'search_note.lutes and vespers',
          params: { filter: { 'lutes and vespers': true } },
          badge: null,
        }
      );
      items = items.map((item) => {
        if (item.params) {
          item.params.title_key = item.title_key;
        }
        return item;
      });
      useSettingsStore.setState({
        computedLocale: i18n.locale,
        searchItems: items,
      });
    }
  },
  {
    equalityFn: shallow,
    fireImmediately: true,
  }
);

export const sharePDF = (shareTitleSuffix: string, pdfPath: string) => {
  Sharing.shareAsync(`file://${pdfPath}`, {
    dialogTitle: i18n.t('ui.share'),
  });
};
