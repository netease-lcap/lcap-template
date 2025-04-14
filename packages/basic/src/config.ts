import { encodeUrl } from './utils';
import Global from './global';

type ConfigType = {
  toast: {
    show: (message: string, stack?: string) => void;
    error: (message: string, stack?: string) => void;
  };
  utils: any;
  router: {
    destination?: (url: string, target: string) => void;
    back?: () => void;
    go?: (delta?: number) => void;
  };
  axios: {
    interceptors: Array<any>;
  };
  configureRequest?: (options: any, axios: any) => void;
  reactive?: (obj: any) => void;
  globalProperties: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
  };
};

// 差异性配置，由H5、PC端启动时 传入覆盖
const Config: ConfigType = {
  toast: {
    show: (message, stack?) => void 0,
    error: (message, stack?) => void 0,
  },
  utils: {},
  router: {
    // 默认实现
    destination: (url: string, target: string) => {
      if (target === '_self') {
        location.href = encodeUrl(url);
      } else {
        window.open(encodeUrl(url), target);
      }
    },
    back: () => {
      window.history.back();
    },
    go: (delta = 0) => {
      window.history.go(delta);
    },
  },
  axios: {
    interceptors: [],
  },
  globalProperties: {
    set(key, value) {
      window[key] = value;
      Global.prototype[key] = value;
    },
    get(key) {
      return Global.prototype[key];
    },
  },
};

export function setConfig(newConfig: Partial<ConfigType>) {
  Object.assign(Config, newConfig);
}

export function getConfig() {
  return Config;
}

export default Config;
