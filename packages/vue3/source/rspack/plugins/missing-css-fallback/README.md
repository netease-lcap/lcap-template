# Missing CSS Fallback Plugin for rspack

## 概述

`MissingCssFallbackPlugin` 是一个自定义的 rspack 插件，用于处理不存在的 CSS 文件引用。当项目中导入的 CSS 文件不存在时，该插件会自动提供空的 CSS 内容作为回退，避免构建失败。

## 功能特性

- ✅ 自动检测不存在的 CSS 文件（特别是 `dist-theme/index.css` 模式）
- ✅ 提供空的 CSS 内容作为回退
- ✅ 支持自定义匹配模式和回退内容
- ✅ 自动清理临时文件
- ✅ 同时支持开发模式和生产构建

## 使用方法

### 1. 基础配置

在 `rspack.config.js` 中引入并使用插件：

```javascript
const MissingCssFallbackPlugin = require('./rspack/plugins/missing-css-fallback');

module.exports = defineConfig({
  // ... 其他配置
  plugins: [
    // 其他插件...
    
    // Missing CSS Fallback Plugin
    new MissingCssFallbackPlugin({
      pattern: /\/dist-theme\/index\.css$/,
      fallbackContent: '/* CSS theme file not found, using empty fallback */'
    }),
    
    // 其他插件...
  ],
});
```

### 2. 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `pattern` | RegExp | `/\/dist-theme\/index\.css$/` | 用于匹配需要处理的 CSS 文件路径的正则表达式 |
| `fallbackContent` | string | `'/* CSS file not found, using empty fallback */'` | 当文件不存在时使用的空 CSS 内容 |

### 3. 自定义配置示例

```javascript
// 处理多种 CSS 文件模式
new MissingCssFallbackPlugin({
  pattern: /\/(dist-theme|themes?|styles?)\/index\.css$/,
  fallbackContent: `
/* CSS file not found - auto-generated fallback */
/* This is a placeholder for missing CSS theme files */
`
})

// 只处理特定的模块
new MissingCssFallbackPlugin({
  pattern: /^(lcap_oauth_client|lcap_.*_client)\/dist-theme\/index\.css$/,
  fallbackContent: '/* LCAP theme fallback */'
})
```

## 工作原理

1. **模块解析拦截**：插件使用 rspack 的 `NormalModuleReplacementPlugin` 来拦截模块解析过程
2. **文件存在检查**：当遇到匹配模式的 CSS 导入时，检查文件是否实际存在
3. **创建临时文件**：如果文件不存在，创建一个包含空内容的临时 CSS 文件
4. **模块替换**：将原始请求替换为指向临时文件的请求
5. **自动清理**：构建完成后自动删除临时文件

## 适用场景

- 模块化项目中某些可选的主题 CSS 文件可能不存在
- 第三方库的主题文件在某些环境下缺失
- 条件性的样式导入，避免因文件不存在导致构建失败
- 开发环境中临时禁用某些样式文件

## 日志输出

插件会在控制台输出有用的信息：

```
[MissingCssFallbackPlugin] CSS file not found: lcap_oauth_client/dist-theme/index.css, using empty fallback
```

这有助于开发者了解哪些 CSS 文件被替换为空内容。

## 注意事项

1. **性能影响**：插件会在每次构建时检查文件存在性，但影响很小
2. **临时文件**：插件会在 `node_modules/.cache/` 目录下创建临时文件，构建后会自动清理
3. **匹配精度**：建议使用精确的正则表达式模式，避免误匹配其他重要的 CSS 文件
4. **开发调试**：在开发模式下，控制台日志可以帮助识别哪些文件被替换

## 故障排除

### 问题：插件没有生效

**解决方案**：
1. 确保插件在其他可能影响模块解析的插件之前添加
2. 检查正则表达式模式是否正确匹配目标文件
3. 查看控制台输出确认插件是否被调用

### 问题：临时文件没有被清理

**解决方案**：
- 插件会自动清理临时文件，如果遇到问题可以手动删除 `node_modules/.cache/missing-css-*.css` 文件

## 兼容性

- ✅ rspack 1.x
- ✅ Node.js 16+
- ✅ 支持所有现代浏览器