// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

const Loading = (props: any) => {
  const data = useContext(DataContext);
  const { apiLoading } = data;
  return (
    <div
      style={{
        height: props.height || '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {apiLoading && (
        <Loader
          active
          inline="centered"
          size="large"
          inverted={props.inverted || false}
          content={props.title || 'Cargando...'}
        />
      )}
      {!apiLoading && props.children}
    </div>
  );
};

export default Loading;
