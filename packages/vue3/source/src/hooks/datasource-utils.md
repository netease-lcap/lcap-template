# 数据源工具函数

## 概述

`useDataSourceUtils` 是一个用于管理数据源缓存的 Vue3 组合式函数(Composition API Hook)。它提供了基于键值和依赖项的数据源函数缓存机制，避免重复创建相同的数据源函数，提高应用性能。

## 主要功能

### 1. 数据源缓存管理

通过 `Map` 数据结构缓存数据源函数，支持两种缓存方式：
- **简单缓存**: 仅使用 key 作为缓存标识
- **依赖缓存**: 使用 key + 依赖数组作为缓存标识

### 2. 智能依赖比较

`__isShallowEqualArray` 函数实现了智能的数组浅比较：
- 比较数组长度
- 对字符串类型进行严格相等比较
- 对对象类型使用 `lodash.isEqual` 进行深度比较
- 确保相同依赖的数据源函数被正确复用

## API

### useDataSourceUtils()

返回数据源工具对象。

**返回值:**
```javascript
{
  __getOrCreateDataSource: Function,  // 获取或创建数据源函数
  private_data_source_cache: Map      // 内部缓存实例(供调试使用)
}
```

### __getOrCreateDataSource(key, deps, newFn)

获取已缓存的数据源函数，如果不存在则创建并缓存新的函数。

**参数:**
- `key` (String): 数据源的唯一标识
- `deps` (Array): 依赖项数组，默认为空数组
- `newFn` (Function): 当缓存不存在时要创建的新函数

**返回值:**
- (Function): 缓存的或新创建的数据源函数

**示例:**
```javascript
const { __getOrCreateDataSource } = useDataSourceUtils();

// 无依赖的数据源
const dataSource1 = __getOrCreateDataSource('user-list', [], () => {
  return fetchUserList();
});

// 有依赖的数据源
const dataSource2 = __getOrCreateDataSource('user-detail', [userId], () => {
  return fetchUserDetail(userId);
});
```

## 内部方法

### __isShallowEqualArray(arr1, arr2)

比较两个数组是否浅相等。

**参数:**
- `arr1` (Array): 第一个数组
- `arr2` (Array): 第二个数组

**返回值:**
- (Boolean): 如果数组浅相等返回 true，否则返回 false

### __getDataSourceCacheFn(key, deps)

从缓存中获取数据源函数。

**参数:**
- `key` (String): 数据源标识
- `deps` (Array): 依赖项数组

**返回值:**
- (Function|undefined): 缓存的函数或 undefined

### __setDataSourceCacheFn(key, deps, fn)

设置数据源函数到缓存。

**参数:**
- `key` (String): 数据源标识
- `deps` (Array): 依赖项数组
- `fn` (Function): 要缓存的函数

## 使用场景

1. **避免重复创建数据源函数**: 在组件多次渲染时，相同的数据源配置只创建一次
2. **依赖变化时更新**: 当依赖项变化时，自动创建新的数据源函数
3. **性能优化**: 减少不必要的函数创建和内存占用

## 注意事项

- 缓存的键由 `key` 和 `deps` 共同组成
- 依赖项的比较是浅比较，对象类型会进行深度比较
- `private_data_source_cache` 属性仅供调试使用，不应在业务代码中直接访问

