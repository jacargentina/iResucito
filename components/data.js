import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export const localdata = new Storage({
  // maximum capacity, default 1000
  size: 1000,

  // Use AsyncStorage for RN, or window.localStorage for web.
  // If not set, data would be lost after reload.
  storageBackend: AsyncStorage,

  // expire time, default 1 day(1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: null,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired,
  // the corresponding sync method will be invoked and return
  // the latest data.
  sync: {
    settings(params) {
      let { resolve } = params;
      resolve();
    },
    lists(params) {
      let { resolve } = params;
      resolve();
    },
    contacts(params) {
      let { resolve } = params;
      resolve();
    }
  }
});

import { NativeEventEmitter } from 'react-native';
import iCloudStorage from 'react-native-icloudstore';

class CloudData {
  constructor() {
    this.eventEmitter = new NativeEventEmitter(iCloudStorage);
    this.eventEmitter.addListener(
      'iCloudStoreDidChangeRemotely',
      this.loadData
    );
  }

  loadData(userInfo) {
    const changedKeys = userInfo.changedKeys;
    if (changedKeys != null && changedKeys.includes('lists')) {
      iCloudStorage.getItem('lists').then(result => {
        /* eslint-disable no-console */
        console.log('lists on icloud are loaded!', result);
      });
    }
  }

  load(item) {
    return iCloudStorage
      .getItem(item.key)
      .then(res => {
        if (res) {
          return JSON.parse(res);
        }
        return null;
      })
      .catch(err => {
        console.log('error loading from icloud', err);
      });
  }

  save(item) {
    return iCloudStorage
      .setItem(item.key, JSON.stringify(item.data))
      .then(() => {
        console.log('saved to icloud');
      })
      .catch(err => {
        console.log('erroir saving to icloud', err);
      });
  }
}

export const clouddata = new CloudData();
