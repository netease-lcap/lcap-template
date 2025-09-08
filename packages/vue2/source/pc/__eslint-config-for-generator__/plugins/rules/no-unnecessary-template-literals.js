module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '禁止不必要的模板字符串',
      category: 'Best Practices',
    },
    fixable: 'code',
    schema: [], // 不需要配置参数
  },
  create(context) {
    return {
      TemplateLiteral(node) {
        if (node.expressions.length) {
          // 如果有表达式，则不是不必要的模板字符串
          return;
        }

        if (node.quasis.length > 1) {
          // 如果有多个模板片段，则不是不必要的模板字符串
          return;
        }

        const text = node.quasis[0].value.cooked || node.quasis[0].value.raw;
        if (text.includes('\n') || text.includes('\r')) {
          // 如果文本包含换行符，则不是不必要的模板字符串
          return;
        }

        context.report({
          node,
          message: '不必要的模板字符串，直接使用字符串即可。',
          fix(fixer) {
            return fixer.replaceText(node, `'${text}'`); // 替换为单引号字符串
          },
        });
      },
    };
  },
};
