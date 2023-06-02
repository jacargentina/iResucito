import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { Platform } from 'react-native';
import { Box, Input, Icon, CloseIcon } from '../gluestack';
import { useDebounce } from 'use-debounce';
import { SearchIcon } from 'lucide-react-native';

export const DebouncedInput = (props: {
  testID?: string;
  placeholder: string;
  value: string;
  setValue: (term: string) => void;
}) => {
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
    <Input width="100%">
      <Input.Icon pl="$2">
        <Icon as={SearchIcon} color="$primary500" />
      </Input.Icon>
      <Input.Input
        testID={testID}
        placeholder={placeholder}
        onChangeText={setSearchTerm}
        value={searchTerm}
        returnKeyType="search"
        autoCapitalize="none"
        clearButtonMode="always"
        autoCorrect={false}
      />
      {Platform.OS === 'ios' ? (
        <Input.Icon pr="$2">
          <CloseIcon onPress={() => setSearchTerm('')} />
        </Input.Icon>
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
