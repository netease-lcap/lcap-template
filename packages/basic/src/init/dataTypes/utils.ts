import { Decimal } from 'decimal.js';
import CryptoJS from 'crypto-js';

import { initService as initConfigurationService } from '../../apis/configuration';
import { initService as initIoService } from '../../apis/io';
import { initService as initLowauthService } from '../../apis/lowauth';
import { initService as initLogService } from '../../apis/log';

import Config from '../../config';

import { authService } from '../auth';

import { navigateToUserInfoPage, navigateToUserPhonePage, navigateScanCodePage, navigateLocationPage } from './wx';

window.CryptoJS = CryptoJS;

export function add(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    return x + y;
  }
  if (!x) {
    x = 0;
  }
  if (!y) {
    y = 0;
  }
  const xx = new Decimal(x + '');
  const yy = new Decimal(y + '');
  return xx.plus(yy).toNumber();
}

export function minus(x, y) {
  if (!x) {
    x = 0;
  }
  if (!y) {
    y = 0;
  }
  const xx = new Decimal(x + '');
  const yy = new Decimal(y + '');
  return xx.minus(yy).toNumber();
}

export function multiply(x, y) {
  if (!x) {
    x = 0;
  }
  if (!y) {
    y = 0;
  }
  const xx = new Decimal(x + '');
  const yy = new Decimal(y + '');
  return xx.mul(yy).toNumber();
}

export function divide(x, y) {
  if (!x) {
    x = 0;
  }
  if (!y) {
    y = 0;
  }
  const xx = new Decimal(x + '');
  const yy = new Decimal(y + '');
  return xx.div(yy).toNumber();
}

export function isEqual(x, y) {
  // eslint-disable-next-line eqeqeq
  return x == y;
}

export function requestFullscreen() {
  return document.body.requestFullscreen();
}

export function exitFullscreen() {
  return document.exitFullscreen();
}

const aesKey = ';Z#^$;8+yhO!AhGo';
export function encryptByAES({ string: message }, key = aesKey) {
  const keyHex = CryptoJS.enc.Utf8.parse(key); //
  const messageHex = CryptoJS.enc.Utf8.parse(message);
  const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function decryptByAES({ string: messageBase64 }, key = aesKey) {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypt = CryptoJS.AES.decrypt(messageBase64, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export function hasAuth({ authPath }) {
  return authService.has(authPath);
}

export function getLocation() {
  return new Promise((res, rej) => {
    function showPosition(position) {
      const { latitude, longitude } = position.coords;
      const [mglng, mglat] = [longitude, latitude];
      res(`${mglng},${mglat}`);
    }

    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          Config.toast.error('用户禁止获取地理定位');
          rej({ code: error.code, msg: '用户禁止获取地理定位' });
          break;
        case error.POSITION_UNAVAILABLE:
          Config.toast.error('地理定位信息无法获取');
          rej({ code: error.code, msg: '地理定位信息无法获取' });
          break;
        case error.TIMEOUT:
          Config.toast.error('地理定位信息获取超时');
          rej({ code: error.code, msg: '地理定位信息获取超时' });
          break;
        case error.UNKNOWN_ERROR:
          Config.toast.error('未知错误');
          rej({ code: error.code, msg: '未知错误' });
          break;
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      Config.toast.error('当前系统不支持地理定位');
      rej({ code: 666, msg: '当前系统不支持地理定位' });
    }
  });
}

export function getDistance(s1, s2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const lat1t = s1.split(',')[1];
  const lng1t = s1.split(',')[0];
  const lat2t = s2.split(',')[1];
  const lng2t = s2.split(',')[0];

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2t - lat1t); // deg2rad below
  const dLon = deg2rad(lng2t - lng1t);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1t)) * Math.cos(deg2rad(lat2t)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000;
}

