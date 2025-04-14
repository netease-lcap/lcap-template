export function installComponents(vm, Components) {
  const caseRE = /^[A-Z]/;
  const blackList = ['directives', 'filters', 'utils', 'mixins', 'blocks', 'vendors', 'install', 'default'];

  // 组件之间有依赖，有 install 的必须先安装
  Object.keys(Components).forEach((key) => {
    if (!caseRE.test(key)) {
      // 如果为大写则是组件
      if (!blackList.includes(key)) console.error('不允许组件名首字母小写', key, Components[key]);
      return;
    }

    const Component = Components[key]?.default || Components[key];

    vm.component(key, Component);

    if (Component.install) {
      Component.install(vm, key);
    }
  });
}

export function installDirectives(vm, directives) {
  Object.keys(directives).forEach((key) => vm.directive(key, directives[key]));
}

export function installLibraries(vm, libraries) {
  window.$libraries = {};

  Object.keys(libraries).forEach((key) => {
    window.$libraries[key] = libraries[key];

    const lib = libraries[key]?.default || libraries[key];
    vm.use(lib);
  });
}
