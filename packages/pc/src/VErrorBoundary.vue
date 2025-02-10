<template>
  <div class="lcap-verror-item-root" v-show="show">
    <div class="lcap-verror-item">
      <div>初始化异常</div>
      <div class="copy" @click="onCopy">复制异常信息</div>
    </div>
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
      show: false,
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
      this.showToast();
      return false;
    }

    return true;
  },
  destroyed() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    onCopy() {
      if(!this.err$) {
        return;
      }
      const message = '初始化异常提醒仅预览环境生效。出错堆栈信息如下：' + this.err$.stack;
      let input = document.createElement('input')
      input.style.position = 'fixed'
      input.style.top = '-10000px'
      input.style.zIndex = '-999'
      document.body.appendChild(input)
      input.value = message
      input.focus()
      input.select()
      try {
        let result = document.execCommand('copy')
        document.body.removeChild(input)
        if (!result) {
          this.$toast && this.$toast.error && this.$toast.error('复制失败')
        } else {
          this.$toast && this.$toast.success && this.$toast.success('复制成功')
        }
      } catch (e) {
        document.body.removeChild(input)
        this.$toast && this.$toast.warning && this.$toast.warning('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作')
      }
    },
    showToast() {
      this.show = true;
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.show = false;
      }, 3000);
    }
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
<style>
.lcap-verror-item-root {
  position: fixed;
  margin:0 auto;
  width: 0;
  left: 0;
  right: 0;
  top: 10px;
}
.lcap-verror-item {
  width:200px;
  transform: translateX(-50%);
  background-color:#303030cc;
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
  opacity: .5;
  background: currentColor;
}
</style>