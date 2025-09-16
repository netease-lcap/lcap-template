/**
 * 主入口文件
 */

// 修改该文件时，需要同步修改 source/icestark/main.js 和 source/qiankun/main.js 和 source/wujie/main.js
import cloudAdminDesigner from './init';
import metaData from './meta-data';
import platformConfig from './platform.config.json';
import { routes } from './router/routes';

import './library';
import i18nInfo from './language';
import platformConfig from './platform.config.json';

import '@/style/index.css';
import '@/style/theme.css';

// 写入国际化配置
platformConfig.appConfig.i18nInfo = i18nInfo;

cloudAdminDesigner.init(platformConfig?.appConfig, platformConfig, routes, metaData);
