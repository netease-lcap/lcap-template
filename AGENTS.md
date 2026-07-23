# LCAP Template - Agent Guide

> 低代码应用模板技术架构说明

## 项目结构

```
lcap-template/
├── packages/
│   ├── basic/          # 通用纯函数库，不依赖框架
│   ├── vue2/           # Vue 2 框架应用模板
│   ├── vue3/           # Vue 3 框架应用模板
│   └── react/          # React 框架应用模板
├── mini-folder/
│   ├── taro/           # Taro 小程序应用模板
│   └── build/          # 小程序构建配置
├── scripts/            # 根目录脚本
└── docs/               # 文档输出目录
```

## 技术栈

### 核心依赖
- **Node.js**: >= 18
- **pnpm**: >= 8 (packageManager: pnpm@9.10.0)
- **Turbo**: 构建编排

### 各包技术栈

| 包名 | 框架 | 构建工具 | 状态管理 | 主要依赖 |
|------|------|----------|----------|----------|
| `@lcap/basic-template` | 无 | Rollup | 无 | axios, lodash, moment |
| `@lcap/vue-template` | Vue 2.6.14 | Webpack 5 | Pinia 2.2.8 | @vue/composition-api |
| `@lcap/vue3-template` | Vue 3.5.13 | Rspack 1.3.10 | Pinia 2.3.1 | vue-router 4 |
| `@lcap/react-template` | React | 自定义脚本 | - | - |
| `taro-mini-vue2` | Vue 2.6.14 | Taro 3.6.35 | - | 小程序多端构建 |

## 常用命令

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 修改版本号
pnpm change:version --version 1.0.0

# 部署静态资源
pnpm run deploy --platform a --username b --password c
```

### 包级命令

```bash
# basic 包
cd packages/basic
pnpm build          # Rollup 构建 + 类型生成
pnpm test           # Jest 测试
pnpm doc            # TypeDoc 生成文档

# vue2 包
cd packages/vue2
pnpm build          # Webpack 构建
pnpm dev            # 开发服务器

# vue3 包
cd packages/vue3
pnpm build          # Rspack 构建
```

## 架构设计

### Monorepo 架构
- 使用 pnpm workspaces 管理
- Turbo 编排构建任务（支持依赖拓扑）
- 包间通过 `workspace:*` 引用

### 核心设计原则
1. **basic 包**: 纯函数库，框架无关，被其他包依赖
2. **框架包** (vue2/vue3/react): 依赖 basic 包，提供框架特定的模板实现
3. **小程序包**: 独立的 Taro 应用，支持多端输出

### 构建流程
```
LCAP_RELEASE=1 pnpm build
  → turbo run build (按依赖顺序)
    → basic: Rollup 打包 → dist/ + typings/
    → vue2: Webpack 构建 → dist/
    → vue3: Rspack 构建 → dist/
    → react: 自定义构建 → dist/
```

## CI/CD

### 工作流
- **test.yml**: PR 到 test/test-v* 分支时运行测试
- **build.yml**: push 到 release/* 分支时构建并上传产物
- **deploy.yml**: 部署测试环境
- **doc.yml**: 部署文档站点

### 发布流程
1. 修改版本: `pnpm change:version --version x.x.x`
2. 提交到 release/* 分支触发构建
3. 构建产物自动上传并触发后续发布流程

## 开发规范

### Git 提交
使用 Conventional Commits:
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关

### 代码风格
- Prettier 格式化
- lint-staged 在提交前自动格式化
- 类型定义统一放在 `typings/` 或 `types/` 目录

## 注意事项

1. **Node 版本**: 必须使用 Node.js 18+
2. **包管理器**: 强制使用 pnpm，不要混用 npm/yarn
3. **构建顺序**: basic 包必须先构建，其他包依赖它
4. **环境变量**: `LCAP_RELEASE=1` 用于生产构建
5. **小程序**: taro 包使用独立构建流程，与主包不共享配置

## 参考文档

- [API 文档](https://netease-lcap.github.io/lcap-template/)
- [basic 包详细文档](packages/basic/README.md)
- [vue3 包详细文档](packages/vue3/source/README.md)
