# @lcap/react-template 概述

`@lcap/react-template` 是基于 React 构建的低代码平台前端项目模板。

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | React | 核心框架 |
| 构建 | 自定义脚本 | 定制化构建流程 |
| 基础 | @lcap/basic-template | 基础库支持 |

## 项目结构

```
packages/react/
├── source/              # 源代码
├── scripts/             # 构建脚本
│   ├── build.js         # 构建入口
│   ├── deploy.js        # 部署脚本
│   └── zip.js           # 打包脚本
└── package.json
```

## 快速开始

```bash
# 进入目录
cd packages/react

# 构建
pnpm build

# 部署
pnpm deploy
```

## 构建流程

```
源代码
    │
    ▼
自定义构建脚本 (build.js)
    │
    ├──► 代码处理
    ├──► 资源打包
    └──► dist/
```

## 与 basic 包集成

```typescript
import { authAPI, setConfig } from '@lcap/basic-template';

// 配置
setConfig({
  toast: { show: console.log, error: console.error },
  router: { destination: (url) => window.location.href = url }
});

// 使用 API
const user = await authAPI.getUserInfo();
```

## 开发命令

```bash
# 构建
pnpm build

# 部署
pnpm deploy
```

## 注意事项

- React 模板使用自定义构建脚本
- 依赖 `@lcap/basic-template` 提供基础能力
- 构建产物输出到 `dist/` 目录
