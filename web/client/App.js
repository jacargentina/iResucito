// @flow
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Homepage from './Homepage';
import DataContextWrapper from './DataContext';
import ConfirmDialog from './ConfirmDialog';

const App = () => {
  return (
    <DataContextWrapper>
      <HashRouter>
        <DocumentTitle title={'iResucito'} />
        <ConfirmDialog />
        <Switch>
          <Route exact path="/" component={Homepage} />
        </Switch>
      </HashRouter>
    </DataContextWrapper>
  );
};

export default App;
