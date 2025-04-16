const fc = require('fast-check');
fc.configureGlobal({ numRuns: 100 });

const NaslSDK = require('@lcap/nasl-sdk').default;
const { toString, fromString } = require('./src/init/dataTypes/tools');

try {
  const utils = NaslSDK.initUtils({
    typeDefinitionMap: new Map(),
    enumsMap: {},
    dataTypesMap: {},

    toString,
    fromString,
  });

  // 全局变量
  global.sdkUtils = utils;
} catch (error) {
  console.log('Error initializing NaslSDK:', error);
}
