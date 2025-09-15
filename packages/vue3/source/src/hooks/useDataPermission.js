import { ref, provide, inject, onBeforeMount } from 'vue';
import { LcapDataPermission } from '@/libraries';

const { checkDataPermission = () => true } = LcapDataPermission ?? {};
const provideKey = '__permissionData__';

export const useInitDataPermission = () => {
  const permissionData = ref({
    entities: {},
    logics: {},
  });


  onBeforeMount(async () => {
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
    return checkDataPermission(permissionData.value, dataRefList);
  };


  return checkPermission;
};
