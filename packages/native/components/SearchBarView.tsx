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
} from '@gluestack-ui/themed';
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
      <InputSlot>
        <InputIcon ml="$2" as={SearchIcon} color="$primary500" size="lg" />
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
      />
      {Platform.OS === 'ios' ? (
        <InputSlot onPress={() => setSearchTerm('')}>
          <InputIcon mr="$2" as={CloseIcon} />
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
