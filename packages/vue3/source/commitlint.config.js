module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'refactor', // 代码重构（既不是新增功能，也不是修复bug）
        'perf', // 性能优化
        'test', // 增加测试
        'build', // 构建相关
        'ci', // 持续集成相关
        'chore', // 其他修改（不属于以上类型）
        'revert', // 回退
      ],
    ],
    'subject-case': [0], // 关闭 subject 必须使用特定大小写的校验
    'header-max-length': [2, 'always', 72], // 限制头部长度
    'scope-empty': [2, 'never'], // scope 不能为空
    'type-case': [2, 'always', 'lower-case'], // type 必须小写
  },
};
