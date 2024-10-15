import processService from './processService';
import { initService as processV2Service } from "../../apis/processV2";
import { initService as systemProcessV2Service } from "../../apis/system/processV2";
import { formatMicroFrontUrl, formatMicroFrontRouterPath } from './microFrontUrl';
import Config from "../../config";

export function downloadClick(realUrl, target) {
    const a = document.createElement('a');
    a.setAttribute('href', realUrl);
    a.setAttribute('target', target);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
    }, 500);
}

export default {
    install(Vue, options = {}) {
        /**
         * 流程接口注册
         */
        Vue.prototype.$process = processService;
        Vue.prototype.$processV2 = processV2Service();
        Vue.prototype.$systemProcessV2 = systemProcessV2Service();

        Vue.prototype.$formatMicroFrontUrl = formatMicroFrontUrl;
        Vue.prototype.$formatMicroFrontRouterPath = formatMicroFrontRouterPath;

        Vue.prototype.$destination = function (...args) {
            Config.destination.call(this, ...args);
        };

        Vue.prototype.$toQueryString = function (params) {
            const query = Object.entries(params)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
        
            return query.length > 0 ? `?${query}` : '';
        };

        Vue.prototype.$link = async function (url, target = '_self') {
            let realUrl;
            if (typeof url === 'function') {
                realUrl = await url();
            }else if(url?.charAt(0) === '/'){
                Config.destination.call(this, url,target);
                return;
            } else {
                realUrl = url;
            }
            downloadClick(realUrl, target);
        };
    },
};
