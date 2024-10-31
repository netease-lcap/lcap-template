import { ApiSchema } from '../api';
export default function preprocess(requestInfo: ApiSchema, preprocessFunc, prevData: any): any {
    return preprocessFunc(requestInfo, prevData);
}