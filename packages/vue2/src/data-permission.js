import platformConfig from './platform.config.json';

export async function fetchAnnotationData() {
  const { enableDataPermission, sysPrefixPath = '' } = platformConfig;

  if (!enableDataPermission || window.annotationAllData) {
    return;
  }

  let urlEntity = sysPrefixPath + '/api/system/annotation/entityAll';
  let urlLogic = sysPrefixPath + '/api/system/annotation/logicAll';

  try {
    const [entityAll, logicAll] = await Promise.all([
      fetch(urlEntity).then((response) => response.json()),
      fetch(urlLogic).then((response) => response.json()),
    ]);
    const entityAllData = (entityAll && entityAll.Data) || entityAll;
    const logicAllData = (logicAll && logicAll.Data) || logicAll;

    window.annotationAllData = {
      entityAll: entityAllData,
      logicAll: logicAllData,
    };
  } catch (error) {
    console.error('Error fetching annotation data:', error);
  }
}
