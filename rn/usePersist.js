// @flow
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const usePersist = (
  key: string,
  typeCheck: string = '',
  defValue: any = ''
): any => {
  const [value, setValue] = useState(null);

  const runTypeCheck = useCallback(
    theValue => {
      if (typeCheck !== '') {
        if (typeof theValue !== typeCheck) {
          throw `Tipo incorrecto: real = ${typeof theValue} vs requerido ${typeCheck}`;
        }
      }
    },
    [typeCheck]
  );

  const parseMigrateRawData = async str => {
    var object = JSON.parse(str);
    // si el str tiene formato de react-native-storage
    // migrar a objeto sin propiedad 'rawData'
    if (object.hasOwnProperty('rawData')) {
      var migrated = {};
      for (var prop in object.rawData) {
        migrated[prop] = object.rawData[prop];
      }
      // almacenar con nuevo formato
      const newdata = JSON.stringify(migrated);
      await AsyncStorage.setItem(key, newdata);
      object = migrated;
    }
    return object;
  };

  const readFromStorage = useCallback(async () => {
    setValue(null);
    const theValue = await AsyncStorage.getItem(key);
    if (theValue === undefined || theValue === null) {
      setValue(defValue);
      await AsyncStorage.setItem(key, JSON.stringify(defValue));
    } else {
      const parsed = await parseMigrateRawData(theValue);
      runTypeCheck(parsed);
      setValue(parsed);
    }
  }, [key, runTypeCheck]);

  const onTextChanged = async (text: string) => {
    runTypeCheck(text);
    setValue(text);
    const data = JSON.stringify(text);
    await AsyncStorage.setItem(key, data);
  };

  useEffect(() => {
    readFromStorage();
  }, [readFromStorage]);

  return [value, onTextChanged, readFromStorage];
};

export default usePersist;
