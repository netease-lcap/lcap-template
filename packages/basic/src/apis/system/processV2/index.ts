import { createService } from "../../../utils";
import api from "./api.json";

type Service<API> = {
  [key in keyof API]: (params?: any) => Promise<any>;
};

const initService = (serviceConfig = {}) => createService(api, serviceConfig) as Service<typeof api>;

export { initService };
