// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './App';

const container = document.getElementById('root');
if (container) {
  ReactDOM.render(<App />, container);
}
