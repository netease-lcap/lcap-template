function isShalldowEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const index = arr1.findIndex((item, i) => item !== arr2[i]);

  return index === -1;
}

function dependencies(el, binding, vnode) {
  if (!vnode || !vnode.componentInstance) {
    return;
  }

  const vueIns = vnode.componentInstance;
  const action = binding.modifiers['reload'] ? 'reload' : '';
  if (!action || !vueIns || typeof vueIns[action] !== 'function') {
    return;
  }

  const { value, oldValue } = binding;
  if (!Array.isArray(value) || value.length === 0 || !Array.isArray(oldValue) || isShalldowEqualArray(value, oldValue)) {
    return;
  }

  vueIns[action](); // 执行依赖动作
}

export default {
  name: 'dependencies',
  update: dependencies,
};
