import { Avatar, AvatarFallbackText, AvatarImage } from '@gluestack-ui/themed';
import { BrotherContact } from '../hooks';
import { ContactForImport } from '../util';

export const ContactPhoto = (props: {
  item: BrotherContact | ContactForImport;
}) => {
  const { item } = props;
  const initials =
    (item.firstName && item.firstName.length > 0 ? item.firstName[0] : '') +
    (item.lastName && item.lastName.length > 0 ? item.lastName[0] : '');
  return (
    <Avatar bgColor="$rose500">
      <AvatarFallbackText>{initials}</AvatarFallbackText>
      {item.image ? <AvatarImage source={{ uri: item.image.uri }} /> : null}
    </Avatar>
  );
};
