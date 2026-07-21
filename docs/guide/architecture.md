# 架构概览

本文档介绍 LCAP Template 的整体架构设计、技术选型和模块划分。

## 架构设计原则

LCAP Template 遵循以下设计原则：

1. **模块化分离**：基础能力与框架实现解耦
2. **渐进式采用**：按需引入，避免过度设计
3. **多框架支持**：一套基础库，多框架适配
4. **企业级就绪**：权限、路由、状态管理等开箱即用

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    LCAP Template                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Vue 2      │  │   Vue 3      │  │   React      │       │
│  │  Template    │  │  Template    │  │  Template    │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │               │
│         └────────────┬────┴─────────────────┘               │
│                      │                                      │
│         ┌────────────▼────────────┐                        │
│         │  @lcap/basic-template   │                        │
│         │  (通用基础库)            │                        │
│         └─────────────────────────┘                        │
│                      │                                      │
│         ┌────────────▼────────────┐                        │
│         │   Taro Mini Program     │                        │
│         │   (小程序端)             │                        │
│         └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo 架构

项目使用 pnpm workspaces 管理 monorepo：

```
lcap-template/
├── packages/           # 主包目录
│   ├── basic/         # 基础库
│   ├── vue2/          # Vue 2 模板
│   ├── vue3/          # Vue 3 模板
│   └── react/         # React 模板
├── mini-folder/       # 小程序相关
│   ├── taro/          # Taro 小程序
│   └── build/         # 构建配置
├── docs/              # 文档站点
└── scripts/           # 根目录脚本
```

### Workspace 配置

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "mini-folder/*"
```

### 包依赖关系

```
basic (基础库)
  │
  ├── vue2 (依赖 basic)
  ├── vue3 (依赖 basic)
  └── react (依赖 basic)

taro (独立，不依赖 basic)
```

## 技术栈详解

### @lcap/basic-template

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 构建 | Rollup | ^4.19.1 | 打包工具 |
| 测试 | Jest | ^29.7.0 | 单元测试 |
| HTTP | axios | 0.21.4 | HTTP 客户端 |
| 工具 | lodash | 4.17.21 | 工具函数库 |
| 日期 | moment | 2.30.1 | 日期处理 |
| 日期 | date-fns | 2.30.0 | 现代日期库 |
| 加密 | crypto-js | 4.2.0 | 加密解密 |
| 数值 | bignumber.js | 9.1.2 | 大数字运算 |
| 数值 | decimal.js | 10.4.3 | 精确小数计算 |

### @lcap/vue-template (Vue 2)

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 2.6.14 | 核心框架 |
| 路由 | Vue Router | 3.1.2 | 路由管理 |
| 状态 | Pinia | 2.2.8 | 状态管理 |
| 构建 | Webpack | 5.92.1 | 构建工具 |
| 语言 | TypeScript | 5.3.3 | 类型系统 |

### @lcap/vue3-template (Vue 3)

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 3.5.13 | 核心框架 |
| 路由 | Vue Router | 4.5.0 | 路由管理 |
| 状态 | Pinia | 2.3.1 | 状态管理 |
| 构建 | Rspack | 1.3.10 | Rust 构建工具 |
| 语言 | TypeScript | 5.7.3 | 类型系统 |
| 国际化 | Vue I18n | 11.1.2 | 多语言支持 |

### taro-mini-vue2

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 2.6.14 | 核心框架 |
| 小程序 | Taro | 3.6.35 | 多端框架 |
| 构建 | Webpack | 5.78.0 | 构建工具 |

## 核心模块设计

### Basic 包模块

```
src/
├── config.ts          # 配置系统
├── global.ts          # 全局状态
├── index.ts           # 入口文件
├── apis/              # API 模块
│   ├── auth/          # 认证 API
│   ├── configuration/ # 配置 API
│   ├── io/            # IO 操作
│   ├── log/           # 日志 API
│   ├── process/       # 流程 API
│   └── system/        # 系统 API
├── init/              # 初始化模块
│   ├── auth/          # 认证初始化
│   ├── dataTypes/     # 数据类型初始化
│   ├── logic/         # 逻辑初始化
│   ├── process/       # 流程初始化
│   ├── router/        # 路由初始化
│   ├── service/       # 服务初始化
│   └── utils/         # 工具初始化
├── router/            # 路由系统
├── sdk/               # SDK 工具集
├── types/             # 类型定义
└── utils/             # 工具函数
```

### 配置系统

配置系统是整个模板的核心：

```typescript
type ConfigType = {
  toast: {
    show: (message: string, stack?: string) => void;
    error: (message: string, stack?: string) => void;
  };
  router: {
    destination?: (url: string, target: string) => void;
    back?: () => void;
    go?: (delta?: number) => void;
  };
  axios: {
    interceptors: Array<any>;
  };
  globalProperties: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
  };
};
```

### 初始化流程

```
应用启动
    │
    ▼
┌─────────────┐
│ initAuth    │ 认证初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initDataTypes│ 数据类型初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initService │ 服务初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initRouter  │ 路由初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initLogic   │ 逻辑初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initProcess │ 流程初始化
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ initUtils   │ 工具初始化
└──────┬──────┘
       │
       ▼
   初始化完成
```

## 构建系统

### Turbo 构建编排

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "deploy": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

构建顺序：
1. `basic` 先构建（无依赖）
2. `vue2`、`vue3`、`react` 并行构建（依赖 basic）
3. `mini-folder` 构建

### 各包构建流程

#### basic 包

```
源代码
    │
    ├──► Rollup 打包 ──► dist/index.js (CommonJS)
    │                    dist/index.esm.js (ES Module)
    │
    └──► TypeScript ──► typings/ (类型定义)
```

#### vue2 包

```
源代码
    │
    ▼
Webpack 5
    │
    ├──► JS/CSS 打包
    ├──► 资源处理
    └──► dist/
```

#### vue3 包

```
源代码
    │
    ▼
Rspack 1.3.10
    │
    ├──► 快速构建
    ├──► 代码分割
    └──► dist/
```

## 依赖管理

### 版本统一

使用 `pnpm change:version` 统一修改版本号：

```bash
# 修改所有包的版本
pnpm change:version --version 2.2.0
```

### Workspace 协议

包间依赖使用 `workspace:*` 协议：

```json
{
  "dependencies": {
    "@lcap/basic-template": "workspace:*"
  }
}
```

优势：
- 自动链接本地包
- 版本统一管理
- 避免重复安装

## 扩展性设计

### 添加新框架支持

1. 在 `packages/` 下创建新目录
2. 依赖 `@lcap/basic-template`
3. 实现框架特定的适配层
4. 添加到 `pnpm-workspace.yaml`

### 自定义构建配置

各包独立管理构建配置：
- `basic`: `build/rollup.config.mjs`
- `vue2`: `build/webpack.config.js`
- `vue3`: `build/rspack.config.js`

## 最佳实践

1. **优先使用 basic 包**：框架无关的功能放在 basic 包
2. **遵循构建顺序**：修改 basic 包后需要重新构建
3. **使用 workspace 协议**：包间依赖必须使用 `workspace:*`
4. **保持版本一致**：使用 `change:version` 统一修改版本

## 下一步

- [basic 包文档](/packages/basic/) - 了解基础库详细设计
- [开发文档](/development/) - 学习开发流程和规范
- [常见问题](./faq) - 查看常见问题解答
