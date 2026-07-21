import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LCAP Template',
  description: '低代码应用模板 - 支持 Vue2/Vue3/React 的多框架前端解决方案',
  lang: 'zh-CN',
  
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { 
        text: '组件包', 
        items: [
          { text: 'basic', link: '/packages/basic/' },
          { text: 'vue2', link: '/packages/vue2/' },
          { text: 'vue3', link: '/packages/vue3/' },
          { text: 'react', link: '/packages/react/' },
          { text: 'taro', link: '/packages/taro/' }
        ]
      },
      { text: '开发文档', link: '/development/' },
      { text: 'GitHub', link: 'https://github.com/netease-lcap/lcap-template' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '安装指南', link: '/guide/installation' },
            { text: '架构概览', link: '/guide/architecture' },
            { text: '常见问题', link: '/guide/faq' }
          ]
        }
      ],
      '/packages/basic/': [
        {
          text: '@lcap/basic-template',
          items: [
            { text: '概述', link: '/packages/basic/' },
            { text: '快速开始', link: '/packages/basic/quickstart' },
            { text: '配置系统', link: '/packages/basic/config' },
            { text: 'API 模块', link: '/packages/basic/apis' },
            { text: '工具函数', link: '/packages/basic/utils' },
            { text: '初始化', link: '/packages/basic/init' },
            { text: '详细示例', link: '/packages/basic/examples' }
          ]
        }
      ],
      '/packages/vue2/': [
        {
          text: '@lcap/vue-template',
          items: [
            { text: '概述', link: '/packages/vue2/' },
            { text: '快速开始', link: '/packages/vue2/quickstart' },
            { text: '项目结构', link: '/packages/vue2/structure' },
            { text: '核心模块', link: '/packages/vue2/modules' },
            { text: '详细示例', link: '/packages/vue2/examples' }
          ]
        }
      ],
      '/packages/vue3/': [
        {
          text: '@lcap/vue3-template',
          items: [
            { text: '概述', link: '/packages/vue3/' },
            { text: '快速开始', link: '/packages/vue3/quickstart' },
            { text: '项目结构', link: '/packages/vue3/structure' },
            { text: '核心模块', link: '/packages/vue3/modules' },
            { text: '详细示例', link: '/packages/vue3/examples' }
          ]
        }
      ],
      '/packages/react/': [
        {
          text: '@lcap/react-template',
          items: [
            { text: '概述', link: '/packages/react/' },
            { text: '快速开始', link: '/packages/react/quickstart' }
          ]
        }
      ],
      '/packages/taro/': [
        {
          text: 'taro-mini-vue2',
          items: [
            { text: '概述', link: '/packages/taro/' },
            { text: '快速开始', link: '/packages/taro/quickstart' }
          ]
        }
      ],
      '/development/': [
        {
          text: '开发指南',
          items: [
            { text: '环境搭建', link: '/development/' },
            { text: '工作流程', link: '/development/workflow' },
            { text: '构建说明', link: '/development/build' },
            { text: '测试指南', link: '/development/test' },
            { text: 'CI/CD', link: '/development/ci-cd' },
            { text: '贡献指南', link: '/development/contributing' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/netease-lcap/lcap-template' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 NetEase LCAP'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: 'deep'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  base: '/lcap-template/',

  markdown: {
    lineNumbers: true
  }
})
