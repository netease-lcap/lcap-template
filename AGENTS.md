# AI 代理编码指南

本文档为在此低代码应用模板 monorepo 中工作的 AI 代理提供编码标准、构建命令和最佳实践。所有 AI 代理在操作此代码库时应严格遵循本指南，确保代码质量和一致性。

**重要提醒：** 本文档将仅以中文维护，所有更新和修改都应使用中文进行。

## 项目概述

**类型：** Monorepo（pnpm workspaces + Turbo）
**框架：** Vue 3, Vue 2, React 18, 小程序（Taro）
**语言：** TypeScript 5.x, JavaScript
**构建工具：** Rspack, Webpack 4, Rollup, Turbo
**测试：** Jest 29.x + ts-jest
**环境要求：** Node.js >= 18, pnpm >= 8

## 技术文档导航

详细的 Basic 包技术文档请参考：

- **[技术架构详解](docs/basic/architecture.md)** - 系统架构和核心模块
- **[使用指南](docs/basic/usage-guide.md)** - 快速上手和最佳实践
- **[API 参考](docs/basic/api-reference.md)** - 完整 API 文档

这些技术文档为 AI 代理提供：

- 完整的技术背景和架构理解
- 详细的代码示例和使用指南
- 全面的 API 接口参考
- 最佳实践和常见问题解答

## 目录结构

```
lcap-template/
├── packages/
│   ├── basic/              # 框架无关工具库（Rollup + TypeScript）
│   │   ├── src/            # 源代码（apis, init, router, sdk, types, utils）
│   │   ├── tests/          # Jest 测试文件（*.spec.js）
│   │   ├── dist/           # 构建输出
│   │   └── typings/        # 生成的 TypeScript 定义
│   ├── vue3/source/        # Vue 3 模板（Rspack 构建）
│   ├── vue2/source/        # Vue 2 模板（Vue CLI + Webpack）
│   └── react/source/       # React 模板（Rspack 构建）
└── mini-folder/taro/       # 小程序支持（Taro）
```

## 构建、测试和代码检查命令

### 根目录（Monorepo 级别）

```bash
pnpm test                    # 在所有包中运行测试
pnpm build                   # 通过 Turbo 构建所有包
pnpm deploy                  # 部署所有包
pnpm format:vue3             # 使用 Prettier 格式化 Vue 3 代码
pnpm format:react            # 使用 Prettier 格式化 React 代码
pnpm doc                     # 生成 TypeDoc 文档
```

### Basic 包（packages/basic）

```bash
npm run build                # 构建 Rollup + TypeScript 类型
npm run build:rollup         # 仅运行 Rollup 构建
npm run build:types          # 仅生成 TypeScript 声明
npm test                     # 运行带覆盖率报告的 Jest 测试
npm run dev                  # 监视模式并发布到 yalc
npm run clean                # 删除 dist/typings 目录
npm run deploy               # 部署到平台
npm run doc                  # 生成 TypeDoc 文档
```

**运行单个测试：**

```bash
# 在 packages/basic 目录中执行
npx jest tests/init/utils/list/list-sort.spec.js
npx jest -t "List sort integers"              # 按测试名称运行特定测试
npx jest --watch                               # 交互式监视模式
npx jest --coverage                            # 生成覆盖率报告
```

**详细使用指南请参考：** [Basic 包使用指南](docs/basic/usage-guide.md)

### Vue 3（packages/vue3/source）

```bash
npm run dev                  # Rspack 开发服务器带热重载
npm run build                # 生产环境构建
npm run lint                 # ESLint 自动修复
npm run format               # Prettier 代码格式化
npm run lint:style           # CSS 样式检查（Stylelint）
npm run changelog            # 生成规范化变更日志
npm run git-cz               # 使用 Commitizen 进行规范化提交
```

### Vue 2（packages/vue2/source）

```bash
npm run serve                # Vue CLI 开发服务器
npm run build                # 生产环境构建
npm run lint                 # ESLint 自动修复
npm run format               # Prettier 代码格式化
npm run lint:style           # CSS 样式检查（Stylelint）
```

### React（packages/react/source/pc）

```bash
npm run dev                  # Rspack 开发服务器
npm run build                # 生产环境构建
npm run lint                 # ESLint 自动修复
npm run format               # Prettier 代码格式化
```

## 代码风格规范

### 格式化（Prettier 配置）

- **打印宽度：** 120 个字符（.vue 文件为 300 个字符）
- **缩进：** 2 个空格（禁止使用 Tab）
- **引号：** 单引号
- **分号：** 必须使用
- **尾随逗号：** 始终添加
- **Vue 文件：** 模板中每个属性占一行

### 导入语句组织顺序

1. Node/外部模块优先
2. 框架导入（Vue, React, Pinia 等）
3. 本地工具和组件
4. 类型导入最后（使用 TypeScript 时）

示例：

```typescript
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MyComponent } from '@/components';
import type { User } from '@/types';
```

### TypeScript 编码标准

