import { ApiSchema, ApiSchemaData, ServiceConfig } from '../api';
import methods from '../methods';
import { resolvePath, isObject } from './utils';
const bodyMethods = [methods.PATCH, methods.POST, methods.PUT];
export default function mixin(serviceConfig: ServiceConfig, apiSchema: ApiSchema, requestObj: ApiSchemaData): ApiSchema {
    const apiSchemaURL = apiSchema.url;
    requestObj = requestObj || {};
    serviceConfig = serviceConfig || {};
    const apiSchemaURLInfo = {
        ...apiSchemaURL,
    };
    const apiSchemaInfo: ApiSchema = {
        url: apiSchemaURLInfo,
    };
    const priority = {
        ...({
            preprocess: 100,
            postprocess: 100,
        }),
        ...serviceConfig?.config?.priority,
        ...apiSchema?.config?.priority,
        ...requestObj?.config?.priority,
    };
    apiSchemaInfo.config = {
        ...serviceConfig?.config,
        ...apiSchema?.config,
        ...requestObj?.config,
        ...({
            priority,
        })
    };
    if (apiSchema.mock || requestObj.mock) {
        apiSchemaInfo.mock = apiSchema.mock;
    }
    if (requestObj.path) {
        apiSchemaURLInfo.path = resolvePath(apiSchemaURL.path, requestObj.path);
    }
    if (serviceConfig.prefix) {
        apiSchemaURLInfo.path = serviceConfig.prefix + apiSchemaURLInfo.path;
    }
    if ((apiSchemaURL.body || requestObj.body)) {

        if (isObject(apiSchemaURL.body) || isObject(requestObj.body)) {
            apiSchemaURLInfo.body = {
                ...apiSchemaURL.body, 
                ...requestObj.body,
            };
        } else {
            apiSchemaURLInfo.body = apiSchemaURL.body || requestObj.body;
        }
        if (process.env.NODE_ENV === 'development') {
            if (!bodyMethods.includes(apiSchemaURLInfo.method)) {
                console.warn('HTTP methods like post,patch,put require a body.');
            }
        }
    }
    if (apiSchemaURL.query || requestObj.query) {
        apiSchemaURLInfo.query = {
            ...apiSchemaURL.query, 
            ...requestObj.query,
        };
    }
    if (apiSchemaURL.headers || requestObj.headers || serviceConfig.headers) {
        apiSchemaURLInfo.headers = {
            ...serviceConfig.headers,
            ...apiSchemaURL.headers, 
            ...requestObj.headers,
        };
    }
    return apiSchemaInfo;
}