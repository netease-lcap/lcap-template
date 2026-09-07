<template>
  <config-provider :locale="locale">
    <router-view></router-view>
  </config-provider>
</template>

<script setup lang="ts">
import { defineComponent, renderSlot } from 'vue';
import { getUserLanguage } from './i18n';
import { useInitDataPermission } from './hooks';

const FallbackConfigProvider = defineComponent({
  name: "FallbackConfigProvider",
  props: {},
  setup(props, { slots }) {
    return () => renderSlot(slots, "default", {});
  }
});

const { ConfigProvider = FallbackConfigProvider, transformKeys = v => v } = window.lcapStandardUI;

const { appConfig } = window.appInfo;
const { i18nInfo } = appConfig;
// 获取当前语言
const lang = getUserLanguage(appConfig, i18nInfo.messages);
// 拿到messages
const locale = i18nInfo.enabled ? transformKeys(i18nInfo.messages[lang], lang) : undefined;

// 初始化权限数据
useInitDataPermission();
</script>
