import { ApiSchema } from '../api';
export default function postprocess(prevData: any, postprocessFunc, requestInfo: ApiSchema): any {
    return postprocessFunc(prevData, requestInfo);
}