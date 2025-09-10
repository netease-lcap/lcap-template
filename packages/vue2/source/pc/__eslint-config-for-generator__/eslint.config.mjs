import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipVueFormatting from '@vue/eslint-config-prettier/skip-formatting';

import globals from '../eslint-config/globals.js';
import BaseRules from '../eslint-config/rules/base/index.js';
import VueRules from '../eslint-config/rules/vue.js';

import PluginLCAP from './plugins/lcap.js';

export default [
  // 作用范围 - 单独的配置对象，只包含 files
  {
    files: [
      'src/**/*.{js,jsx,ts,tsx,vue}',
    ],
  },
  // 全局忽略配置 - 单独的配置对象，只包含 ignores
  {
    ignores: [
      'dist/',
      'node_modules/',
      'eslint-config/',
      '__eslint-config-for-generator__/',
    ],
  },
  js.configs.recommended, // { rules: {} }
  ...pluginVue.configs['flat/vue2-essential'],
  skipVueFormatting,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        Vue: 'readonly',
        LcapMicro: 'readonly',
        appInfo: 'writable',
      },
    },
    plugins: {
      lcap: PluginLCAP,
    },
    rules: {
      // 基础规则
      ...BaseRules.rules,
      ...VueRules.rules,

      // 改不动，不改的
      eqeqeq: 'off',
      'no-shadow': 'off',
      'max-len': 'off',
      'no-await-in-loop': 'off',
      'no-loop-func': 'off',
      'no-template-curly-in-string': 'off',
      'no-multi-assign': 'off',
      'vue/multi-word-component-names': 'off',

      // 用户使用姿势
      'no-param-reassign': 'off',
      'require-atomic-updates': 'off',
      'no-console': 'off',
      'no-irregular-whitespace': 'off',
      'no-constant-condition': 'off',
      'vue/no-mutating-props': 'off',

      // 自定义规则
      'lcap/no-unused-vars': 'error',
      'lcap/no-lone-blocks': 'error',
      'lcap/no-empty-function': 'error',
      'lcap/no-empty': 'error',
      'lcap/no-useless-escape': 'error',
      'lcap/prefer-const': 'error',
      'lcap/vue-no-useless-template-attributes': 'error',
      'lcap/vue-no-unused-vars': 'error',

      // 已被复写的规则，不需要重复报错
      'no-unused-vars': 'off',
      'no-lone-blocks': 'off',
      'no-empty-function': 'off',
      'no-empty': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'off',
      'vue/no-useless-template-attributes': 'off',
      'vue/no-unused-vars': 'off',
    },
  },
];
