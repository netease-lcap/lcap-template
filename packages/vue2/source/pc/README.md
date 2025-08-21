## 项目概述

基于 Vue.js 2.6 构建的低代码平台前端项目，集成了 LCAP（Low Code Application Platform）生态系统，提供完整的企业级应用开发能力。

## 技术栈

### 核心技术
- **Vue.js 2.6.14** - 渐进式 JavaScript 框架
- **Vue Router 3.1.2** - 官方路由管理器
- **Pinia 2.2.8** - 状态管理库（Vue 2 兼容版本）
- **Vue I18n 8.28.2** - 国际化解决方案

### 核心依赖库
- **@lcap/pc-ui** - LCAP 平台专用 PC 端组件库
- **@lcap/basic-template** - LCAP 基础库

### 构建工具
- **Vue CLI 4.5.13** - Vue.js 官方构建工具
- **Webpack 4.47.0** - 模块打包器
- **Babel** - JavaScript 编译器

### 代码质量
- **ESLint 9.22.0** - JavaScript/Vue 代码检查
- **Prettier 3.5.3** - 代码格式化工具
- **Husky 9.1.7** - Git hooks 管理
- **Commitlint** - Git commit 规范检查

### 开发工具
- **TypeScript 5.3.3** - 类型系统支持
- **Conventional Changelog** - 自动生成变更日志

## 项目架构

### 目录结构

```
├── src/                        # 源代码目录
│   ├── App.vue                # 根组件
│   ├── main.js                # 应用入口文件
│   ├── init.js                # 平台初始化逻辑
│   ├── library.js             # 第三方库配置
│   ├── platform.config.json   # 平台配置文件
│   ├── assets/                # 静态资源
│   ├── common/                # 公共模块（基础库适配层）
│   │   ├── directives/        # Vue 指令
│   │   ├── filters/           # Vue 过滤器
│   │   ├── mixins/            # Vue 混入
│   │   └── plugins/           # 插件系统
│   ├── components/            # 业务组件
│   ├── metaData/              # 元数据定义
│   ├── mixins/                # 全局混入
│   ├── router/                # 路由配置
│   ├── utils/                 # 工具函数
│   └── views/                 # 页面组件
├── types/                     # TypeScript 类型定义
│   └── global.d.ts           # 全局类型声明
├── lcap_modules/              # LCAP 模块依赖
├── public/                    # 公共静态资源
└── 配置文件...                # 各种配置文件
```

### 核心模块

#### 1. 平台初始化 (`src/init.js`)
- 负责整个低代码平台的初始化
- 集成 Vue 实例配置、路由、状态管理等核心功能

#### 2. 元数据系统 (`src/metaData/`)
- **dataTypesMap/** - 数据类型定义
- **enumsMap/** - 枚举类型定义
- **servicesMap/** - 服务接口定义
- **logicsMap/** - 业务逻辑定义
- **frontendEvents/** - 前端事件定义
- **frontendVariables/** - 前端变量定义

#### 3. 插件系统 (`src/common/plugins/`)
- **auth/** - 权限认证插件
- **dataTypes/** - 数据类型处理插件
- **logic/** - 业务逻辑插件
- **process/** - 流程处理插件
- **router/** - 路由插件
- **service/** - 服务接口插件
- **utils/** - 工具函数插件

#### 4. 路由系统 (`src/router/`)
- 基于 Vue Router 的动态路由配置
- 支持权限控制和路由守卫
- 集成多级路由和嵌套路由

## 开发规范

### Git 提交规范
项目使用 Conventional Commits 规范：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建或辅助工具变动

### 代码规范
- 使用 ESLint + Prettier 进行代码检查和格式化
- 遵循 Vue.js 官方风格指南
- TypeScript 类型定义统一放在 `types/` 目录

## 快速开始

### 环境要求
- Node.js >= 14.x

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run serve
```

### 构建生产版本
```bash
npm run build
```

### 代码检查与格式化
```bash
# ESLint 检查并自动修复
npm run lint

# Prettier 格式化
npm run format
```

### 变更日志
> [推荐流程](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#recommended-workflow)
```bash
# 初始化
npm run changelog:init


# 生成 CHANGELOG.md
npm run changelog
```

## 部署说明

### 生产构建
```bash
npm run build
```

构建产物将输出到 `dist/` 目录，可直接部署到静态服务器。

