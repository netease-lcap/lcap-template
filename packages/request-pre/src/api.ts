import methods from './methods';
interface DefaultData {
    [key: string]: any;
}
export interface ApiSchemaConfig extends DefaultData {
    mock?: string;
    requestType?: string;
    // todo
    cache?: {
        key?: string;
        max?: number;
        expire?: number;
    };
    cancel?: boolean;
    timeout?: number;
    priority?: {
        [prop: string]: number;
    };
}
interface ApiSchemaMock {
    [key: string]: {
        success: boolean;
        data: any;
    };
}
interface UrlSchema {
    query?: DefaultData;
    body?: any;
    headers?: DefaultData;
    method: methods;
    path: string;
}
type UrlSchemaData = Omit<UrlSchema, 'method' | 'path'> & {
    path?: {
        [key: string]: string;
    };
};
export interface ApiSchema {
    url: UrlSchema;
    config?: ApiSchemaConfig;
    mock?: ApiSchemaMock;
}
export interface ServiceConfig {
    prefix?: string;
    headers?: DefaultData;
    config?: ApiSchemaConfig;
}
export interface ApiSchemaData  extends UrlSchemaData{
    config?: ApiSchemaConfig;
    mock?: ApiSchemaMock;
}
export interface ApiSchemaList {
    [propName: string]: ApiSchema;
}