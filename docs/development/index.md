# 开发环境搭建

本文档介绍如何搭建 LCAP Template 的开发环境。

## 系统要求

### 必需环境

| 依赖 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 18.0.0 | 18.x LTS |
| pnpm | 8.0.0 | 9.10.0 |
| Git | 2.0.0 | 最新 |

### 验证环境

```bash
# 检查 Node.js
node -v

# 检查 pnpm
pnpm -v

# 检查 Git
git --version
```

## 环境安装

### 安装 Node.js

**使用 nvm（推荐）:**

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装 Node.js 18
nvm install 18
nvm use 18

# 设置默认版本
nvm alias default 18
```

**使用官方安装包:**

访问 [nodejs.org](https://nodejs.org/) 下载 LTS 版本安装包。

### 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 验证安装
pnpm -v
```

## 项目设置

### 1. 克隆仓库

```bash
# 克隆项目
git clone https://github.com/netease-lcap/lcap-template.git

# 进入目录
cd lcap-template
```

### 2. 安装依赖

```bash
# 安装所有依赖
pnpm install
```

这将安装：
- 根目录开发依赖
- 所有 workspace 包的依赖
- 建立包之间的软链接

### 3. 验证安装

```bash
# 查看安装的包
pnpm list

# 检查 workspace
pnpm list --recursive --depth=0
```

## 编辑器配置

### VS Code（推荐）

**必需插件:**

- **Volar** - Vue 3 支持
- **Vetur** - Vue 2 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript Importer** - 自动导入

**推荐设置:**

项目已包含 `.vscode/settings.json`，包含：
- 保存时自动格式化
- ESLint 自动修复
- TypeScript 配置

### WebStorm

WebStorm 会自动识别项目配置，无需额外设置。

## 开发准备

### 构建项目

```bash
# 构建所有包
pnpm build
```

### 运行测试

```bash
# 运行所有测试
pnpm test
```

### Git 配置

项目使用 Husky 管理 Git hooks：

```bash
# 确保 husky 已安装
pnpm exec husky --version

# 钩子会自动在提交前运行 lint-staged
```

## 常见问题

### Q: pnpm install 失败

```bash
# 清除缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules packages/*/node_modules

# 重新安装
pnpm install
```

### Q: 构建失败

```bash
# 确保 Node.js 版本正确
node -v  # >= 18

# 先构建 basic 包
cd packages/basic && pnpm build

# 回到根目录重新构建
cd ../.. && pnpm build
```

## 下一步

- [工作流程](./workflow) - 了解开发流程
- [构建说明](./build) - 学习构建系统
- [测试指南](./test) - 掌握测试方法
