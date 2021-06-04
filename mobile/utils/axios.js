import axios from 'axios';

import { BASEURL } from './constant';

axios.defaults.baseURL = BASEURL;
export default axios;
