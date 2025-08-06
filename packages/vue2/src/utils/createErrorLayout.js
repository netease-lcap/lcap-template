export default function createErrorLayout(error) {
  if (!error || !error.stack) {
    return;
  }
  // 创建异常提示层
  const errorRoot = document.createElement('div');
  errorRoot.style.position = 'fixed';
  errorRoot.style.margin = '0 auto';
  errorRoot.style.width = '0';
  errorRoot.style.left = '0';
  errorRoot.style.right = '0';
  errorRoot.style.top = '10px';

  const errorItem = document.createElement('div');
  errorItem.style.width = '200px';
  errorItem.style.transform = 'translateX(-50%)';
  errorItem.style.backgroundColor = '#303030cc';
  errorItem.style.fontSize = '14px';
  errorItem.style.color = 'white';
  errorItem.style.borderRadius = '4px';
  errorItem.style.textAlign = 'center';
  errorItem.style.display = 'flex';
  errorItem.style.alignItems = 'center';
  errorItem.style.justifyContent = 'center';

  // 初始化异常文本
  const textDiv = document.createElement('div');
  textDiv.textContent = '初始化异常';
  textDiv.style.padding = '10px';

  // 复制按钮
  const copyDiv = document.createElement('div');
  copyDiv.textContent = '复制异常信息';
  copyDiv.style.position = 'relative';
  copyDiv.style.cursor = 'pointer';
  copyDiv.style.padding = '10px';
  copyDiv.onclick = function () {
    const message = '初始化异常提醒仅预览环境生效。出错堆栈信息如下：' + (error && error.stack);
    const input = document.createElement('input');
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
        alert('复制失败');
      } else {
        alert('复制成功');
      }
    } catch {
      document.body.removeChild(input);
      alert('当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作');
    }
  };

  // copy 按钮左侧竖线
  const before = document.createElement('span');
  before.style.position = 'absolute';
  before.style.top = '0';
  before.style.left = '0';
  before.style.width = '1px';
  before.style.height = '100%';
  before.style.opacity = '.5';
  before.style.background = 'currentColor';
  copyDiv.appendChild(before);

  errorItem.appendChild(textDiv);
  errorItem.appendChild(copyDiv);
  errorRoot.appendChild(errorItem);

  document.body.appendChild(errorRoot);

  // 3秒后自动隐藏
  setTimeout(() => {
    if (errorRoot.parentNode) {
      errorRoot.parentNode.removeChild(errorRoot);
    }
  }, 3000);
}
