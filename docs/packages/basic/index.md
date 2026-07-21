# @lcap/basic-template 概述

`@lcap/basic-template` 是 LCAP Template 的核心基础库，提供框架无关的通用功能，包括 API 封装、工具函数、初始化模块等。

## 功能特性

- **🚀 框架无关** - 纯函数实现，可在任何 JavaScript/TypeScript 项目中使用
- **📦 模块化设计** - API、工具、初始化等功能模块分离
- **🔧 企业级 API** - 认证、配置、日志、流程等完整 API 封装
- **🛠️ 丰富工具集** - Cookie、存储、路由、编码等常用工具
- **📘 完整类型** - TypeScript 类型定义，IDE 智能提示
- **✅ 单元测试** - Jest 测试覆盖，保证代码质量

## 适用场景

- **低代码平台集成** - 作为 LCAP 平台的基础依赖
- **企业应用开发** - 提供认证、权限、流程等企业级功能
- **工具库使用** - 单独使用工具函数和 API 封装
- **多框架支持** - 为 Vue、React 等框架提供基础能力

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 构建 | Rollup | ^4.19.1 | 打包工具，输出 CommonJS 和 ES Module |
| 测试 | Jest | ^29.7.0 | 单元测试框架 |
| HTTP | axios | 0.21.4 | HTTP 客户端，请求封装 |
| 工具 | lodash | 4.17.21 | 工具函数库 |
| 日期 | moment | 2.30.1 | 日期时间处理 |
| 日期 | date-fns | 2.30.0 | 现代日期库 |
| 加密 | crypto-js | 4.2.0 | 加密解密功能 |
| 数值 | bignumber.js | 9.1.2 | 大数字精确计算 |
| 数值 | decimal.js | 10.4.3 | 精确小数计算 |

## 模块结构

```
src/
├── config.ts          # 配置系统 - 全局配置管理
├── global.ts          # 全局状态 - 兼容 Vue 生态
├── index.ts           # 入口文件 - 导出所有模块
├── apis/              # API 模块
│   ├── auth/          # 认证 API - 登录、登出、Token
│   ├── configuration/ # 配置 API - 系统配置获取
│   ├── io/            # IO API - 文件上传下载
│   ├── log/           # 日志 API - 操作日志、错误日志
│   ├── lowauth/       # 低权限认证 API
│   ├── process/       # 流程 API V1 - 工作流
│   ├── processV2/     # 流程 API V2 - 增强版
│   └── system/        # 系统 API - 系统信息
├── init/              # 初始化模块
│   ├── auth/          # 认证初始化
│   ├── dataTypes/     # 数据类型初始化
│   ├── logic/         # 逻辑初始化
│   ├── process/       # 流程初始化
│   ├── router/        # 路由初始化
│   ├── service/       # 服务初始化
│   └── utils/         # 工具初始化
├── router/            # 路由系统 - 路由守卫
├── sdk/               # SDK 工具集 - 格式化器等
├── types/             # 类型定义
└── utils/             # 工具函数
    ├── cookie.ts      # Cookie 操作
    ├── localStorage.ts # 本地存储
    ├── route.ts       # 路由工具
    ├── encodeUrl.ts   # URL 编码
    ├── create/        # 创建工具
    ├── json-bigint/   # 大数字 JSON 处理
    └── request-pre/   # 请求预处理中间件
```

## 快速示例

### 基础配置

```typescript
import { setConfig } from '@lcap/basic-template';

setConfig({
  toast: {
    show: (message) => console.log(message),
    error: (message) => console.error(message)
  },
  router: {
    destination: (url, target) => window.open(url, target),
    back: () => window.history.back()
  },
  globalProperties: {
    set: (key, value) => window[key] = value,
    get: (key) => window[key]
  }
});
```

### 用户认证

```typescript
import { authAPI } from '@lcap/basic-template';

// 登录
const result = await authAPI.login({
  username: 'admin',
  password: '123456'
});

// 登出
await authAPI.logout();

// 获取当前用户
const user = await authAPI.getUserInfo();
```

### 工具函数

```typescript
import { cookie, localStorage } from '@lcap/basic-template';

// Cookie 操作
cookie.set('token', 'abc123', { expires: 7 });
const token = cookie.get('token');
cookie.remove('token');

// 本地存储
localStorage.setItem('user', { name: 'admin' });
const user = localStorage.getItem('user');
localStorage.removeItem('user');
```

## 安装使用

### 单独使用

```bash
npm install @lcap/basic-template
# 或
yarn add @lcap/basic-template
# 或
pnpm add @lcap/basic-template
```

### 在 LCAP 项目中

basic 包已作为依赖包含在 vue2/vue3/react 包中：

```json
{
  "dependencies": {
    "@lcap/basic-template": "workspace:*"
  }
}
```

## API 文档

完整的 API 文档由 TypeDoc 自动生成：

- [在线 API 文档](https://netease-lcap.github.io/lcap-template/)
- 本地生成：`cd packages/basic && pnpm doc`

## 下一步

- [快速开始](./quickstart) - 5 分钟上手教程
- [配置系统](./config) - 深入了解配置机制
- [API 模块](./apis) - 学习各 API 模块使用
- [工具函数](./utils) - 掌握工具函数使用
- [详细示例](./examples) - 完整使用场景示例
