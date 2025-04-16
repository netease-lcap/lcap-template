import NaslSDK from '@lcap/nasl-sdk';

import Global from '../../global';
import Config from '../../config';

import { genInitFromSchema } from '../dataTypes';
import { toString, fromString, toastAndThrowError as toastAndThrow, typeDefinitionMap } from '../dataTypes/tools';

let enumsMap = {};
let dataTypesMap = {};

function initUtils(
  options: {
    enumsMap?: Record<string, any>;
    dataTypesMap?: Record<string, any>;
  } = {},
) {
  enumsMap = options.enumsMap;
  dataTypesMap = options.dataTypesMap;

  const sdkUtils = NaslSDK.initUtils({
    typeDefinitionMap,
    enumsMap,
    dataTypesMap,
    fromString,
    toString,
    throwError: toastAndThrow,

    // Vue2遗留
    set: Global.set,
    put: Global.prototype.$set,
    delete: Global.delete,
  });

  const utils = Object.assign(sdkUtils, {
    New(obj) {
      return genInitFromSchema(obj);
    },
  });

  Config.globalProperties.set('$utils', utils);

  return {
    utils: utils,
  };
}

export { initUtils };
