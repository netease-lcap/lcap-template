/**
 * Eslint9插件
 * 处理一些不能自动修复的问题
 */

module.exports = {
  meta: {
    name: 'eslint-plugin-lcap',
  },
  rules: {
    'no-unused-vars': require('./rules/no-unused-vars.js'),
    'no-lone-blocks': require('./rules/no-lone-blocks.js'),
    'no-empty-function': require('./rules/no-empty-function.js'),
    'no-empty': require('./rules/no-empty.js'),
    'no-useless-escape': require('./rules/no-useless-escape.js'),

    'vue-no-useless-template-attributes': require('./rules/vue/no-useless-template-attributes.js'),
    'vue-no-unused-vars': require('./rules/vue/no-unused-vars.js'),
  },
};
