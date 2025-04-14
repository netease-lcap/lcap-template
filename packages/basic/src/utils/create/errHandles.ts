import Config from '../../config';

const getErrMessage = (err) => err.msg || err.Message || '系统错误，请查看日志！';
const getErrStrack = (err) => err.StackTrace || '系统错误，请查看日志！';

type Err = {
  Code?: number | string;
  Message?: string;
};

export default {
  defaults({ config }, err) {
    if (!config.noErrorTip) {
      Config.toast.error('系统错误');
    }
  },
  500({ config }, err: Err = {}) {
    if (!config.noErrorTip) {
      Config.toast.error(getErrMessage(err), getErrStrack(err));
    }
  },
  501({ config }, err: Err = {}) {
    // 遇到服务端中止，前端也要中止程序
    if (err.Code === 501 && err.Message === 'abort') {
      throw Error('程序中止');
    }
  },
  400({ config }, err: Err = {}) {
    if (!config.noErrorTip) {
      Config.toast.error(getErrMessage(err), getErrStrack(err));
    }
  },
  401({ config }, err: Err = {}) {
    if (err.Code === 401 && err.Message === 'token.is.invalid') {
      if (window.LcapMicro?.loginFn) {
        window.LcapMicro.loginFn();
        return;
      }
    }
    if (err.Code === 401 && err.Message === 'token.is.invalid') {
      location.href = '/login';
    }
  },
  403({ config }, err: Err = {}) {
    if (err.Code === 'InvalidToken' && err.Message === 'Token is invalid') {
      if (window.LcapMicro?.loginFn) {
        window.LcapMicro.loginFn();
        return;
      }
    }
    if (err.Code === 'InvalidToken' && err.Message === 'Token is invalid') {
      if (!config.noErrorTip) {
        Config.toast.error('登录失效，请重新登录');
      }
      localStorage.setItem('beforeLogin', JSON.stringify(location));
      location.href = '/login';
    }
  },
  remoteError({ config }, err) {
    if (!config.noErrorTip) {
      Config.toast.error('系统错误，请查看日志！');
    }
  },
  localError({ config }, err) {
    if (!config.noErrorTip) {
      Config.toast.error('系统错误，请查看日志！');
    }
  },
};
