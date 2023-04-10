import * as React from 'react';
import { Avatar } from 'native-base';
import { BrotherContact } from '../hooks';
import { ContactForImport } from '../util';

const ContactPhoto = (props: { item: BrotherContact | ContactForImport }) => {
  const { item } = props;
  const initials =
    (item.givenName && item.givenName.length > 0 ? item.givenName[0] : '') +
    (item.familyName && item.familyName.length > 0 ? item.familyName[0] : '');
  return (
    <Avatar
      bgColor="rose.500"
      source={item.hasThumbnail ? { uri: item.thumbnailPath } : undefined}>
      {initials}
    </Avatar>
  );
};

export default ContactPhoto;
