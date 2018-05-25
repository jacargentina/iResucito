// @flow
import React from 'react';
import { Text, Badge, Thumbnail } from 'native-base';

const ContactPhoto = (props: any) => {
  if (props.item.hasThumbnail) {
    return <Thumbnail source={{ uri: props.item.thumbnailPath }} />;
  }
  return (
    <Badge
      info
      style={{
        width: 56,
        height: 56,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold'
        }}>
        {props.item.givenName[0]} {props.item.familyName && props.item.familyName.length > 0 ? props.item.familyName[0] : ''}
      </Text>
    </Badge>
  );
};

export default ContactPhoto;
