import { requestReturn, middleware } from './request';
import { ApiSchema } from '../api';
export type composeEnd = (ctx: ApiSchema) => requestReturn;
export type middlewareEnd = (ctx: ApiSchema, next: composeEnd) => requestReturn;

export default function(middlewareList: middleware[]): middlewareEnd {
    return function (ctx: ApiSchema, next: composeEnd): requestReturn {
        let index = -1;
        const dispatch = function(i: number): requestReturn {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middlewareList[i];
            if (i === middlewareList.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve(ctx);
            } else {
                return Promise.resolve(fn(ctx, fn === next ? undefined : dispatch.bind(null, i + 1)));
            }
        };
        return dispatch(0);
    };
}