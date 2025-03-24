import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/public/**', '**/packages/**', '**/common/**', '**/metaData.js'],
  },

  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    rules: {
      'vue/no-useless-template-attributes': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/valid-v-slot': 'off'
    }
}
];
