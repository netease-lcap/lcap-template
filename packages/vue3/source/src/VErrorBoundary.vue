<template>
  <div style="height: 100%">
    <slot v-bind="params" :error="err$" :info="info$"></slot>
    <div class="lcap-verror-item-root" v-if="show">
      <div class="lcap-verror-item">
        <div>初始化异常</div>
        <div class="copy" @click="onCopy">复制异常信息</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured, onBeforeUnmount } from 'vue';

const props = defineProps({
  params: {
    type: Object,
    default: () => ({}),
  },
});

const err$ = ref(null);
const info$ = ref(null);
const show = ref(false);
let timeoutId = null;

onErrorCaptured((err, vm, info) => {
  // 仅在 dev 环境下捕获 render 错误
  if (appInfo.env === 'dev' && ['render'].includes(info)) {
    console.log('errorCaptured: 👇');
    console.log('err:', err);
    console.log('vm:', vm);
    console.log('info:', info);
    err$.value = err;
    info$.value = info;
    showToast();
    return false;
  }

  return true;
});

onBeforeUnmount(() => {
  clearTimeout(timeoutId);
});

function onCopy() {
  if (!err$.value) {
    return;
  }
  const message = '初始化异常提醒仅预览环境生效。出错堆栈信息如下：' + err$.value.stack;
  let input = document.createElement('input');
  input.style.position = 'fixed';
  input.style.top = '-10000px';
  input.style.zIndex = '-999';
  document.body.appendChild(input);
  input.value = message;
  input.focus();
  input.select();
  try {
    let result = document.execCommand('copy');
    document.body.removeChild(input);
    if (!result) {
      $toast?.error?.('复制失败');
    } else {
      $toast?.success?.('复制成功');
    }
  } catch(e) {
    document.body.removeChild(input);
    $toast?.warning?.('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作');
  }
}

function showToast() {
  show.value = true;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    show.value = false;
  }, 3000);
}
</script>

<style>
.lcap-verror-item-root {
  position: fixed;
  margin: 0 auto;
  width: 0;
  left: 0;
  right: 0;
  top: 10px;
}
.lcap-verror-item {
  width: 200px;
  transform: translateX(-50%);
  background-color: #303030cc;
  font-size: 14px;
  color: white;
  border-radius: 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lcap-verror-item div {
  padding: 10px;
}
.lcap-verror-item .copy {
  position: relative;
  cursor: pointer;
}
.lcap-verror-item .copy::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  opacity: 0.5;
  background: currentColor;
}
</style>
