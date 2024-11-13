[![Node.js CI](https://github.com/vusion-templates/lcap-template/actions/workflows/test.yml/badge.svg)](https://github.com/vusion-templates/lcap-template/actions/workflows/test.yml)

# lcap-template
> 低代码应用模板

## 项目结构
```
|-- root
  |-- packages
      |-- basic // 纯函数包
      |-- core // 通用vue框架基础包
      |-- pc // pc端业务包
      |-- h5 // h5端业务包
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
