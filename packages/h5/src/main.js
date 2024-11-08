import { routes } from "./router/routes";

import metaData from "./metaData.js";
import platformConfig from "./platform.config.json";
import cloudAdminDesigner from "./init";
import "./library";

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
