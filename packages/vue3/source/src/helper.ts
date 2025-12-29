import cloudAdminDesigner from './init';
import metaData from './meta-data';
import { routes } from './router';
import platformConfig from './platform.config';
import i18nInfo from './language';

import './style/theme.css';

let app: any = null;

export async function renderApp() {
  // 写入国际化配置
  if (i18nInfo) {
    platformConfig.appConfig.i18nInfo = i18nInfo;
  }

  app = await cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
  window.createLcapApp = renderApp;
  window.appVM = {
    $destroy: unmountApp,
  };
}

function unmountApp() {
  window.appVM = null;
  window.createLcapApp = null;
  app?.unmount();
  app = null;
}
