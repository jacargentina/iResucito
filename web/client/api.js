// @flow
import * as axios from 'axios';

declare var API_PORT: number;

axios.defaults.baseURL = location.protocol + '//' + location.hostname;

if (API_PORT) {
  axios.defaults.baseURL += ':' + API_PORT;
}

export default axios;
