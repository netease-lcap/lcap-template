import cloudAdminDesigner from './init';
import metaData from './meta-data';
import { routes } from './router';
import platformConfig from './platform.config';
import i18nInfo from './language';

let app: any = null;

export async function renderApp() {
  // 写入国际化配置
  platformConfig.appConfig.i18nInfo = i18nInfo;

  app = await cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
  // @ts-expect-error
  window.createLcapApp = renderApp;
  // @ts-expect-error
  window.appVM = {
    $destroy: unmountApp,
  };
}

function unmountApp() {
  // @ts-expect-error
  window.appVM = null;
  // @ts-expect-error
  window.createLcapApp = null;
  app?.unmount();
  app = null;
}
