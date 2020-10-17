// @flow
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import I18n from '../../../translations';
import { getLocalesForPicker, getValidatedLocale } from '../../../common';

const browserLocale = typeof window !== 'undefined' ? navigator.language : 'en';
const availableLocales = getLocalesForPicker(browserLocale);

const useLocale = (navEnabled: boolean = true) => {
  const [current, setCurrent] = useState(browserLocale);
  const [navigationEnabled, setNavigationEnabled] = useState<boolean>(
    navEnabled
  );
  const router = useRouter();

  const changeLocale = (candidate: string) => {
    /* eslint-disable no-console */
    const str = candidate === 'default' ? browserLocale : candidate;
    const validated = getValidatedLocale(availableLocales, str);
    // Establecer el valor....
    if (validated && I18n.locale !== validated.value) {
      I18n.locale = validated.value;
      console.log('Current locale:', I18n.locale);
    }
    if (!validated) {
      console.log('Current locale: Cannot set with candidate', candidate);
    }
    // Tomar el resultado
    setCurrent(I18n.locale);
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      changeLocale(savedLocale);
    } else {
      changeLocale(browserLocale);
    }
  }, []);

  useEffect(() => {
    if (current && navigationEnabled) {
      localStorage.setItem('locale', current);
      router.push(`/list/${current}`);
    }
  }, [current, navigationEnabled]);

  return { current, availableLocales, changeLocale, setNavigationEnabled };
};

export default useLocale;
