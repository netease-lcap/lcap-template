import metaData from './metaData';
import platformConfig from './platform.config';
import { routes } from './router';
import cloudAdminDesigner from './init';

let app: any = null;

export async function renderApp() {
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
