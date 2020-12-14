// @flow
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import I18n from '../../../translations';
import { getLocalesForPicker, getValidatedLocale } from '../../../common';

const browserLocale = typeof window !== 'undefined' ? navigator.language : 'en';
const availableLocales = getLocalesForPicker(browserLocale);

const useLocale = (initial: any) => {
  const defaultLocale = initial || browserLocale;
  const [current, setCurrent] = useState(defaultLocale);
  const router = useRouter();

  const changeLocale = (candidate: string, navigate: boolean = false) => {
    /* eslint-disable no-console */
    const str = candidate === 'default' ? browserLocale : candidate;
    const validated = getValidatedLocale(availableLocales, str);
    // Establecer el valor....
    if (validated && I18n.locale !== validated.value) {
      I18n.locale = validated.value;
      // Tomar el resultado
      console.log('changeLocale to:', I18n.locale);
      setCurrent(I18n.locale);
      localStorage.setItem('locale', I18n.locale);
    }
    if (!validated) {
      console.log('Current locale: Cannot set with candidate', candidate);
    }
    if (navigate) {
      router.push(`/list/${I18n.locale}`);
    }
  };

  const initialize = (navigate: boolean = false) => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      changeLocale(savedLocale, navigate);
    } else {
      changeLocale(defaultLocale, navigate);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return { current, availableLocales, changeLocale, initialize };
};

export default useLocale;
