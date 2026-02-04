import { isPlainObject } from 'lodash';
import { stringifyWithLoopProtection } from './utils';

const interceptors: Array<{
  request?: {
    onSuccess: (config: any) => any;
    onError?: (error: any) => any;
  };
  response?: {
    onSuccess: (response: any) => any;
    onError?: (error: any) => any;
  };
}> = [];

const loopProtection = (config) => {
  try {
    if (isPlainObject(config.data) || (Array.isArray(config.data) && isPlainObject(config.data[0]))) {
      const { result, hasCircleProp } = stringifyWithLoopProtection(config.data);
      if (hasCircleProp) {
        config.data = JSON.parse(result);
      }
    }
  } catch (e) {
    console.warn('loopProtection json control error');
  }

  return config;
};

interceptors.push({
  request: {
    onSuccess: loopProtection,
  },
});

export default interceptors;
