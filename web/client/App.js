// @flow
import React from 'react';
import DataContextWrapper from './DataContext';
import DocumentTitle from 'react-document-title';
import Homepage from './Homepage';
import ConfirmDialog from './ConfirmDialog';
import SongChangeNameDialog from './SongChangeNameDialog';
import PatchLogDialog from './PatchLogDialog';

const App = () => {
  return (
    <DataContextWrapper>
      <DocumentTitle title={'iResucito'} />
      <ConfirmDialog />
      <SongChangeNameDialog />
      <PatchLogDialog />
      <Homepage />
    </DataContextWrapper>
  );
};

export default App;
