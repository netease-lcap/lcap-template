<template>
  <div style="height: 100%;">
    <slot 
      :error="err$"
      :info="info$"
      v-bind="params"
    ></slot>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      err$: null,
      info$: null,
    };
  },
  errorCaptured(err, vm, info) {
    // 仅在 dev 环境下捕获 render 错误
    if (appInfo.env === 'dev' && ['render'].includes(info)) {
      console.log('errorCaptured: 👇');
      console.log('err:', err);
      console.log('vm:', vm);
      console.log('info:', info);
      this.err$ = err;
      this.info$ = info;
      createErrorLayout(err);
      return false;
    }

    return true;
  },
}

function createErrorLayout(error) {
  // 创建错误元素并添加到页面
  const errorDiv = document.createElement('div');
  errorDiv.style.display = 'none'; // 默认隐藏，只有在有错误时才显示

  // 创建 h2 元素
  const h2 = document.createElement('h2');
  h2.textContent = 'An error occurred:';
  errorDiv.appendChild(h2);

  const close = document.createElement('div');
  close.textContent = 'Close';
  close.style.position = 'fixed';
  close.style.top = '20px';
  close.style.right = '20px';
  close.style.cursor = 'pointer';
  close.onclick = () => document.body.removeChild(errorDiv);
  errorDiv.appendChild(close);

  // 创建 pre 元素用于显示 error.?message
  const preMessage = document.createElement('pre');
  preMessage.textContent = error?.message;
  errorDiv.appendChild(preMessage);

  // 创建 pre 元素用于显示 error.?stack
  const preStack = document.createElement('pre');
  preStack.textContent = error?.stack;
  errorDiv.appendChild(preStack);

  errorDiv.style.display = 'block';
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = 0;
  errorDiv.style.bottom = 0;
  errorDiv.style.left = 0;
  errorDiv.style.right = 0;
  errorDiv.style.maxWidth = '100%';
  errorDiv.style.width = '100%';
  errorDiv.style.padding = '16px';
  errorDiv.style.boxSizing = 'border-box';
  errorDiv.style.backgroundColor = 'white';
  errorDiv.style.zIndex = 1000; // 确保错误元素在最上层

  document.body.appendChild(errorDiv);
}
</script>
