# Git 提交消息规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (类型) **必须**

提交的类型必须是以下之一：

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具相关 |

### Scope (范围) **必须**

用于说明提交影响的范围，例如：

- `basic` - basic 包改动
- `vue2` - vue2 包改动
- `vue3` - vue3 包改动
- `react` - react 包改动
- `taro` - 小程序包改动
- `deps` - 依赖更新
- `ci` - CI/CD 相关
- 不在上述范围内的提交可以自动补充

### Subject (主题) **必须**

-   使用简洁的语言描述本次提交的更改
-   不超过 50 个字符
-   使用中文或英文（保持项目一致）
-   首字母小写
-   结尾不加句号


### Body (正文) **可选**

-   详细描述本次提交的动机和更改内容
-   可以分多行
-   应该说明"是什么"和"为什么"，而不是"怎么做"

### Footer (页脚) **可选**

-   用于关闭 Issue 或描述破坏性变更
-   Breaking Changes 必须在页脚中以 `BREAKING CHANGE:` 开头
-   关闭 Issue 使用 `Closes #issue号`
