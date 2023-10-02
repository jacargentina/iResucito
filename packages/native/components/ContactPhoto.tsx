import * as React from 'react';
import { Avatar } from '@gluestack-ui/themed';
import { BrotherContact } from '../hooks';
import { ContactForImport } from '../util';

export const ContactPhoto = (props: {
  item: BrotherContact | ContactForImport;
}) => {
  const { item } = props;
  const initials =
    (item.givenName && item.givenName.length > 0 ? item.givenName[0] : '') +
    (item.familyName && item.familyName.length > 0 ? item.familyName[0] : '');
  return (
    <Avatar bgColor="$rose500">
      <Avatar.FallbackText>{initials}</Avatar.FallbackText>
      {item.hasThumbnail ? (
        <Avatar.Image source={{ uri: item.thumbnailPath }} />
      ) : null}
    </Avatar>
  );
};
