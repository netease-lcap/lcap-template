## 项目概述

基于 Vue.js 3.5 构建的低代码平台前端项目，集成了 LCAP（Low Code Application Platform）生态系统，提供完整的企业级应用开发能力。采用现代化构建工具 Rspack 实现高性能构建。

## 技术栈

### 核心技术
- **Vue.js 3.5.13** - 渐进式 JavaScript 框架
- **Vue Router 4.5.0** - 官方路由管理器
- **Pinia 2.3.1** - 官方状态管理库
- **Vue I18n 11.1.2** - 国际化解决方案

### 核心依赖库
- **@lcap/element-plus** - LCAP 平台 Element Plus 组件库
- **@lcap/basic-template** - LCAP 基础模板库
- **@lcap/ui-libraries-mcp** - LCAP UI 库 MCP 集成
- **date-fns 2.30.0** - 现代化日期工具库
- **lodash 4.17.21** - JavaScript 工具库

### 构建工具
- **Rspack 1.3.10** - 高性能 Rust 打包工具
- **Vue Loader 17.4.2** - Vue 单文件组件加载器

### 代码质量
- **ESLint 9.22.0** - JavaScript/Vue 代码检查
- **Prettier 3.5.3** - 代码格式化工具
- **Stylelint 16.23.0** - CSS 代码检查
- **Husky 9.1.7** - Git hooks 管理
- **Commitlint** - Git commit 规范检查

### 开发工具
- **TypeScript 5.7.3** - 类型系统支持
- **Vue TSC 2.1.10** - Vue TypeScript 类型检查
- **Conventional Changelog** - 自动生成变更日志

