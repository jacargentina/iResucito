import * as React from 'react';
import { Avatar } from 'native-base';

const ContactPhoto = (props: any) => {
  const initials =
    props.item.givenName[0] +
    (props.item.familyName && props.item.familyName.length > 0
      ? props.item.familyName[0]
      : '');
  return (
    <Avatar
      source={
        props.item.hasThumbnail ? { uri: props.item.thumbnailPath } : undefined
      }>
      {initials}
    </Avatar>
  );
};

export default ContactPhoto;
