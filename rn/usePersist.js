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

  const readFromStorage = useCallback(async () => {
    setValue(null);
    const theValue = await AsyncStorage.getItem(key);
    if (theValue === undefined || theValue === null) {
      setValue(defValue);
      await AsyncStorage.setItem(key, JSON.stringify(defValue));
    } else {
      const parsed = JSON.parse(theValue);
      runTypeCheck(parsed);
      setValue(parsed);
    }
  }, [key, runTypeCheck]);

  const onTextChanged = async (text: string) => {
    runTypeCheck(text);
    setValue(text);
    await AsyncStorage.setItem(key, JSON.stringify(text));
  };

  useEffect(() => {
    readFromStorage();
  }, [readFromStorage]);

  return [value, onTextChanged, readFromStorage];
};

export default usePersist;
