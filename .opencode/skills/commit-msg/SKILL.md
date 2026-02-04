---
name: commit-msg
description: 生成符合规范的 Git 提交信息
version: 1.0.0
locale: zh-CN
---

# Commit Message 规范 Skill

## 目标

- 生成符合项目约定的提交信息。
- 输出简洁、可复用、可自动化校验的提交消息。

## 适用范围

- 本仓库所有包与脚本的 Git 提交信息。

## 适用时机

- 准备提交代码前，需要生成规范化提交信息时。
- 在提交前校验或补全提交信息格式时。
- 编写变更说明、发版记录或自动化脚本需要规范提交信息时。

## 规范格式

提交信息必须遵循：

```
type(scope): subject
```

### 规则

- **type 必填**，且必须为小写。
- **scope 必填**，不能为空。
- **subject** 简洁描述变更，建议不超过 72 个字符。
- 不要以句号结尾。
- 不在 subject 中使用过多无意义词（如“更新”“修改”）。

### 支持的 type

- feat：新功能
- fix：Bug 修复
- docs：文档变更
- style：代码格式化（无功能变更）
- refactor：代码重构（无功能/Bug 变更）
- perf：性能优化
- test：添加/更新测试
- build：构建系统变更
- ci：CI/CD 变更
- chore：其他变更
- revert：回退之前的提交

## scope 指引

- scope 使用包名或模块名（如 `basic`、`vue3`、`react`、`mini`、`scripts`）。
- 若为基础库内模块，可细化为 `basic:utils`、`basic:router` 等。
- 若跨多个模块，优先使用影响范围最大的包名。

## 示例

- feat(vue3): 添加暗色模式切换组件
- fix(basic): 修复 ListSort 中的空值处理
- test(basic): 为日期工具函数添加边界测试
- chore(scripts): 更新发布脚本配置

## 生成流程（建议）

1. 明确变更类型（type）。
2. 确定影响范围（scope）。
3. 用动词短语编写 subject（中文或英文均可，保持统一）。

## 输出要求

- 仅输出最终提交信息，不附加解释。
- 若无法确定 scope，选择最接近的包名。
- 若存在多个变更类型，以**影响最大**的类型为准。

## 约束

- 不生成多行提交信息。
- 不生成 “WIP”“temp” 等临时提交信息。
