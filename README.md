[![Node.js CI](https://github.com/netease-lcap/lcap-template/actions/workflows/test.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/test.yml)
[![Deploy Pages](https://github.com/netease-lcap/lcap-template/actions/workflows/doc.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/doc.yml)
[![Deploy Test Environment](https://github.com/netease-lcap/lcap-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/deploy.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/netease-lcap/lcap-template)

# lcap-template
> 低代码应用模板，[文档](https://netease-lcap.github.io/lcap-template/)

## 项目结构
```
|-- root
  |-- packages
      |-- basic  // 通用纯函数，不依赖框架
      |-- vue2   // Vue 2 框架应用
      |-- vue3   // Vue 3 框架应用
      |-- react  // React 框架应用
  |-- mini-folder
      |-- taro   // Taro 小程序应用
      |-- build  // 小程序构建配置
```

## 环境依赖
- Node.js >= 18
- pnpm >= 8 (packageManager: pnpm@9.10.0)

## 安装依赖
> 项目根目录下
```bash
pnpm install
```

## 常用命令

### 构建
```bash
# 构建所有包
pnpm build

# 生产构建
LCAP_RELEASE=1 pnpm build
```

### 测试
```bash
pnpm test
```

### 修改版本号
```bash
pnpm change:version --version 1.0.0
```

### 部署静态资源
```bash
pnpm run deploy --platform a --username b --password c
```

## 技术栈

| 包名 | 框架 | 构建工具 | 状态管理 |
|------|------|----------|----------|
| `@lcap/basic-template` | 无 | Rollup | 无 |
| `@lcap/vue-template` | Vue 2.6.14 | Webpack 5 | Pinia 2.2.8 |
| `@lcap/vue3-template` | Vue 3.5.13 | Rspack 1.3.10 | Pinia 2.3.1 |
| `@lcap/react-template` | React | 自定义脚本 | - |
| `taro-mini-vue2` | Vue 2.6.14 | Taro 3.6.35 | - |

## 注意事项

1. **包管理器**: 强制使用 pnpm，不要混用 npm/yarn
2. **构建顺序**: basic 包必须先构建，其他包依赖它
3. **环境变量**: `LCAP_RELEASE=1` 用于生产构建

## 相关链接

- [API 文档](https://netease-lcap.github.io/lcap-template/)
- [Agent 指南](./AGENTS.md)
