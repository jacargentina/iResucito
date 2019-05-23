// @flow
import React from 'react';
import DataContextWrapper from './DataContext';
import DocumentTitle from 'react-document-title';
import Homepage from './Homepage';
import ConfirmDialog from './ConfirmDialog';
import SongChangeMetadataDialog from './SongChangeMetadataDialog';
import PatchLogDialog from './PatchLogDialog';

const App = () => {
  return (
    <DataContextWrapper>
      <DocumentTitle title={'iResucito'} />
      <ConfirmDialog />
      <SongChangeMetadataDialog />
      <PatchLogDialog />
      <Homepage />
    </DataContextWrapper>
  );
};

export default App;
