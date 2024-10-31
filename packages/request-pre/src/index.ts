import { ApiSchemaList, ApiSchemaData, ServiceConfig, ApiSchema } from './api';
import mixin from './util/mixin';
import compose  from './util/compose';
import runConfig, { apiConfig }  from './config';
import mock from './util/mock';
import preprocess from './config/preprocess';
import postprocess from './config/postprocess';
import { requestReturn, createRequestReturn, requester, middleware } from './util/request';
import requestType from './middleware/requestType';

type API<T> = {
    [prop in keyof T]: createRequestReturn;
};
interface APIDynamic {
    [prop: string]: any;
}
class Service {
    public constructor(requester: requester) {
        this.requester = requester;
        this.preConfig = new Map();
        this.postConfig = new Map();
        this.middlewareList = [
            requestType,
        ];
        this.preConfig.set('preprocess', preprocess);
        this.postConfig.set('postprocess', postprocess);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
    public preConfig: apiConfig;
    public postConfig: apiConfig;
    private requester: requester;
    public middlewareList: middleware[];
    public use(middleware: middleware): Service {
        this.middlewareList.push(middleware);
        return this;
    }
    private createRequest(apiName: string, target: Service, middlewareWrap, apiSchemaList: ApiSchemaList, serviceConfig: ServiceConfig): createRequestReturn {
        return function(requestObj: ApiSchemaData): requestReturn {
            const requestInfo = mixin(serviceConfig, apiSchemaList[apiName], requestObj);
            return middlewareWrap(requestInfo, (ctx: ApiSchema): requestReturn => {
                const { config } = ctx;
                let request = runConfig.pre(config, target.preConfig, Promise.resolve(ctx), ctx);
                
                request = request.then((): requestReturn => {
                    if (process.env.NODE_ENV === 'development') {
                        const mockData = mock(ctx);
                        if (mockData) {
                            return mockData;
                        }
                    }
                    return target.requester(ctx);
                });
                return runConfig.post(config, target.postConfig, request, ctx);
            });
        };
    }
    public generator<T extends ApiSchemaList, U extends APIDynamic>(apiSchemaList: T, dynamicServices?: U, serviceConfig?: ServiceConfig): API<T> & U & APIDynamic {
        const middlewareWrap = compose(this.middlewareList);
        const services = Object.create(null);
        if (dynamicServices) {
            Object.keys(dynamicServices).forEach((key): void => {
                services[key] = dynamicServices[key];
            });
        }
        const self = this;
        if (typeof Proxy === 'undefined') {
            Object.keys(apiSchemaList).forEach((apiName): void => {
                services[apiName] = this.createRequest(apiName, this, middlewareWrap, apiSchemaList, serviceConfig);
            });
            return services as API<T> & U & APIDynamic;
        } else {
            return new Proxy(services, {
                get(target, propertyKey: string): createRequestReturn {
                    if (propertyKey in target) {
                        return target[propertyKey];
                    }
                    if (propertyKey in apiSchemaList) {
                        return self.createRequest(propertyKey, self, middlewareWrap, apiSchemaList, serviceConfig);
                    }
                },
                set(target, propertyKey: string, value, receiver: object): boolean {
                    if (propertyKey in apiSchemaList) {
                        if (process.env.NODE_ENV === 'development')
                            console.error(`can not set property ${propertyKey}`);
                        return false;
                    } else {
                        return Reflect.set(target, propertyKey, value, receiver);
                    }
                },
            }) as API<T> & U & APIDynamic;
        }
    }
}
export default Service;
