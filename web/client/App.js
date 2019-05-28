// @flow
import React from 'react';
import DataContextWrapper from './DataContext';
import DocumentTitle from 'react-document-title';
import Homepage from './Homepage';
import ConfirmDialog from './ConfirmDialog';

const App = () => {
  return (
    <DataContextWrapper>
      <DocumentTitle title={'iResucito'} />
      <ConfirmDialog />
      <Homepage />
    </DataContextWrapper>
  );
};

export default App;
