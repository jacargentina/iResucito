import { config, createConfig } from '@gluestack-ui/themed';

const extendedConfig = createConfig({
  ...config.theme,
  tokens: {
    ...config.theme.tokens,
    colors: {
      ...config.theme.tokens.colors,
      primary0: '#FEF9F9',
      primary50: '#fff1f2',
      primary100: '#ffe4e6',
      primary200: '#fecdd3',
      primary300: '#fda4af',
      primary400: '#fb7185',
      primary500: '#f43f5e',
      primary600: '#e11d48',
      primary700: '#be123c',
      primary800: '#9f1239',
      primary900: '#881337',
      primary950: '#751633',
    },
  },
});

export { extendedConfig };
