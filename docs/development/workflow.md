# 工作流程

本文档介绍 LCAP Template 的开发工作流程和规范。

## Git 分支策略

### 分支说明

| 分支 | 用途 | 保护级别 |
|------|------|---------|
| `main` | 主分支，稳定版本 | 受保护 |
| `release/*` | 发布分支 | 受保护 |
| `test` | 测试环境 | 受保护 |
| `test-v*` | 多版本测试 | 受保护 |
| `feat/*` | 功能开发 | 临时 |
| `fix/*` | Bug 修复 | 临时 |

### 工作流程

```
1. 从 main 创建功能分支
   git checkout -b feat/new-feature

2. 开发并提交
   git commit -m "feat: 添加新功能"

3. 推送到远程
   git push origin feat/new-feature

4. 创建 PR 到 test 分支
   - 等待 CI 测试通过
   - Code Review

5. 合并到 test 分支
   - 自动部署到测试环境

6. 测试通过后合并到 main
   - 文档自动部署
```

## 提交规范

### Conventional Commits

格式: `<type>(<scope>): <subject>`

**Type（类型）:**

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(basic): 添加日期格式化函数` |
| `fix` | 修复 bug | `fix(vue3): 修复路由跳转问题` |
| `docs` | 文档更新 | `docs: 更新 README` |
| `style` | 代码格式 | `style: 格式化代码` |
| `refactor` | 重构 | `refactor(vue2): 重构登录逻辑` |
| `test` | 测试相关 | `test(basic): 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |
| `perf` | 性能优化 | `perf(vue3): 优化构建速度` |

**Scope（范围）:**

- `basic` - basic 包改动
- `vue2` - vue2 包改动
- `vue3` - vue3 包改动
- `react` - react 包改动
- `taro` - 小程序包改动
- `deps` - 依赖更新
- `ci` - CI/CD 相关

**示例:**

```bash
feat(basic): 添加 Cookie 工具函数

- 支持设置、获取、删除 Cookie
- 支持配置过期时间、路径、域名
- 添加单元测试

Closes #123
```

## 代码规范

### 1. 使用 lint-staged

提交前会自动运行：

```bash
# 格式化 JSON
prettier --write "**/*.json"

# 格式化代码
prettier --write "!(**/source/**/*).{ts,tsx,jsx,js}"
```

### 2. ESLint 规则

- Vue 2 包使用 ESLint 9
- Vue 3 包使用 ESLint 9 + Stylelint
- 遵循各框架官方风格指南

### 3. TypeScript 规范

- 类型定义放在 `types/` 或 `typings/` 目录
- 导出类型使用 `export type`
- 避免使用 `any`，使用 `unknown` 替代

## 开发流程示例

### 场景：修复 Vue3 包的 Bug

```bash
# 1. 切换到 main 分支并更新
git checkout main
git pull origin main

# 2. 创建修复分支
git checkout -b fix/vue3-router-bug

# 3. 修改代码
# ... 编辑文件 ...

# 4. 提交（使用规范格式）
git add .
git commit -m "fix(vue3): 修复路由守卫在特定场景下的错误

- 修复未登录用户访问受保护页面时的跳转问题
- 添加边界条件判断
- 更新相关测试用例

Fixes #456"

# 5. 推送到远程
git push origin fix/vue3-router-bug

# 6. 创建 PR 到 test 分支
# 在 GitHub 上操作

# 7. 等待 CI 通过和 Code Review

# 8. 合并后删除分支
git checkout main
git branch -d fix/vue3-router-bug
git push origin --delete fix/vue3-router-bug
```

## CI/CD 触发规则

### 测试工作流 (test.yml)

**触发条件:**
- PR 到 `test` 分支
- PR 到 `test-v*` 分支

**执行:**
```bash
pnpm install
pnpm test
```

### 构建工作流 (build.yml)

**触发条件:**
- Push 到 `release/*` 分支

**执行:**
```bash
pnpm install
LCAP_RELEASE=1 pnpm build
node ./scripts/copy-assets.js
```

### 文档工作流 (doc.yml)

**触发条件:**
- Push 到 `main` 分支

**执行:**
```bash
pnpm install
pnpm doc  # 生成 TypeDoc 文档
# 部署到 GitHub Pages
```

## 发布流程

### 1. 修改版本号

```bash
# 统一修改所有包版本
pnpm change:version --version 2.3.0
```

这会修改：
- 根目录 `package.json`
- `packages/*/package.json`

### 2. 提交版本变更

```bash
git add .
git commit -m "chore: 升级版本到 2.3.0"
git push origin main
```

### 3. 创建发布分支

```bash
git checkout -b release/v2.3.0
git push origin release/v2.3.0
```

### 4. 自动构建

Push 到 `release/*` 分支会自动触发：
- 构建所有包
- 上传构建产物
- 触发后续发布流程

## 代码审查要点

### Review Checklist

- [ ] 代码符合项目规范
- [ ] 提交信息符合 Conventional Commits
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有引入破坏性变更（或已标记 BREAKING CHANGE）
- [ ] 性能影响已评估

## 下一步

- [构建说明](./build) - 了解构建系统
- [测试指南](./test) - 学习测试方法
- [CI/CD](./ci-cd) - 深入了解 CI/CD 流程
