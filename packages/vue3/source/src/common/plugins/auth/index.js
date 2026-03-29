import { initAuth, authService } from '@lcap/basic-template';

export default {
  install(vm, options = {}) {
    initAuth({
      ...options,
      configureAuthService(service) {
        /**
         * 严格的权限判断，父级权限未配置时，子权限即使配置了也无效
          * 例如：当只有 /dashboard/entity/list 配置了权限，而没有 /dashboard/entity 时，访问 /dashboard/entity/list 的权限会失效，并在控制台警告缺少 /dashboard/entity 权限
        * 反之，当 /dashboard/entity 和 /dashboard/entity/list 都配置了权限时，访问 /dashboard/entity/list 的权限才会生效
        */
        service.has = function(authPath) {
          const _map = service._getResourceMap();

          if (!_map) {
            console.warn('权限资源未获取到，请检查权限资源接口');
            return false;
          }

          let hasPermission = true;

          const authPathSegments = authPath.split('/').filter(Boolean);
          const parentAuthPaths = authPathSegments.reduce((acc, segment) => {
            const lastPath = acc.length > 0 ? acc[acc.length - 1] : '';
            const newPath = `${lastPath}/${segment}`;
            acc.push(newPath);
            return acc;
          }, []);

          while (parentAuthPaths.length > 0) {
            const path = parentAuthPaths.shift();
            if (!_map.has(path)) {
              hasPermission = false;
              console.warn(`权限资源：缺少权限 ${path}，请确认是否已配置该权限项`);
              break;
            }
          }

          return hasPermission;
        }
      }
    });

    const base = (options.base || '').replace(/\/$/, '');
    /**
     * - 组件权限项功能
     * - 自动隐藏路由组件功能
     * 实现该需求无非三种方案：
     *     - 源码修改 v-show 或 disabled 属性，比如 :disabled="!$auth.hasSub('createButton/enabled') || !canSubmit"，
     *       从而从根本上改变 render 函数，有一定风险+恶心
     *     - 在 updated 阶段植入一些东西，缺点就是每次 updated 都会走一遍
     *     - 修改原组件 disabled 属性等，不是很推荐。在外层包装组件也属于这种情况
     */
    /**
     * 权限指令
     * value 绑定权限项，如果不传则使用 ref 名
     * modifiers 的名字用于子权限行为，组件属性那里有问题，暂时没有实现
     */
    const vAuth = {
      async handle(el, binding) {
        const { instance } = binding;
        // 初始化操作，防止先出现后消失
        if (instance && instance.$options.name === 'u-table-view-column') instance.currentHidden = false;
        else if (el) {
          el.style.display = 'none';
        }
        const data = {
          value: binding.value || '',
          actions: Object.keys(binding.modifiers),
        };

        // const authPath = `${base + router.currentRoute.path}/${data.value ? data.value : vnode.data.ref}`;
        const authPath = data.value;
        const visible = await authService.has(authPath);

        // 表格列不起作用，特殊处理
        if (instance && instance.$options.name === 'u-table-view-column') instance.currentHidden = !visible;
        else if (el) {
          el.style.display = visible ? '' : 'none';
        }
      },
      beforeMount(el, binding, vnode, oldVnode) {
        vAuth.handle(el, binding, vnode, oldVnode);
      },
      updated(el, binding, vnode, oldVnode) {
        vAuth.handle(el, binding, vnode, oldVnode);
      },
    };
    vm.directive('auth', vAuth);

    vm.mixin({
      mounted() {
        // 目前只开放权限显隐
        this._updateVisibleByAuth();
      },
      updated() {
        this._updateVisibleByAuth();
      },
      methods: {
        _updateVisibleByAuth() {
          if (!(options.autoHide && this.to)) return;
          // 有 v-auth 了就不处理 to 的了。
          if (this.$vnode.data.directives && this.$vnode.data.directives.some((directive) => directive.name === 'auth')) return;
          if (!authService.isInit()) return;

          let visible = true;
          if (options.autoHide && this.to) {
            let toPath;
            if (typeof this.to === 'object') toPath = this.to.path;
            else if (typeof this.to === 'string') toPath = this.to.split('?')[0];
            // 去掉末尾的 / 导致的权限不匹配
            const fullPath = (base + toPath).replace(/\/+$/, '');
            visible = visible && authService.has(fullPath);
          }

          if (this.$el) {
            this.$el.style.display = visible ? '' : 'none';
          }
        },
      },
    });
  },
};
