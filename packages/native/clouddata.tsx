import { NativeEventEmitter } from 'react-native';
import iCloudStorage from 'react-native-icloudstore';

class CloudData {
  eventEmitter: any;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(iCloudStorage);
    this.eventEmitter.addListener(
      'iCloudStoreDidChangeRemotely',
      this.loadData
    );
  }

  loadData: any = (userInfo: any) => {
    const changedKeys = userInfo.changedKeys;
    if (changedKeys != null && changedKeys.includes('lists')) {
      iCloudStorage.getItem('lists').then((result) => {
        console.log('lists on icloud are loaded!', result);
      });
    }
  };

  load(key: string): any {
    return iCloudStorage
      .getItem(key)
      .then((res) => {
        if (res) {
          return JSON.parse(res);
        }
        return null;
      })
      .catch((err) => {
        console.log('error loading from icloud', err);
      });
  }

  save(key: string, data: any): void {
    return iCloudStorage
      .setItem(key, JSON.stringify(data))
      .then(() => {
        console.log('saved to icloud');
      })
      .catch((err) => {
        console.log('erroir saving to icloud', err);
      });
  }
}

export const clouddata: CloudData = new CloudData();