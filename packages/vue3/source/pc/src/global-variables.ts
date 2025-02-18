import type { ComponentOptions } from 'vue'
import { mapWritableState, mapState } from 'pinia'
import { storage } from '@/common'
import { useGlobalStore } from '@/store'

export const useProvideGlobalMixin: () => ComponentOptions = () => {
  return {
    provide() {
      return {
        $frontendVariables: this.$frontendVariables,
        $userInfo: this.$userInfo,
      }
    },

    computed: {
      ...mapWritableState(useGlobalStore, {
        $frontendVariables: 'frontendVariables',
      }),
      ...mapState(useGlobalStore, {
        $userInfo: 'userInfo',
      }),
    },

    beforeMount() {
      const variableSet = this.$localCacheVariableSet
      const frontendVariables = this.$frontendVariables

      for (const key of variableSet) {
        const value = storage.get(key, true)
        // 若存在 value 则同步到 frontendVariables
        if (value || typeof value === 'boolean' || typeof value === 'number' || value === '') {
          frontendVariables[key] = value
        }
      }
    },
    mounted() {
      // 监听数据变化
      const variableSet = this.$localCacheVariableSet

      if (variableSet) {
        for (const key of variableSet) {
          try {
            this.$watch(
              `$frontendVariables.${key}`,
              (newValue) => {
                storage.set(key, newValue, true)
              },
              { deep: true },
            )
          } catch (error) {
            console.warn('error: ', error)
          }
        }
      }
    },
  }
}

// 翻译时插入页面
export const useInjectGlobalMixin: () => ComponentOptions = () => {
  return {
    inject: ['$frontendVariables', '$userInfo'],
  }
}
