import { ApiSchema } from '../api';
const map = {
    json: 'application/json;charset=UTF-8',
    form: 'application/x-www-form-urlencoded;charset=UTF-8',
};
export default async function (ctx: ApiSchema, next): Promise<any> {
    const { config, url } = ctx;
    const headers = url.headers || {};
    const requestType = config && config.requestType;
    if (!headers['Content-Type'] || requestType) {
        if (map[requestType || 'json']) {
            headers['Content-Type'] = map[requestType || 'json'];
        } else {
            console.error('requestType error:' + requestType);
        }
    }
    url.headers = headers;
    return await next();
}