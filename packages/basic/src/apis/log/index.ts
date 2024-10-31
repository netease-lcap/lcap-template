import { createService } from "../../utils";
import api from './api.json';

type Service<API> = {
    [key in keyof API]: (params?: any) => Promise<any>
};

const initService = () => createService(api) as Service<typeof api>;

export {
    initService,
};
