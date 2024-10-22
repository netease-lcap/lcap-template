import merge from 'lodash/merge';

import { createService } from "../../../utils/create";
import apiConfig from './api.config';
import api from './api';

const initService = (serviceConfig = {}) => createService(merge(api, apiConfig), serviceConfig);

export {
    initService,
};
