# @lcap/vue3-template 概述

`@lcap/vue3-template` 是基于 Vue 3.5 构建的低代码平台前端项目模板，采用现代化构建工具 Rspack，提供高性能的企业级应用开发能力。

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 3.5.13 | 核心框架（最新版）|
| 路由 | Vue Router | 4.5.0 | 路由管理 |
| 状态 | Pinia | 2.3.1 | 官方状态管理 |
| 构建 | Rspack | 1.3.10 | Rust 高性能构建工具 |
| 语言 | TypeScript | 5.7.3 | 类型系统 |
| 国际化 | Vue I18n | 11.1.2 | 多语言支持 |
| 组件 | @lcap/element-plus | - | Element Plus 组件库 |
| 基础 | @lcap/basic-template | workspace:* | 基础库 |

## 项目结构

```
packages/vue3/source/
├── src/
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 应用入口
│   ├── init.ts                 # 平台初始化
│   ├── libraries.ts            # 第三方库配置
│   ├── platform.config.ts      # 平台配置
│   ├── router.ts               # 路由配置
│   ├── global.ts               # 全局配置
│   ├── i18n.ts                 # 国际化配置
│   ├── common/                 # 公共模块
│   │   ├── directives/         # Vue 指令
│   │   ├── plugins/            # 插件系统
│   │   └── router/             # 路由辅助
│   ├── components/             # 业务组件
│   ├── guards/                 # 路由守卫
│   ├── hooks/                  # 组合式函数
│   ├── meta-data/              # 元数据定义
│   ├── pages/                  # 页面组件
│   ├── store/                  # Pinia Store
│   └── utils/                  # 工具函数
├── types/                      # TypeScript 类型
└── rspack/                     # Rspack 配置
```

## 核心特性

- 🚀 **Vue 3.5 最新特性** - Composition API、`<script setup>`、性能优化
- ⚡ **Rspack 高性能构建** - Rust 编写，比 Webpack 快 10 倍
- 📦 **组合式函数** - 可复用的业务逻辑封装
- 🌍 **国际化支持** - Vue I18n 11 完整集成
- 🎨 **Element Plus** - 现代化 UI 组件库
- 🔧 **TypeScript 5.7** - 最新类型系统特性

## 快速开始

```bash
# 进入目录
cd packages/vue3

# 安装依赖（postinstall 会自动执行）
pnpm install

# 构建
pnpm build
```

## 核心模块

### 1. 组合式函数 (hooks/)

```typescript
// 使用组合式函数
import { useDataPermission } from '@/hooks/data-permission';

const { checkPermission } = useDataPermission();
```

可用的 hooks：
- `data-permission.js` - 数据权限管理
- `datasource-utils.js` - 数据源工具
- `element-state-prop.js` - 元素状态属性
- `enhanced-css.js` - 增强样式处理
- `keyboard-event.js` - 键盘事件
- `refs.js` - 引用管理
- `watch-props.js` - 属性监听

### 2. 路由守卫 (guards/)

```typescript
// 路由守卫配置
import { createRouter } from 'vue-router';
import { setupRouterGuard } from './guards';

const router = createRouter({...});
setupRouterGuard(router);
```

### 3. 状态管理 (store/)

```typescript
// 使用 Pinia
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();
globalStore.setUserInfo(userInfo);
```

## 开发命令

```bash
# 构建
pnpm build

# ESLint 检查
pnpm lint

# Stylelint 检查
pnpm lint:style

# Prettier 格式化
pnpm format

# 使用 git-cz 提交
pnpm git-cz

# 生成 CHANGELOG
pnpm changelog
```

## 与 Vue 2 版本的区别

| 特性 | Vue 2 版本 | Vue 3 版本 |
|------|-----------|-----------|
| Vue 版本 | 2.6.14 | 3.5.13 |
| 构建工具 | Webpack 5 | Rspack 1.3.10 |
| 状态管理 | Pinia 2.2.8 | Pinia 2.3.1 |
| API 风格 | Options API | Composition API |
| TypeScript | 5.3.3 | 5.7.3 |
| 路由 | Vue Router 3 | Vue Router 4 |
| 国际化 | Vue I18n 8 | Vue I18n 11 |
| 构建速度 | 中等 | 极快 |

## 性能优化

- **Rspack 构建** - 比 Webpack 快 10 倍
- **代码分割** - 自动按需加载
- **Tree Shaking** - 消除未使用代码
- **缓存策略** - 持久化缓存加速二次构建

## 下一步

- [快速开始](./quickstart) - 5 分钟上手
- [项目结构](./structure) - 目录详解
- [核心模块](./modules) - 深入了解
- [详细示例](./examples) - 使用示例
