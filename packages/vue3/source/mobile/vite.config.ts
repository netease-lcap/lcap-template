import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import html from '@rollup/plugin-html';
import genClient from './client-lazyload-template.ts';

// 会被替换成真实服务端地址，形如 http://dev.pagetest.defaulttenant.lcap.hatest.163yun.com
const backendUrl = '';
// 会被替换成真实publicPath，形如 '//minio-api.codewave-test.163yun.com/lowcode-static/defaulttenant/48bab4da-9671-4e27-9411-bcdb41cd16e4/dev'
const publicPath = '';
// 是否是开发环境
const isDev = false;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    html({
      fileName: 'client.js',
      template: (templateParameters) => genClient(templateParameters, publicPath),
    }),
  ],
  build: {
    sourcemap: isDev,
    rollupOptions: {
      external: [],
      output: {
        format: 'amd',
        amd: {
          autoId: true
        },
        path: {},
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        hashCharacters: 'hex',
        manualChunks: {
          'element-plus': ['@lcap/element-plus'],
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
        }
      },
    },
  },
  resolve: {
    alias: {},
  },
  server: {
    port: 8810,
    proxy: {
      '/assets': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '/rest': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/gateway/': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/gw/': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
      '^/upload': {
        target: backendUrl,
        changeOrigin: true,
        autoRewrite: true,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
