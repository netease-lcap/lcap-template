import dataSourceUtils from './dataSourceUtils';

export function unsafeEval(code) {
  try {
    return eval(code);
  } catch (error) {
    console.error('Error evaluating code:', error);
    return null;
  }
}

export const setFavicon = (iconUrl) => {
  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = iconUrl;
};

export default {
  dataSourceUtils,
};
