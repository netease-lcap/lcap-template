<template>
  <VErrorBoundary>
    <config-provider :locale="locale">
      <router-view></router-view>
    </config-provider>
  </VErrorBoundary>
</template>

<script setup lang="ts">
import VErrorBoundary from './VErrorBoundary.vue';
import { getUserLanguage } from './i18n';
import { useInitDataPermission } from './hooks';

const { ConfigProvider = 'div', transformKeys = v => v } = window.lcapStandardUI;

const { appConfig } = window.appInfo;
const { i18nInfo } = appConfig;
// 获取当前语言
const lang = getUserLanguage(appConfig, i18nInfo.messages);
// 拿到messages
const locale = i18nInfo.enabled ? transformKeys(i18nInfo.messages[lang], lang) : undefined;

// 初始化权限数据
useInitDataPermission();
</script>
