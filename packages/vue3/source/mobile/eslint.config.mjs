import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

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
      '**/router/**'
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    rules: {
      'vue/no-useless-template-attributes': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
