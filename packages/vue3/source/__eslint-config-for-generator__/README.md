# 特殊eslint配置

该目录下的配置文件是专门为代码生成器准备的 ESLint 配置，目的是在代码生成器生成代码时进行代码质量检查和规范化。

generator-fe支持的全局依赖有以下几项：

```json
"@eslint-community/regexpp": "4.12.1",
"eslint-visitor-keys": "4.2.0",
"esutils": "2.0.2",
"espree": "10.3.0",
"escape-string-regexp": "4.0.0"
```

不在上述列表中的依赖需要保证generator-fe中也有安装，否则会报错找不到模块。
