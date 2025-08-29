const fs = require('fs')
const path = require('path')


// 读取生成的 CHANGELOG.md
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md')

if (!fs.existsSync(changelogPath)) {
  console.error('CHANGELOG.md not found')
  process.exit(1)
}

let content = fs.readFileSync(changelogPath, 'utf8')

// 类型映射
const typeMap = {
  'feat': '新增',
  'fix': '修复',
  'perf': '优化',
  'refactor': '重构',
  'docs': '文档',
  'style': '样式',
  'test': '测试',
  'build': '构建',
  'ci': 'CI',
  'chore': '其他',
  'revert': '撤销'
}

// 解析并重新格式化
const lines = content.split('\n')
let result = ['# 更新日志', '']
let currentVersion = ''
let currentDate = ''
let commits = {}
let breakingChanges = []
let inBreakingChanges = false

for (let line of lines) {
  // 匹配版本行
  const versionMatch = line.match(/^## (.+) \((.+)\)$/)
  if (versionMatch) {
    // 输出上一个版本的内容
    if (currentVersion) {
      outputVersion()
    }

    currentVersion = versionMatch[1]
    currentDate = versionMatch[2]
    commits = {}
    breakingChanges = []
    inBreakingChanges = false
    continue
  }

  // 检查是否进入 BREAKING CHANGE 部分
  if (line.startsWith('### BREAKING CHANGE')) {
    inBreakingChanges = true
    continue
  }

  if (inBreakingChanges) {
    if (line.startsWith('* ')) {
      breakingChanges.push(line.substring(2))
    }
    continue
  }

  // 匹配提交信息
  const commitMatch = line.match(/^\* (feat|fix|perf|refactor|docs|style|test|build|ci|chore|revert)(?:\([^)]*\))?: (.+)$/)
  if (commitMatch) {
    const type = commitMatch[1]
    let message = commitMatch[2]

    // 清理消息格式，但保留链接信息
    message = message.replace(/^[🎸💄🐛📝✨🔧⚡️🚚✅🔥💚👷🔀⏪\s]+/, '') // 移除emoji
    // 不再移除链接信息，保留 conventional-changelog 生成的链接

    const chineseType = typeMap[type] || '其他'

    if (!commits[chineseType]) {
      commits[chineseType] = []
    }
    commits[chineseType].push(`- ${message}`)
  }
}

// 输出最后一个版本
if (currentVersion) {
  outputVersion()
}

function outputVersion() {
  result.push(`## [${currentVersion}] (${currentDate})`)
  result.push('')

  // 按照指定顺序输出分类
  const order = ['新增', '修复', '优化', '重构', '文档', '样式', '测试', '构建', 'CI', '其他', '撤销']

  for (const type of order) {
    if (commits[type] && commits[type].length > 0) {
      result.push(`### ${type}`)
      result.push('')
      commits[type].forEach(commit => {
        result.push(commit)
      })
      result.push('')
    }
  }

  // 如果有 breaking changes
  if (breakingChanges.length > 0) {
    result.push('### BREAKING CHANGES')
    result.push('')
    breakingChanges.forEach(change => {
      result.push(`- ${change}`)
    })
    result.push('')
  }
}

// 写回文件
fs.writeFileSync(changelogPath, result.join('\n'), 'utf8')
console.log('✅ CHANGELOG.md 已成功格式化为中文版本！')
