// @flow
import { NativeEventEmitter } from 'react-native';
import iCloudStorage from 'react-native-icloudstore';

class CloudData {
  eventEmitter: NativeEventEmitter;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(iCloudStorage);
    this.eventEmitter.addListener(
      'iCloudStoreDidChangeRemotely',
      this.loadData
    );
  }

  loadData(userInfo: any) {
    const changedKeys = userInfo.changedKeys;
    if (changedKeys != null && changedKeys.includes('lists')) {
      iCloudStorage.getItem('lists').then(result => {
        console.log('lists on icloud are loaded!', result);
      });
    }
  }

  load(key: string) {
    return iCloudStorage
      .getItem(key)
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

  save(key: string, data: any) {
    return iCloudStorage
      .setItem(key, JSON.stringify(data))
      .then(() => {
        console.log('saved to icloud');
      })
      .catch(err => {
        console.log('erroir saving to icloud', err);
      });
  }
}

export const clouddata = new CloudData();
