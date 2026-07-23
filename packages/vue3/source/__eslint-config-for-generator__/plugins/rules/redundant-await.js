/**
 * remove redundant `await` expressions
 * 范围：console.log/info/warn/error 等函数调用时，参数中存在多余的 await 表达式
 */

module.exports = {
  meta: {
    type: 'suggestion',

    schema: [],

    fixable: 'code',

    messages: {
      redundantAwait: 'Redundant await expression in console function call',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      AwaitExpression(node) {
        // 检查 await 后面的是否是 CallExpression
        if (node.argument.type === 'CallExpression') {
          const callExpr = node.argument;

          // 检查是否是 console.log/info/warn/error 等调用
          if (
            callExpr.callee.type === 'MemberExpression' &&
            callExpr.callee.object.type === 'Identifier' &&
            callExpr.callee.object.name === 'console' &&
            callExpr.callee.property.type === 'Identifier' &&
            ['log', 'info', 'warn', 'error'].includes(callExpr.callee.property.name)
          ) {
            context.report({
              node,
              messageId: 'redundantAwait',
              fix(fixer) {
                // 移除 await 关键字，保留后面的表达式
                const argumentText = sourceCode.getText(node.argument);
                return fixer.replaceText(node, argumentText);
              },
            });
          }
        }
      },
    };
  },
};
