// @flow
import React from 'react';
import DataContextWrapper from './DataContext';
import DocumentTitle from 'react-document-title';
import Homepage from './Homepage';
import ConfirmDialog from './ConfirmDialog';
import SongChangeNameDialog from './SongChangeNameDialog';

const App = () => {
  return (
    <DataContextWrapper>
      <DocumentTitle title={'iResucito'} />
      <ConfirmDialog />
      <SongChangeNameDialog />
      <Homepage />
    </DataContextWrapper>
  );
};

export default App;
