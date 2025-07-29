import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import globals from './eslint-config/globals.json' assert { type: 'json' };
import PluginLCAP from './eslint-config/plugins/lcap.js';

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{js,jsx,ts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/*.config.{js,ts,mjs}',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/vue2-essential'],
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
    plugins: {
      lcap: PluginLCAP,
    },
    rules: {
      'vue/no-useless-template-attributes': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/valid-v-slot': 'off',
      'import/no-unresolved': 'off',

      'no-unused-vars': ['error', {
        argsIgnorePattern: '(event|current(\\d+)?)',
        caughtErrors: 'none',
      }],
      // 忽略template中slotScope的变量未使用
      'vue/no-unused-vars': ['error', {
        ignorePattern: '^current(\\d+)?',
      }],
      // lcap插件 var -> let
      'lcap/no-var': 'warn',
      // lcap插件 no-empty-if-else
      'lcap/no-empty-if-else': 'warn',
      // lcap插件 no-useless-template-literals
      'lcap/no-unnecessary-template-literals': 'warn',
    }
  }
];
