# 常见问题

本文档整理了使用 LCAP Template 过程中的常见问题及解决方案。

## 环境相关问题

### Q: 必须使用 pnpm 吗？

**A:** 是的，必须使用 pnpm。

原因：
- 项目使用 pnpm workspaces 管理 monorepo
- 使用 `workspace:*` 协议链接本地包
- pnpm 的依赖去重机制节省磁盘空间

```bash
# 安装 pnpm
npm install -g pnpm

# 验证版本
pnpm -v  # 需要 >= 8
```

### Q: Node.js 版本有什么要求？

**A:** 必须使用 Node.js 18 或更高版本。

```bash
# 检查版本
node -v

# 使用 nvm 切换
nvm install 18
nvm use 18
```

### Q: Windows 下如何开发？

**A:** 推荐以下方式：

1. **WSL2**（推荐）
   ```bash
   # 在 WSL2 中执行所有命令
   pnpm install
   pnpm build
   ```

2. **Git Bash**
   - 使用 Git for Windows 自带的 Bash
   - 支持大部分 Linux 命令

3. **PowerShell**
   - 需要配置执行策略
   - 部分脚本可能需要调整

## 安装相关问题

### Q: `pnpm install` 很慢或失败

**A:** 尝试以下解决方案：

```bash
# 1. 切换镜像源
pnpm config set registry https://registry.npmmirror.com

# 2. 清除缓存
pnpm store prune

# 3. 重新安装
rm -rf node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Q: 安装后提示依赖冲突

**A:** 这是正常现象，不影响使用。

项目依赖较多，部分包存在 peer dependency 警告，但不影响功能。如：
- Vue 2.6 与某些插件的版本警告
- ESLint 版本差异警告

### Q: Husky 钩子没有生效

**A:** 检查以下配置：

```bash
# 确保 husky 已安装
pnpm exec husky --version

# 手动安装钩子
pnpm exec husky install

# 检查 .husky 目录
ls -la .husky/
```

## 构建相关问题

### Q: `pnpm build` 失败

**A:** 按以下步骤排查：

```bash
# 1. 确保在根目录
cd /path/to/lcap-template

# 2. 检查 Node.js 版本
node -v  # >= 18

# 3. 重新安装依赖
rm -rf node_modules
pnpm install

# 4. 单独构建 basic 包
cd packages/basic && pnpm build

# 5. 回到根目录构建全部
cd ../.. && pnpm build
```

### Q: 提示找不到 `@lcap/basic-template`

**A:** basic 包需要先构建：

```bash
# 方案 1：在根目录构建（自动处理依赖）
pnpm build

# 方案 2：手动构建 basic 包
cd packages/basic
pnpm build
cd ../..
pnpm build
```

### Q: 构建产物在哪里？

**A:** 各包构建产物位置：

```
packages/basic/dist/          # JS 文件
packages/basic/typings/       # 类型定义
packages/vue2/dist/           # Vue2 构建产物
packages/vue3/dist/           # Vue3 构建产物
packages/react/dist/          # React 构建产物
mini-folder/taro/dist/        # 小程序构建产物
```

### Q: 如何只构建单个包？

**A:**

```bash
# basic 包
cd packages/basic && pnpm build

# vue2 包（需要先构建 basic）
cd packages/vue2 && pnpm build

# vue3 包（需要先构建 basic）
cd packages/vue3 && pnpm build
```

## 开发相关问题

### Q: 如何调试代码？

**A:**

**basic 包调试：**
```bash
cd packages/basic
pnpm dev  # 监听模式，自动发布到本地 yalc
```

**vue2 包调试：**
```bash
cd packages/vue2
pnpm dev  # 启动开发服务器
```

**vue3 包调试：**
```bash
cd packages/vue3
# 目前需要手动构建测试
pnpm build
```

### Q: 如何运行测试？

**A:**

```bash
# 运行所有测试
pnpm test

# 只运行 basic 包测试
cd packages/basic && pnpm test

# 带覆盖率报告
cd packages/basic && pnpm test -- --coverage
```

### Q: 如何修改版本号？

**A:**

```bash
# 统一修改所有包的版本
pnpm change:version --version 2.2.0

