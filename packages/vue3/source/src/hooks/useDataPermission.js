import { ref, provide, inject, onBeforeMount } from 'vue';
import { LcapDataPermission } from '@/libraries';

const checkable = typeof LcapDataPermission !== 'undefined';

const provideKey = '__permissionData__';

export const useInitDataPermission = () => {
  const permissionData = ref({
    entities: {},
    logics: {},
  });


  onBeforeMount(async () => {
    if (!checkable) {
      return;
    }

    const sysPrefixPath = window.appInfo?.sysPrefixPath ?? '';
    const [entityAllRes, logicAllRes] = await Promise.all([
      fetch(`${sysPrefixPath}/api/system/annotation/entityAll`).then((response) => response.json()),
      fetch(`${sysPrefixPath}/api/system/annotation/logicAll`).then((response) => response.json()),
    ]);


    const entityAllData = (entityAllRes && entityAllRes.Data) || entityAllRes;
    const logicAllData = (logicAllRes && logicAllRes.Data) || logicAllRes;


    permissionData.value = {
      entities: entityAllData.find((it) => it.annotationName === 'DataPermissionLogicAnnotation')?.entityList ?? {},
      logics: logicAllData.find((it) => it.annotationName === 'EntityPermissionAnnotation')?.logicList ?? {},
    };
  });


  provide(provideKey, permissionData);
};


export const useCheckDataPermission = () => {
  const permissionData = inject(provideKey, null);


  const checkPermission = (dataRefList) => {
    if (!checkable) {
      console.warn('LcapDataPermission is not defined, please make sure you have installed the data permission library.');
      return true;
    }

    return LcapDataPermission?.checkDataPermission?.(permissionData.value, dataRefList);
  };


  return checkPermission;
};
