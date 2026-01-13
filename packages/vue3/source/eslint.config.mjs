import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import globals from './eslint-config/globals.js';
import BaseRules from './eslint-config/rules/base/index.js';
import VueRules from './eslint-config/rules/vue.js';

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{js,jsx,ts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      'dist/',
      'node_modules/',
      'eslint-config/',
      'scripts/',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
        Vue: 'readonly',
        LcapMicro: 'readonly',
        appInfo: 'writable'
      },
    },
    rules: {
      // 基础规则
      ...BaseRules.rules,
      ...VueRules.rules,
    }
  }
];
