import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Platform, StyleSheet } from 'react-native';
import { Box, Input, Icon, useTheme } from 'native-base';
import { useDebounce } from 'use-debounce';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DebouncedInput = (props: any) => {
  const { value, setValue } = props;
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    setValue(debouncedTerm);
  }, [debouncedTerm, setValue]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <Input
      m="1"
      size="md"
      isFullWidth
      placeholder="Buscar..."
      onChangeText={setSearchTerm}
      value={searchTerm}
      returnKeyType="search"
      autoCapitalize="none"
      clearButtonMode="always"
      autoCorrect={false}
      InputLeftElement={
        <Icon as={Ionicons} size="sm" name="search" color="rose.500" ml="2" />
      }
      InputRightElement={
        Platform.OS === 'android' && (
          <Icon
            as={Ionicons}
            size="sm"
            name="close"
            color="rose.500"
            mr="2"
            onPress={() => setSearchTerm('')}
          />
        )
      }
    />
  );
};

const SearchBarView = (props: any) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <AndroidBackHandler
      onBackPress={() => {
        navigation.goBack();
        return true;
      }}>
      <DebouncedInput value={props.value} setValue={props.setValue} />
      <Box
        flex={1}
        borderTopWidth={StyleSheet.hairlineWidth}
        borderTopColor={colors.muted['300']}>
        {props.children}
      </Box>
    </AndroidBackHandler>
  );
};

export default SearchBarView;
