const fc = require('fast-check');
fc.configureGlobal({ numRuns: 100 });

const Basic = require('./src/index');
const { Helpers } = require('./src/sdk');

try {
  Basic.initDataTypes({
    dataTypesMap: {
      'nasl.core.DateTime': { typeName: 'DateTime' },
    },
  });
  const { utils } = Basic.initUtils({
    typeDefinitionMap: new Map(),
    enumsMap: {},
    dataTypesMap: {},

    toString: Basic.Tools.toString,
    fromString: Basic.Tools.fromString,
  });

  // 全局变量
  global.Utils = utils;
  global.Helpers = Helpers;
} catch (error) {
  console.log('Error initializing Basic:', error);
}
