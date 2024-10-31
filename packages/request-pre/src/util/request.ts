import { ApiSchemaData, ApiSchema } from '../api';
export type requestReturn = Promise<any>;
export type createRequestReturn = (requestObj?: ApiSchemaData) => requestReturn;
export type requester = (requestInfo: ApiSchema) => requestReturn;
export type composeNext = (i?: number) => requestReturn;
export type middleware = (ctx: ApiSchema, next: composeNext) => requestReturn;