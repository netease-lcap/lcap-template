import { encodeUrl } from "./utils";

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
    createRouter?: (options: any) => any;
  };
  axios: {
    interceptors: Array<any>;
  };
  configureRequest?: (options: any, axios: any) => void;
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
      if (target === "_self") {
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
};

export function setConfig(newConfig) {
  Object.assign(Config, newConfig);
}

export function getConfig() {
  return Config;
}

export default Config;
