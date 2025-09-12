[![Node.js CI](https://github.com/netease-lcap/lcap-template/actions/workflows/test.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/test.yml)
[![Deploy Pages](https://github.com/netease-lcap/lcap-template/actions/workflows/doc.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/doc.yml)
[![Deploy Test Environment](https://github.com/netease-lcap/lcap-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/netease-lcap/lcap-template/actions/workflows/deploy.yml)

# lcap-template
> 低代码应用模板

## 项目结构
```
|-- root
  |-- packages
      |-- basic // 通用纯函数，不依赖框架
      |-- vue2 // vue2框架应用
```

## 环境依赖
- nodejs 18
- pnpm 8

## 安装依赖
> 项目根目录下
```
pnpm install
```

## 本地发布静态资源
> 根目录下
```
pnpm build

pnpm run deploy --platform a --username b --password c
```

## 修改版本号方式
> 根目录下
```
pnpm change:version --version 1.0.0
```
