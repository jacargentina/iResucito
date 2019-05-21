// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/site.min.css';
import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/container.min.css';
import 'semantic-ui-css/components/divider.min.css';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/dropdown.min.css';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/grid.min.css';
import 'semantic-ui-css/components/header.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/input.min.css';
import 'semantic-ui-css/components/image.min.css';
import 'semantic-ui-css/components/item.min.css';
import 'semantic-ui-css/components/label.min.css';
import 'semantic-ui-css/components/list.min.css';
import 'semantic-ui-css/components/loader.min.css';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/menu.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/popup.min.css';
import 'semantic-ui-css/components/progress.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/segment.min.css';

import App from './App';

const container = document.getElementById('root');
if (container) {
  ReactDOM.render(<App />, container);
}
