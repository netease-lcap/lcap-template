import { onBeforeMount, onMounted } from 'vue';
import { storage } from "@/common";
import { useGlobalStore } from '@/store'

export const useGlobalVariables = () => {
  const globalStore = useGlobalStore()

  const $frontendVariables = globalStore.frontendVariables
  const $userInfo = globalStore.userInfo

  onBeforeMount(() => {
    const variableSet = window.$localCacheVariableSet

    for (const key of variableSet) {
      const value = storage.get(key, true);
      // 若存在 value 则同步到 frontendVariables
      if (
        value ||
        typeof value === "boolean" ||
        typeof value === "number" ||
        value === ""
      ) {
        $frontendVariables[key] = value;
      }
    }
  })

  onMounted(() => {
    // 监听数据变化
    const variableSet = window.$localCacheVariableSet;

    if (variableSet) {
      for (const key of variableSet) {
        try {
          globalStore.$watch(
            `$frontendVariables.${key}`,
            (newValue) => {
              storage.set(key, newValue, true);
            },
            { deep: true }
          );
        } catch (error) {
          console.warn("error: ", error);
        }
      }
    }
  })

  return {
    $frontendVariables,
    $userInfo
  }
}
