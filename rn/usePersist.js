// @flow
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const persistGlobal = {};

const createPersistGlobal = (key, thisCallback, initialValue) => {
  if (!persistGlobal[key]) {
    persistGlobal[key] = { callbacks: [], value: initialValue };
  }
  persistGlobal[key].callbacks.push(thisCallback);
  return {
    deregister() {
      const arr = persistGlobal[key].callbacks;
      const index = arr.indexOf(thisCallback);
      if (index > -1) {
        arr.splice(index, 1);
      }
    },
    emit(value) {
      if (persistGlobal[key].value !== value) {
        persistGlobal[key].value = value;
        persistGlobal[key].callbacks.forEach((callback) => {
          if (thisCallback !== callback) {
            callback(value);
          }
        });
      }
    },
  };
};

const usePersist = (
  key: string,
  typeCheck: string = '',
  defValue: any = ''
): any => {
  const globalState = useRef(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [value, setValue] = useState(() => {
    if (persistGlobal[key]) {
      return persistGlobal[key].value;
    }
    return defValue;
  });

  useEffect(() => {
    // register a listener that calls `setState` when another instance emits
    globalState.current = createPersistGlobal(key, setValue, defValue);

    return () => {
      if (globalState.current) {
        globalState.current.deregister();
      }
    };
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [key]);

  // Only persist to storage if state changes.
  useEffect(() => {
    if (initialLoaded) {
      async function save() {
        // persist to localStorage
        const data = JSON.stringify(value);
        await AsyncStorage.setItem(key, data);
        // inform all of the other instances
        if (globalState.current) {
          globalState.current.emit(value);
        }
      }
      save();
    }
  }, [key, value, initialLoaded]);

  const runTypeCheck = useCallback(
    (theValue) => {
      if (typeCheck !== '') {
        if (typeof theValue !== typeCheck) {
          throw `Tipo incorrecto: real = ${typeof theValue} vs requerido ${typeCheck}`;
        }
      }
    },
    [typeCheck]
  );

  const onTextChanged = useCallback(
    (text: string) => {
      runTypeCheck(text);
      setValue(text);
    },
    [runTypeCheck, setValue]
  );

  useEffect(() => {
    // funcion para migrar datos viejos
    const parseMigrateRawData = async (str) => {
      var object = JSON.parse(str);
      // si el str tiene formato de react-native-storage
      // migrar a objeto sin propiedad 'rawData'
      if (object.hasOwnProperty('rawData')) {
        var migrated = defValue;
        for (var prop in object.rawData) {
          migrated[prop] = object.rawData[prop];
        }
        // almacenar con nuevo formato
        const newdata = JSON.stringify(migrated);
        await AsyncStorage.setItem(key, newdata);
        object = migrated;
      }
      // Corregir migracion incorrecta de 'contacts'
      if (key === 'contacts' && !Array.isArray(object)) {
        var migrated = Object.values(object);
        const newdata = JSON.stringify(migrated);
        await AsyncStorage.setItem(key, newdata);
        object = migrated;
      }
      return object;
    };
    // funcion para cargar datos
    const readFromStorage = async () => {
      const theValue = await AsyncStorage.getItem(key);
      if (theValue === undefined || theValue === null) {
        await AsyncStorage.setItem(key, JSON.stringify(defValue));
        setValue(defValue);
      } else {
        const parsed = await parseMigrateRawData(theValue);
        runTypeCheck(parsed);
        setValue(parsed);
      }
      setInitialLoaded(true);
    };

    // cargar valor inicial desde storage
    readFromStorage();
  }, []);

  return [value, onTextChanged];
};

export default usePersist;
