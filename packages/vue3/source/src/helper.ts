import cloudAdminDesigner from './init';
import metaData from './meta-data';
import { routes } from './router';
import platformConfig from './platform.config';
import i18nInfo from './language';
import * as scale from './utils/scale';

import './style/theme.css';
import './style/index.css';

let app: any = null;

export async function renderApp() {
  const { appConfig } = platformConfig;
  const { globalScale } = appConfig;

  if (globalScale?.enabled) {
    scale.initScale(globalScale.width);
  }
  // 写入国际化配置
  if (i18nInfo) {
    appConfig.i18nInfo = i18nInfo;
  }

  app = await cloudAdminDesigner.init(appConfig, platformConfig, routes, metaData);

  if (globalScale?.enabled) {
    scale.afterEachInScale();
  }

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
