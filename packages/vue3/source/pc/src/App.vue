<template>
  <VErrorBoundary>
    <config-provider :locale="locale">
      <router-view></router-view>
    </config-provider>
  </VErrorBoundary>
</template>

<script setup>
import VErrorBoundary from './VErrorBoundary.vue';
import { getUserLanguage } from './i18n';

const { appConfig } = window.appInfo;
const { i18nInfo } = appConfig;
// 获取当前语言
const lang = getUserLanguage(appConfig, i18nInfo.messages);
// 拿到messages
const transformKeys = window.lcapStandardUI?.transformKeys || ((obj) => obj);
const locale = i18nInfo.enabled ? transformKeys(i18nInfo.messages[lang]) : undefined;
</script>
