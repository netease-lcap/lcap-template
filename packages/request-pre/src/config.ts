import { ApiSchemaConfig, ApiSchema } from './api';
import { requestReturn } from './util/request';
export const SKIP_NEXT = {};
export const SKIP_REQUEST = {};
export type apiConfig = Map<string, Function | {
    resolve?: Function;
    reject?: Function;
}>;
interface ConfigHandler {
    params: any;
    resolve?: Function;
    reject?: Function;
}
function getConfig(config: ApiSchemaConfig, configMap: apiConfig, defaultPriority: number): ApiSchemaConfig {
    const priority = config.priority;
    let targetConfig = Object.keys(config).filter((configName): boolean => {
        return configName !== 'priority' && configMap.has(configName);
    });
    if (priority) {
        targetConfig = targetConfig.sort((a, b): number => {
            function formatPriority(num: string): number {
                return (typeof priority[num] === 'number') ? priority[num] : defaultPriority;
            }
            return formatPriority(a) - formatPriority(b);
        });
    }
    return targetConfig.map((configName: string): ConfigHandler => {
        const handler = configMap.get(configName);
        let resolve;
        let reject;
        if (handler) {
            resolve = ('resolve' in handler) ? handler?.resolve : (typeof handler === 'function' ? handler : undefined);
            reject = ('reject' in handler) ? handler.reject : undefined;
        }
        return {
            params: config[configName],
            resolve,
            reject,
        }; 
    });
}
export default {
    async pre(config: ApiSchemaConfig, configMap: apiConfig, initData: any, ctx: ApiSchema): Promise<any> {
        if (config) {
            return getConfig(config, configMap, 50).reduce((pre: Promise<any>, configHandler: ConfigHandler): Promise<any> => {
                return pre.then((prevData: any): void => {
                    if (configHandler.resolve) {
                        return configHandler.resolve(ctx, configHandler.params, prevData);
                    }
                    return prevData;
                }, (error): any => {
                    if (configHandler.reject) {
                        return configHandler.reject(ctx, configHandler.params, error);
                    }
                    return Promise.reject(error);
                });
            }, Promise.resolve(initData));
        }
        return initData;
    },
    async post(config: ApiSchemaConfig, configMap: apiConfig, initData: requestReturn, ctx: ApiSchema): Promise<any> {
        if (config) {
            return getConfig(config, configMap, 50).reduce((pre: requestReturn, configHandler: ConfigHandler): requestReturn => {
                return pre.then((prevData: any): requestReturn => {
                    if (configHandler.resolve) {
                        return configHandler.resolve(prevData, configHandler.params, ctx);
                    }
                    return prevData;
                }, (error): requestReturn => {
                    if (configHandler.reject) {
                        return configHandler.reject(error, configHandler.params, ctx);
                    }
                    return Promise.reject(error);
                });
            }, initData);
        }
        return initData;
    }
};