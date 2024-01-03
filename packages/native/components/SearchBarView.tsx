import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { Platform } from 'react-native';
import {
  Box,
  Input,
  CloseIcon,
  InputIcon,
  InputField,
  InputSlot,
  useMedia,
} from '@gluestack-ui/themed';
import { useDebounce } from 'use-debounce';
import { SearchIcon } from 'lucide-react-native';

export const DebouncedInput = (props: {
  testID?: string;
  placeholder: string;
  value: string;
  setValue: (term: string) => void;
}) => {
  const media = useMedia();
  const { testID, value, placeholder, setValue } = props;
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setValue(debouncedTerm);
  }, [debouncedTerm, setValue]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <Input width="100%" size={media.md ? 'xl' : undefined}>
      <InputSlot>
        <InputIcon
          sx={{
            '@base': {
              ml: '$2',
            },
            '@md': {
              ml: '$3',
            },
          }}
          as={SearchIcon}
          color="$primary500"
          size={media.base ? 'lg' : 'xxl'}
        />
      </InputSlot>
      <InputField
        testID={testID}
        placeholder={placeholder}
        onChangeText={setSearchTerm}
        value={searchTerm}
        returnKeyType="search"
        autoCapitalize="none"
        clearButtonMode="always"
        autoCorrect={false}
        sx={{
          '@base': {
            fontSize: undefined,
            lineHeight: undefined
          },
          '@md': {
            fontSize: '$xl',
            lineHeight: '$md'
          },
        }}
      />
      {Platform.OS === 'ios' ? (
        <InputSlot onPress={() => setSearchTerm('')}>
          <InputIcon
            sx={{
              '@base': {
                mr: '$2',
              },
              '@md': {
                mr: '$3',
              },
            }}
            as={CloseIcon}
          />
        </InputSlot>
      ) : undefined}
    </Input>
  );
};

export const SearchBarView = (props: {
  testID?: string;
  placeholder: string;
  value: string;
  setValue: (term: string) => void;
  children: any;
}) => {
  const navigation = useNavigation();

  useAndroidBackHandler(() => {
    navigation.goBack();
    return true;
  });

  return (
    <>
      <DebouncedInput
        testID={props.testID}
        placeholder={props.placeholder}
        value={props.value}
        setValue={props.setValue}
      />
      <Box flex={1}>{props.children}</Box>
    </>
  );
};
