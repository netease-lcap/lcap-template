# 安装指南

本文档详细介绍 LCAP Template 的安装步骤、环境配置和验证方法。

## 系统要求

### 必需环境

| 依赖 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| Node.js | 18.0.0 | 18.x LTS | 必须使用 Node.js 18+ |
| pnpm | 8.0.0 | 9.10.0 | packageManager 指定版本 |
| Git | 2.0.0 | 最新 | 版本控制 |

### 验证环境

```bash
# 检查 Node.js 版本
node -v
# 输出: v18.x.x 或更高

# 检查 pnpm 版本
pnpm -v
# 输出: 8.x.x 或 9.x.x

# 检查 Git
git --version
```

## 安装步骤

### 1. 克隆仓库

```bash
# 使用 HTTPS
git clone https://github.com/netease-lcap/lcap-template.git

# 或使用 SSH
git clone git@github.com:netease-lcap/lcap-template.git

cd lcap-template
```

### 2. 安装依赖

```bash
# 在项目根目录执行
pnpm install
```

安装过程会：
- 安装根目录开发依赖
- 安装所有 workspace 包的依赖
- 建立包之间的软链接（workspace:* 协议）

::: tip 提示
首次安装可能需要几分钟，取决于网络状况。
:::

### 3. 验证安装

```bash
# 查看安装的包
pnpm list

# 检查 workspace 包
pnpm list --recursive --depth=0
```

## 开发环境配置

### 编辑器推荐

- **VS Code** (推荐)
  - 安装插件：Volar/Vetur、ESLint、Prettier
  - 项目已包含 `.vscode/settings.json` 配置

- **WebStorm**
  - 自动识别项目配置
  - 支持 pnpm workspaces

### Git 配置

项目使用 Husky 管理 Git hooks，已自动配置：

```bash
# 提交前会自动运行
pnpm exec lint-staged
```

提交规范遵循 Conventional Commits：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关

### 环境变量

#### 生产构建

```bash
# 启用生产模式构建
LCAP_RELEASE=1 pnpm build
```

#### 部署配置

```bash
# 部署静态资源
pnpm run deploy --platform <平台> --username <用户名> --password <密码>
```

## 包级开发环境

### basic 包

```bash
cd packages/basic

# 开发模式（监听变化并自动发布到本地）
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 生成文档
pnpm doc
```

### vue2 包

```bash
cd packages/vue2

# 开发服务器
pnpm dev

# 构建
pnpm build
```

### vue3 包

```bash
cd packages/vue3

# 构建
pnpm build
```

## 常见问题

### Q: pnpm install 失败

**问题**: 安装依赖时出现错误

**解决方案**:
```bash
# 清除缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules
rm -rf packages/*/node_modules

# 重新安装
pnpm install
```

### Q: 构建时提示找不到模块

**问题**: `@lcap/basic-template` 等 workspace 包找不到

**解决方案**:
```bash
# 确保在根目录执行构建
pnpm build

# 或者先构建 basic 包
cd packages/basic && pnpm build
```

### Q: Node.js 版本不匹配

**问题**: 提示 Node.js 版本过低

**解决方案**:
```bash
# 使用 nvm 切换版本
nvm install 18
nvm use 18

# 或使用 n
n install 18
```

### Q: Windows 下构建失败

**问题**: 路径或脚本在 Windows 下不兼容

**解决方案**:
- 使用 Git Bash 或 WSL
- 确保使用 pnpm 的 cross-platform 脚本

## 验证安装

运行以下命令验证环境配置正确：

```bash
# 1. 构建所有包
pnpm build

# 2. 运行测试
pnpm test

# 3. 检查版本
pnpm change:version --version 2.2.0
```

如果以上命令都成功执行，说明环境配置正确。

## 下一步

- [架构概览](./architecture) - 了解项目架构
- [开发文档](/development/) - 开始开发
- [basic 包文档](/packages/basic/) - 学习基础库使用