- **严格模式：** React 包中启用严格模式
- **未使用变量：** 必须处理
- **类型安全：** 优先使用显式类型而非 `any`（虽然允许使用 `any`）
- **路径别名：** 使用 `@/*` 代替 `src/*` 导入
- **编译目标：** ES6
- **模块系统：** ESNext + Node 解析

### 命名规范

- **文件名：** 组件、工具使用 kebab-case（如 `list-sort.spec.js`）
- **组件名：** PascalCase（如 `MyComponent.vue`）
- **函数名：** camelCase（如 `listSort`, `formatDateTime`）
- **常量：** 真正的常量使用 UPPER_SNAKE_CASE
- **类型/接口：** PascalCase（如 `UserProfile`）
- **测试文件：** `tests/` 目录中的 `*.spec.js`

### Vue 框架特定规则

- 组件的 data 必须是函数
- `v-for` 必须使用 `:key` 属性
- 同一元素上不要同时使用 `v-if` 和 `v-for`
- 计算属性中不要使用异步操作
- 不要重复键值或属性
- 需要时为 `v-on` 使用精确修饰符
- 使用 v-bind/v-on 简写形式（`:prop` 和 `@event`）

### React 框架特定规则

- 遵循 React Hooks 规则（通过 `eslint-plugin-react-hooks`）
- 开发中使用 React Refresh 进行热重载
- 应用 TypeScript ESLint 推荐规则
- 必要时允许使用 `@ts-ignore` 注释

### 错误处理规范

- 异步操作使用 try-catch 块
- 提供有意义的错误消息
- 适当记录错误（使用 `packages/basic/src/apis/log` 中的日志工具）
- 处理可选属性的 null/undefined 检查

示例：

```typescript
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Data fetch failed');
}
```

## 测试规范

### 测试文件结构

- **位置：** `packages/basic/tests/`
- **命名：** `*.spec.js`
- **测试框架：** Jest 29.x + ts-jest
- **测试环境：** jsdom
- **时区设置：** Asia/Shanghai

### 测试代码模式

```javascript
const utils = global.sdkUtils;

describe('功能名称', () => {
  test('具体测试用例', () => {
    const result = utils.FunctionName(input);
    expect(result).toBe(expected);
  });

  test.each([
    [input1, expected1],
    [input2, expected2],
  ])('参数化测试 %s', (input, expected) => {
    expect(utils.FunctionName(input)).toBe(expected);
  });
});
```

### 测试覆盖率要求

- 使用 `fast-check` 进行基于属性的测试（配置为 100 次运行）
- 全面覆盖边界情况
- 测试函数的同步和异步变体
- 包含 null/undefined/空输入的测试

**了解 Basic 包架构请参考：** [技术架构详解](docs/basic/architecture.md)

## Git 工作流规范

### 提交消息（规范化提交）

**格式：** `type(scope): subject`（最多 72 个字符）

**提交类型：**

- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档变更
- `style` - 代码格式化（无功能变更）
- `refactor` - 代码重构（无功能/Bug 变更）
- `perf` - 性能优化
- `test` - 添加/更新测试
- `build` - 构建系统变更
- `ci` - CI/CD 变更
- `chore` - 其他变更
- `revert` - 回退之前的提交

**规则要求：**

- Scope **必须填写**（不能为空）
- Type 必须小写
- Subject 大小写灵活

**示例：**

```bash
feat(vue3): 添加暗色模式切换组件
fix(basic): 修复 ListSort 中的空值处理
test(basic): 为日期工具函数添加边界测试
```

### 提交前钩子

- Husky 在提交前运行 `lint-staged`
- 使用 Prettier 格式化 JSON 文件
- 格式化非源码 TypeScript/JavaScript 文件

## 最佳实践

1. **提交前始终运行测试**（特别是在 basic 包中）
2. **使用 pnpm** 进行依赖管理（不要使用 npm 或 yarn）
3. **推送前运行代码检查** 以及早发现问题
4. **遵循各包中的现有代码模式**
5. **为 basic 包中的新工具函数编写测试**
6. **充分利用 TypeScript 类型系统** - 发挥类型系统优势
7. **跨所有框架使用 `packages/basic` 的共享工具**
8. **尊重框架边界** - Vue 代码放在 vue 包中，React 代码放在 react 包中
9. **用"为什么"而不是"什么"来记录复杂逻辑**
10. **保持组件小巧** 并专注于单一职责原则

**详细的最佳实践和代码示例请参考：** [Basic 包使用指南](docs/basic/usage-guide.md)

## 常见陷阱避免

- 不要混合使用 Tab 和空格（统一使用 2 个空格）
- 不要在提交消息中跳过 scope 字段
- 不要在 bash 命令中使用 `cd`（应使用 workdir 参数）
- 不要在 basic 包中未运行测试就提交代码
- 不要使用交互式 git 命令（`git add -i`, `git rebase -i`）
- 没有充分理由不要禁用 TypeScript 检查
- 不要忽略 ESLint 警告 - 应该修复它们
- 不要在没有测试的情况下创建新的工具函数
