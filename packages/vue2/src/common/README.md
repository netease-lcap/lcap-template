## 适配层

> 封装适配Vue2的指令，混入，插件

### 指令

v-dependencies

用途：数据源依赖监听

作用：组件监听依赖项触发重新渲染

### 混入

localCacheVariableMixin

作用：前端全局变量，本地化缓存

### 插件

#### AuthPlugin

用途：权限相关功能

作用：挂载全局$auth

#### LogicsPlugin

用途：逻辑相关功能

作用：挂载全局$logics

#### ServicePlugin

用途：服务相关功能

作用：挂载全局$service

#### UtilsPlugin

用途：内置函数相关功能

作用：挂载全局$utils

#### DataTypesPlugin

用途：数据类型相关功能

作用：挂载全局$genInitFromSchema $global
