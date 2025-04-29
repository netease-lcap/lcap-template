import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import globals from './eslint-config/globals.json' assert { type: 'json' };

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/views/**/*.{js,jsx,ts,tsx,vue}', 'src/components/**/*.{js,jsx,ts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/public/**',
      '**/packages/**',
      '**/common/**',
      '**/assets/**',
      '**/metaData/**',
      '**/plugins/**',
      '**/router/**',
      'src/platform.config.json',
      'src/metaData.js',
      'vite.config.ts',
      'eslint.config.mjs',
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
      'vue/no-useless-template-attributes': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': 'off',
      'vue/valid-v-slot': 'off',
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