# 这会修改：
# - 根目录 package.json
# - packages/*/package.json
```

### Q: 代码提交规范是什么？

**A:** 使用 Conventional Commits：

```bash
# 格式
<type>(<scope>): <subject>

# 示例
feat(basic): 添加新的工具函数
fix(vue3): 修复路由跳转问题
docs: 更新 README
refactor(vue2): 重构登录逻辑
```

type 类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

## 部署相关问题

### Q: 如何部署静态资源？

**A:**

```bash
# 构建生产版本
LCAP_RELEASE=1 pnpm build

# 部署
pnpm run deploy --platform <平台> --username <用户名> --password <密码>
```

### Q: CI/CD 流程是怎样的？

**A:**

**测试流程：**
- PR 到 `test` 或 `test-v*` 分支
- 自动运行测试

**构建流程：**
- Push 到 `release/*` 分支
- 自动构建并上传产物

**文档部署：**
- Push 到 `main` 分支
- 自动部署到 GitHub Pages

### Q: 如何触发文档站点更新？

**A:**

```bash
# 1. 修改文档
# 2. 提交到 main 分支
git add .
git commit -m "docs: 更新文档"
git push origin main

# GitHub Actions 会自动部署
```

## 包使用相关问题

### Q: 如何在项目中使用 basic 包？

**A:**

```typescript
// 安装
npm install @lcap/basic-template

// 使用
import { setConfig, authAPI } from '@lcap/basic-template';

// 配置
setConfig({
  toast: {
    show: (msg) => alert(msg),
    error: (msg) => alert(msg)
  }
});

// 调用 API
await authAPI.login({ username, password });
```

### Q: basic 包和框架包的关系？

**A:**

```
basic 包（纯函数库）
    │
    ├── 被 vue2 包依赖
    ├── 被 vue3 包依赖
    └── 被 react 包依赖

框架包（vue2/vue3/react）
    │
    ├── 依赖 basic 包
    └── 添加框架特定的实现
```

### Q: 可以单独使用 basic 包吗？

**A:** 可以，basic 包是框架无关的。

```bash
# 在任何项目中安装
npm install @lcap/basic-template

# 纯 JavaScript/TypeScript 项目都能使用
```

## 性能相关问题

### Q: 构建速度很慢怎么办？

**A:**

```bash
# 使用 Turbo 缓存
pnpm build

# 第二次构建会快很多（命中缓存）

# 清理缓存（如果出现问题）
rm -rf .turbo
```

### Q: 包体积太大怎么办？

**A:**

1. **使用 ES Module**
   ```typescript
   // 按需导入
   import { authAPI } from '@lcap/basic-template';
   
   // 而不是全部导入
   import * as Basic from '@lcap/basic-template';
   ```

2. **Tree Shaking**
   - basic 包支持 Tree Shaking
   - 只打包使用的代码

3. **代码分割**
   - vue3 包使用 Rspack 自动代码分割
   - 按路由懒加载

## 其他问题

### Q: 如何贡献代码？

**A:**

1. Fork 项目
2. 创建分支：`git checkout -b feat/xxx`
3. 提交更改：`git commit -m "feat: xxx"`
4. Push 到 Fork：`git push origin feat/xxx`
5. 创建 Pull Request

详见 [贡献指南](/development/contributing)。

### Q: 在哪里提问？

**A:**

- GitHub Issues: [提交问题](https://github.com/netease-lcap/lcap-template/issues)
- GitHub Discussions: [讨论区](https://github.com/netease-lcap/lcap-template/discussions)

### Q: 有详细的 API 文档吗？

**A:** 有，basic 包使用 TypeDoc 生成 API 文档：

```bash
# 生成文档
cd packages/basic
pnpm doc

# 查看文档
open ../../docs/index.html
```

在线文档：[https://netease-lcap.github.io/lcap-template/](https://netease-lcap.github.io/lcap-template/)

---

没有找到您的问题？请 [提交 Issue](https://github.com/netease-lcap/lcap-template/issues/new)。
