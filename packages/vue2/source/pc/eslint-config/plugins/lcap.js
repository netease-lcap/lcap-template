module.exports = {
  meta: {
		name: "eslint-plugin-lcap",
  },
  rules: {
    'no-var': {
      meta: {
        type: "suggestion",
        docs: {
          description: "Disallow var and suggest let",
          category: "Best Practices",
          recommended: true,
        },
        fixable: "code",
        schema: [], // 不需要配置参数
      },
      create(context) {
        return {
          // 监听所有变量声明
          VariableDeclaration(node) {
            if (node.kind === "var") {
              context.report({
                node,
                message: "Use 'let' instead of 'var'.",
                // 提供自动修复
                fix(fixer) {
                  return fixer.replaceTextRange(
                    [node.start, node.start + 3], // 替换前3个字符（'var'）
                    "let"
                  );
                }
              });
            }
          }
        };
      }
    },

    'no-empty-if-else': {
        meta: {
            type: "suggestion",
            docs: {
                description: "反转空的 if 块并将 else 内容提升到 if",
                category: "Best Practices",
            },
            fixable: "code",
            schema: [],
        },
    
        create(context) {
            // 判断是否为空的块语句（如 {}）
            function isEmptyBlock(node) {
                return node.type === "BlockStatement" && node.body.length === 0;
            }
            
            // 判断是否为 else if（即 alternate 是另一个 IfStatement）
            function isElseIf(node) {
                return node.type === "IfStatement";
            }
            
            // 获取 else 块的内容文本（保留原有格式）
            function getBlockContent(node) {
                const sourceCode = context.getSourceCode();
                if (node.type === "BlockStatement") {
                return sourceCode.getText(node);
                }
                // 处理单行语句（如 else doSomething();）
                return `{\n${sourceCode.getText(node)}\n}`; // 添加大括号
            }
            
            // 条件取反（处理括号和运算符优先级）
            function negateCondition(test, sourceCode) {
                const testText = sourceCode.getText(test);
                
                // 简单情况：直接添加 !
                if (test.type === "Identifier" || test.type === "Literal") {
                return `!${testText}`;
                }
                
                // 复杂表达式：用括号包裹后取反
                return `!(${testText})`;
            }
            return {
                // 监听所有 if 语句
                IfStatement(node) {
                    const { test, consequent, alternate } = node;
            
                    // if (bool) {  } else { console.log(1) }
                    if (
                        isEmptyBlock(consequent) &&  // if 块为空
                        alternate &&                 // 存在 else
                        !isElseIf(alternate) &&      // 排除 else if
                        !isEmptyBlock(alternate)     // else 块非空
                    ) {
                        context.report({
                            node,
                            message: "反转空 if 块并将 else 提升到 if",
                
                            // 自动修复逻辑
                            fix(fixer) {
                                // 生成取反后的条件表达式（自动处理括号）
                                const negatedTest = negateCondition(test, context.getSourceCode());
                                let alternateStart = node.consequent.range[1];
                                let alternateEnd = node.alternate.range[1]
                
                                // 替换整个 if 语句
                                return [
                                    fixer.replaceText(test, negatedTest),                    // 替换条件为 !condition
                                    fixer.replaceText(consequent, getBlockContent(alternate)), // 将 else 内容移到 if 块
                                    fixer.removeRange([alternateStart, alternateEnd])                // 删除 else 块
                                ];
                            }
                        });
                    }

                    // if (bool) {}
                    if (
                        isEmptyBlock(consequent) &&  // if 块为空
                        !alternate                // 不存在 else
                    ) {
                        context.report({
                            node,
                            message: "空的 if 块",
                
                            // 自动修复逻辑
                            fix(fixer) {
                                return fixer.removeRange(node.range); // 删除整个 if 语句
                            }
                        });
                    }

                    // if (bool) { console.log(1) } else {}
                    if (
                        !isEmptyBlock(consequent) &&  // if 块非空
                        alternate &&                 // 存在 else
                        !isElseIf(alternate) &&      // 排除 else if
                        isEmptyBlock(alternate)     // else 块为空
                    ) {
                        context.report({
                            node,
                            message: "空的 else 块",

                            fix(fixer) {
                                let alternateStart = node.consequent.range[1];
                                let alternateEnd = node.alternate.range[1]
                                return fixer.removeRange([alternateStart, alternateEnd]);
                            }
                        });
                    }
                }
            };
        },
    },
    // 不必要的字符串模板使用
    'no-unnecessary-template-literals': {
      meta: {
        type: "suggestion",
        docs: {
          description: "禁止不必要的模板字符串",
          category: "Best Practices",
        },
        fixable: "code",
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
            if (text.includes("\n") || text.includes("\r")) {
              // 如果文本包含换行符，则不是不必要的模板字符串
              return;
            }

            context.report({
              node,
              message: "不必要的模板字符串，直接使用字符串即可。",
              fix(fixer) {
                return fixer.replaceText(node, `'${text}'`); // 替换为单引号字符串
              }
            });
          }
        };
      }
    }
  }
};