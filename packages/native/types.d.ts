import { CollapsibleProps as OriginalCollapsibleProps } from 'react-native-collapsible';

declare module 'react-native-collapsible' {
  interface CollapsibleProps extends OriginalCollapsibleProps {
    children?: React.ReactNode;
  }
}