## 项目架构
> 全局类型声明[文档](https://netease-lcap.github.io/lcap-template/)

### 目录结构

```
├── src/                        # 源代码目录
│   ├── App.vue                # 根组件
│   ├── main.ts                # 应用入口文件
│   ├── init.ts                # 平台初始化逻辑
│   ├── libraries.ts           # 第三方库配置
│   ├── platform.config.ts     # 平台配置文件
│   ├── router.ts              # 路由配置
│   ├── global.ts              # 全局配置
│   ├── global-variables.ts    # 全局变量
│   ├── helper.ts              # 帮助函数
│   ├── i18n.ts                # 国际化配置
│   ├── index.css              # 全局样式
│   ├── common/                # 公共模块（基础库适配层）
│   │   ├── directives/        # Vue 指令
│   │   ├── plugins/           # 插件系统
│   │   │   ├── auth/          # 权限认证插件
│   │   │   ├── data-types/    # 数据类型处理插件
│   │   │   ├── logic/         # 业务逻辑插件
│   │   │   ├── process/       # 流程处理插件
│   │   │   ├── router/        # 路由插件
│   │   │   ├── service/       # 服务接口插件
│   │   │   └── utils/         # 工具函数插件
│   │   ├── router/            # 路由辅助模块
│   │   └── utils.js           # 通用工具函数
│   ├── components/            # 业务组件
│   ├── guards/                # 路由守卫
│   │   ├── index.ts           # 守卫入口
│   │   └── title.ts           # 页面标题守卫
│   ├── hooks/                 # Vue 组合式函数
│   │   ├── data-permission.js # 数据权限 Hook
│   │   ├── datasource-utils.js # 数据源工具 Hook
│   │   ├── element-state-prop.js # 元素状态属性 Hook
│   │   ├── enhanced-css.js    # 增强样式 Hook
│   │   ├── keyboard-event.js  # 键盘事件 Hook
│   │   ├── refs.js            # 引用管理 Hook
│   │   └── watch-props.js     # 属性监听 Hook
│   ├── language/              # 多语言
│   │   ├── index.ts           # 语言配置入口
│   │   └── messages/          # 语言包
│   ├── meta-data/             # 元数据定义
│   │   ├── data-types-map.ts  # 数据类型映射
│   │   ├── enums-map.ts       # 枚举类型映射
│   │   ├── frontend-events.ts # 前端事件定义
│   │   ├── frontend-variables.ts # 前端变量定义
│   │   ├── data-types-map/    # 数据类型详细定义
│   │   ├── enums-map/         # 枚举类型详细定义
│   │   └── frontend-events/   # 前端事件详细定义
│   ├── pages/                 # 页面组件
│   │   ├── index.vue          # 首页
│   │   ├── login.vue          # 登录页
│   │   ├── dashboard.vue      # 仪表盘
│   │   ├── permission-center.vue # 权限中心
│   │   ├── no-auth.vue        # 无权限页
│   │   ├── not-found.vue      # 404页面
│   │   └── ...                # 其他页面
│   ├── plugins/               # 自定义插件
│   │   ├── data-types/        # 数据类型插件
│   │   └── router/            # 路由插件
│   ├── store/                 # 状态管理
│   │   ├── index.ts           # Store 入口
│   │   └── global.ts          # 全局 Store
│   ├── style/                 # 样式文件
│   │   └── theme.css          # 主题样式
│   └── utils/                 # 工具函数
│       └── index.ts           # 工具函数入口
├── types/                     # TypeScript 类型定义
│   └── global.d.ts           # 全局类型声明
├── lcap_modules/              # LCAP 模块依赖
│   └── @lcap/                # LCAP 官方模块
├── public/                    # 公共静态资源
│   └── assets/               # 静态资源文件
├── rspack/                    # Rspack 配置
│   └── plugins/              # 自定义插件
│       ├── lcap.js           # LCAP 插件
│       └── missing-css-fallback/ # CSS 降级插件
├── scripts/                   # 脚本文件
│   ├── format-changelog.js   # 格式化变更日志
│   ├── generateSwcImportPluginConfig.js # 生成 SWC 配置
│   └── postinstall.js        # 安装后脚本
├── __eslint-config-for-generator__/ # ESLint 生成器配置
├── eslint-config/            # ESLint 规则配置
└── 配置文件...               # 各种配置文件
```

### 核心模块

#### 1. 平台初始化 (`src/init.ts`)
- 负责整个低代码平台的初始化
- 集成 Vue 实例配置、路由、状态管理等核心功能
- 支持微前端集成（ICESTARK）

#### 2. 元数据系统 (`src/meta-data/`)
- **data-types-map/** - 数据类型定义
- **enums-map/** - 枚举类型定义
- **frontend-events/** - 前端事件定义
- **frontend-variables/** - 前端变量定义

#### 3. 插件系统 (`src/common/plugins/`)
- **auth/** - 权限认证插件
- **data-types/** - 数据类型处理插件
- **logic/** - 业务逻辑插件
- **process/** - 流程处理插件
- **router/** - 路由插件
- **service/** - 服务接口插件
- **utils/** - 工具函数插件

#### 4. 路由系统 (`src/router.ts` & `src/common/router/`)
- 基于 Vue Router 4 的动态路由配置
- 支持权限控制和路由守卫
- 集成多级路由和嵌套路由
- 页面标题自动管理

#### 5. 状态管理 (`src/store/`)
- 使用 Pinia 进行状态管理
- 全局状态统一管理
- 支持模块化 Store 配置

#### 6. Hooks 系统 (`src/hooks/`)
- 数据权限管理
- 数据源工具
- 元素状态属性管理
- 增强样式处理
- 键盘事件处理
- 引用管理
- 属性监听

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
- `perf:` 性能优化

### 代码规范
- 使用 ESLint + Prettier 进行代码检查和格式化
- 使用 Stylelint 进行 CSS 代码检查
- 遵循 Vue.js 3 官方风格指南
- TypeScript 类型定义统一放在 `types/` 目录

## 快速开始

### 环境要求
- Node.js >= 22.x
- pnpm (推荐) 或 npm

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 代码检查与格式化
```bash
# ESLint 检查并自动修复
pnpm lint

# CSS 代码检查
pnpm lint:style

# Prettier 格式化
pnpm format
```

### 代码提交
> 使用 git-cz 提交代码, 便于生成规范的 changelog
```bash
# 使用 git-cz 提交代码
pnpm git-cz
```

### 变更日志
> [推荐流程](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog#recommended-workflow)
```bash
# 生成 CHANGELOG.md
pnpm changelog
```

## 部署说明

### 生产构建
```bash
pnpm build
```

构建产物将输出到 `dist/` 目录，可直接部署到静态服务器。

### 构建配置
- 构建工具：Rspack
- 支持代码分割和懒加载
- 自动处理静态资源
- 支持 publicPath 配置

## 特性说明

### 微前端支持
项目内置 ICESTARK 微前端集成支持，可作为子应用嵌入到主应用中。

### 国际化
- 使用 Vue I18n 11 实现国际化
- 支持动态切换语言
- 语言包统一管理

### 性能优化
- 使用 Rspack 实现快速构建
- 支持按需加载
- 代码分割优化
- 静态资源优化

### 权限管理
- 完整的权限认证体系
- 路由级别权限控制
- 数据级别权限控制
