# 快速开始

欢迎使用 LCAP Template！本指南将帮助您在 5 分钟内了解项目并开始使用。

## 什么是 LCAP Template？

LCAP Template 是一个面向低代码应用平台（LCAP）的前端模板集合，提供多框架支持的企业级应用开发解决方案。

### 核心特性

- **多框架支持**：Vue 2、Vue 3、React 三大主流框架
- **模块化架构**：基础包与框架包分离，按需使用
- **企业级功能**：权限、路由、状态管理、流程处理
- **高性能构建**：Rspack/Webpack 5 现代化构建
- **小程序支持**：Taro 多端小程序解决方案

## 5 分钟快速上手

### 1. 环境准备

确保您的开发环境满足以下要求：

- **Node.js**: >= 18
- **pnpm**: >= 8 (packageManager: pnpm@9.10.0)

```bash
# 检查 Node.js 版本
node -v

# 检查 pnpm 版本
pnpm -v
```

### 2. 克隆项目

```bash
git clone https://github.com/netease-lcap/lcap-template.git
cd lcap-template
```

### 3. 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

::: warning 注意
必须使用 pnpm，不要混用 npm 或 yarn，因为项目使用 pnpm workspaces 管理 monorepo。
:::

### 4. 构建项目

```bash
# 构建所有包
pnpm build
```

构建顺序由 Turbo 自动管理：
1. `basic` 包先构建（其他包依赖它）
2. `vue2`、`vue3`、`react` 并行构建
3. `mini-folder` 构建

### 5. 运行测试

```bash
# 运行所有包的测试
pnpm test
```

## 包结构说明

### @lcap/basic-template

通用纯函数库，不依赖任何框架，提供：
- API 封装（认证、配置、日志、流程等）
- 工具函数（Cookie、存储、路由、编码等）
- 初始化模块

### @lcap/vue-template

Vue 2 框架应用模板：
- Vue 2.6.14 + Vue Router 3 + Pinia 2.2.8
- Webpack 5 构建
- 完整的低代码平台集成

### @lcap/vue3-template

Vue 3 框架应用模板：
- Vue 3.5.13 + Vue Router 4 + Pinia 2.3.1
- Rspack 1.3.10 高性能构建
- 组合式 API 支持

### @lcap/react-template

React 框架应用模板：
- React 生态
- 自定义构建脚本

### taro-mini-vue2

Taro 小程序应用模板：
- Vue 2.6.14 + Taro 3.6.35
- 支持微信、支付宝、百度、字节跳动等多端

## 下一步

- [安装指南](./installation) - 详细的安装和配置说明
- [架构概览](./architecture) - 了解项目架构和设计思想
- [basic 包文档](/packages/basic/) - 学习基础库的使用
- [开发文档](/development/) - 参与项目开发

## 常见问题

**Q: 为什么必须使用 pnpm？**  
A: 项目使用 pnpm workspaces 管理 monorepo，支持 workspace:* 依赖协议和依赖去重。

**Q: 构建失败怎么办？**  
A: 确保 Node.js >= 18，删除 node_modules 重新安装，检查 basic 包是否成功构建。

**Q: 如何只构建单个包？**  
A: 进入对应包目录运行 `pnpm build`，例如 `cd packages/basic && pnpm build`。