export async function getCustomConfig(configKey = '') {
  const configKeys = configKey.split('.');
  const finalConfigKey = configKeys.pop();
  const groupName = configKeys[configKeys.length - 2];
  const query = {
    group: groupName,
  };
  if (configKey.startsWith('extensions.')) {
    query.group = `${configKeys[0]}.${configKeys[1]}.${groupName}`;
  }
  const res = await initConfigurationService().getCustomConfig({
    path: { configKey: finalConfigKey },
    query,
  });
  return res?.data || res;
}

export async function getCurrentIp() {
  const res = await initConfigurationService().getCurrentIp();
  return res?.data || res;
}

export function getUserLanguage() {
  return navigator.language || navigator.userLanguage;
}

export function compareKeyboardInput(event, target) {
  // 将target转event
  const targetEvent = {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    code: '',
  };
  target.forEach((item) => {
    if (item === 'Alt') {
      targetEvent.altKey = true;
    } else if (item === 'Meta') {
      targetEvent.metaKey = true;
    } else if (item === 'Control') {
      targetEvent.ctrlKey = true;
    } else if (item === 'Shift') {
      targetEvent.shiftKey = true;
    } else {
      targetEvent.code = item;
    }
  });

  let isMatch = true;
  for (const key in targetEvent) {
    if (Object.hasOwnProperty.call(targetEvent, key)) {
      if (targetEvent[key] !== event[key]) {
        isMatch = false;
      }
    }
  }

  return isMatch;
}

export async function downloadFile(url, fileName) {
  await initIoService()
    .downloadFiles({
      body: {
        urls: [url],
        fileName,
      },
    })
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.resolve(err));
}

export async function downloadFiles(urls, fileName) {
  await initIoService()
    .downloadFiles({
      body: {
        urls,
        fileName,
      },
    })
    .then((res) => Promise.resolve(res))
    .catch((err) => Promise.resolve(err));
}

export async function getUserList(query) {
  const appEnv = window.appInfo.env;
  const cookies = document.cookie.split('; ');
  const token = cookies.find((cookie) => cookie.split('=')[0] === 'authorization')?.split('=')[1];
  const res = await initLowauthService().getUserList({
    body: {
      appEnv,
      token,
      ...query,
    },
  });
  return res;
}

/**
 * 上报日志
 */
export async function logReport(data) {
  try {
    const res = await initLogService().logReport({
      body: data,
    });

    return res;
  } catch (error) {
    return error;
  }
}

// 国际化
export function setI18nLocale(newLocale) {
  // 修改local中的存储的语言标识
  localStorage.i18nLocale = newLocale;
  // 重新加载页面
  window.location.reload();
}

export function getI18nList() {
  // 在ide中拼接好
  return window.$global.i18nInfo.I18nList || [];
}

// 路由back、go
export function back() {
  Config.router?.back?.();
}

export function go(delta) {
  Config.router?.go?.(delta);
}

// 下方为H5端的方法
export function getIsMiniApp() {
  return window.__wxjs_environment === 'miniprogram';
}

export function getWeChatOpenid() {
  return localStorage.getItem('_wx_openid');
}

export function getWeChatHeadImg() {
  return localStorage.getItem('_wx_headimg');
}

export function getWeChatNickName() {
  return localStorage.getItem('_wx_nickname');
}

export function getWeChatPhone() {
  return localStorage.getItem('_wx_phone');
}

export function getWeChatScanCode() {
  const data = localStorage.getItem('_wx_scan_code');
  localStorage.setItem('_wx_scan_code', '');
  return data;
}

export function getWeChatLocation() {
  const data = localStorage.getItem('_wx_location');
  localStorage.setItem('_wx_location', '');
  return data;
}

export function navigateToUserInfo() {
  return navigateToUserInfoPage();
}

export function navigateToUserPhone() {
  return navigateToUserPhonePage();
}

export function navigateToScanCode() {
  return navigateScanCodePage();
}

export function navigateToLocation() {
  return navigateLocationPage();
}
