import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Registry = {
  callbacks: Array<Function>;
  value: any;
};

type Global = {
  deregister: () => void;
  emit: (value: any) => void;
};

const persistGlobal: {
  [key: string]: Registry;
} = {};

const createPersistGlobal = (
  key: string,
  thisCallback: Function,
  initialValue: any
): Global => {
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
    emit(value: any) {
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

export type UsePersist<T> = [T, (value: any) => void, boolean];

export function usePersist<T>(
  key: string,
  typeCheck: string = '',
  defValue: any = '',
  onLoaded?: (values: T) => Promise<T>
): UsePersist<T> {
  const globalState = useRef<Global | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [value, setValue] = useState<T>(() => {
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
    (theValue: any) => {
      if (typeCheck !== '') {
        if (typeof theValue !== typeCheck) {
          throw `Tipo incorrecto: real = ${typeof theValue} vs requerido ${typeCheck}`;
        }
      }
    },
    [typeCheck]
  );

  const setValueWithTypeCheck = useCallback(
    (value: any) => {
      runTypeCheck(value);
      setValue(value);
    },
    [runTypeCheck, setValue]
  );

  useEffect(() => {
    // funcion para migrar datos viejos
    const parseMigrateRawData = async (str: string) => {
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
        var migrated: any = Object.values(object);
        const newdata = JSON.stringify(migrated);
        await AsyncStorage.setItem(key, newdata);
        object = migrated;
      }
      return object;
    };

    // funcion onLoaded centralizada
    const processAndSet = async (values: T) => {
      if (onLoaded) {
        values = await onLoaded(values);
      }
      setValue(values);
    };

    // funcion para cargar datos iniciales
    const readFromStorage = async () => {
      const theValue = await AsyncStorage.getItem(key);
      if (theValue === undefined || theValue === null) {
        await AsyncStorage.setItem(key, JSON.stringify(defValue));
        await processAndSet(defValue);
      } else {
        const parsed = await parseMigrateRawData(theValue);
        runTypeCheck(parsed);
        await processAndSet(parsed);
      }
      setInitialLoaded(true);
    };

    // cargar valor inicial desde storage
    readFromStorage();
  }, []);

  return [value, setValueWithTypeCheck, initialLoaded];
}

export default usePersist;
