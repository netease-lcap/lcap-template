import _ from 'lodash';
import Config, { setConfig } from './config';

export * from './apis';

export * from './init';

export * from './router';

import Global, { global } from './global';

export { Config, setConfig, Global, global, _ };

export * from './utils';
