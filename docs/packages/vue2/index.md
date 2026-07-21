# @lcap/vue-template 概述

`@lcap/vue-template` 是基于 Vue 2.6 构建的低代码平台前端项目模板，集成了 LCAP（Low Code Application Platform）生态系统。

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 2.6.14 | 核心框架 |
| 路由 | Vue Router | 3.1.2 | 路由管理 |
| 状态 | Pinia | 2.2.8 | 状态管理（Vue 2 兼容版）|
| 构建 | Webpack | 5.92.1 | 构建工具 |
| 语言 | TypeScript | 5.3.3 | 类型系统 |
| 组件 | @lcap/pc-ui | - | LCAP PC 端组件库 |
| 基础 | @lcap/basic-template | workspace:* | 基础库 |

## 项目结构

```
packages/vue2/source/
├── src/
│   ├── App.vue              # 根组件
│   ├── main.js              # 应用入口
│   ├── init.js              # 平台初始化
│   ├── library.js           # 第三方库配置
│   ├── platform.config.json # 平台配置
│   ├── assets/              # 静态资源
│   ├── common/              # 公共模块
│   │   ├── directives/      # Vue 指令
│   │   ├── filters/         # Vue 过滤器
│   │   ├── mixins/          # Vue 混入
│   │   └── plugins/         # 插件系统
│   │       ├── auth/        # 权限认证
│   │       ├── dataTypes/   # 数据类型
│   │       ├── logic/       # 业务逻辑
│   │       ├── process/     # 流程处理
│   │       ├── router/      # 路由插件
│   │       ├── service/     # 服务接口
│   │       └── utils/       # 工具函数
│   ├── components/          # 业务组件
│   ├── meta-data/           # 元数据定义
│   ├── mixins/              # 全局混入
│   ├── router/              # 路由配置
│   ├── utils/               # 工具函数
│   └── views/               # 页面组件
├── types/                   # TypeScript 类型
└── lcap_modules/            # LCAP 模块
```

## 核心特性

- ✅ **Vue 2.6 生态** - 成熟的 Vue 2 技术栈
- ✅ **Pinia 状态管理** - Vue 2 兼容的 Pinia 版本
- ✅ **Webpack 5 构建** - 现代化构建工具
- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **LCAP 集成** - 低代码平台深度集成
- ✅ **插件化架构** - 可扩展的插件系统

## 快速开始

```bash
# 进入目录
cd packages/vue2

# 安装依赖
pnpm install

# 开发服务器
pnpm dev

# 构建
pnpm build
```

## 核心模块

### 1. 平台初始化 (init.js)

负责整个低代码平台的初始化，集成 Vue 实例配置、路由、状态管理等。

### 2. 元数据系统 (meta-data/)

- `dataTypesMap/` - 数据类型定义
- `enumsMap/` - 枚举类型定义
- `servicesMap/` - 服务接口定义
- `logicsMap/` - 业务逻辑定义
- `frontendEvents/` - 前端事件定义
- `frontendVariables/` - 前端变量定义

### 3. 插件系统 (common/plugins/)

- **auth** - 权限认证插件
- **dataTypes** - 数据类型处理
- **logic** - 业务逻辑插件
- **process** - 流程处理插件
- **router** - 路由插件
- **service** - 服务接口插件
- **utils** - 工具函数插件

### 4. 路由系统 (router/)

基于 Vue Router 3 的动态路由配置，支持权限控制和路由守卫。

## 开发命令

```bash
# 开发服务器
pnpm dev

# 构建生产版本
pnpm build

# ESLint 检查
pnpm lint

# Prettier 格式化
pnpm format

# 使用 git-cz 提交
pnpm git-cz

# 生成 CHANGELOG
pnpm changelog
```

## 与 basic 包的关系

```
@lcap/vue-template
    │
    ├── 依赖 @lcap/basic-template
    │       ├── API 封装
    │       ├── 工具函数
    │       └── 初始化逻辑
    │
    └── 添加 Vue 2 特定实现
            ├── Vue 组件
            ├── Vue Router 配置
            ├── Pinia Store
            └── Vue 插件
```

## 浏览器兼容性

- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 下一步

- [快速开始](./quickstart) - 5 分钟上手
- [项目结构](./structure) - 目录详解
- [核心模块](./modules) - 深入了解
- [详细示例](./examples) - 使用示例
