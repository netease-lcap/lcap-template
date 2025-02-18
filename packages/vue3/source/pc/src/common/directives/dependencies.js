function isShalldowEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }

  const index = arr1.findIndex((item, i) => item !== arr2[i])

  return index === -1
}

function dependencies(el, binding, vnode) {
  if (!binding.instance) {
    return
  }

  const vm = binding.instance
  const action = binding.modifiers['reload'] ? 'reload' : ''
  if (!action || !vm || typeof vm[action] !== 'function') {
    return
  }

  const { value, oldValue } = binding
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !Array.isArray(oldValue) ||
    isShalldowEqualArray(value, oldValue)
  ) {
    return
  }

  vm[action]() // 执行依赖动作
}

export default {
  name: 'dependencies',
  updated: dependencies,
}
