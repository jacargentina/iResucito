declare module 'react-native-rating-element';
declare module 'react-native-icloudstore';
declare module '@javier.alejandro.castro/react-native-stream';
import { CollapsibleProps as OriginalCollapsibleProps } from 'react-native-collapsible';

declare type ListType = 'eucaristia' | 'palabra' | 'libre';

declare type ListAction = 'create' | 'rename';

declare type SongSetting = 'transportTo' | 'rating';

declare type ShareListType = 'native' | 'text' | 'pdf';

declare module 'react-native-collapsible' {
  interface CollapsibleProps extends OriginalCollapsibleProps {
    children?: React.ReactNode;
  }
}
