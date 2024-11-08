import { initService as initProcessService } from "../../apis/process";
import authService from "../auth/authService";

let user;
export default {
  async getTasks(
    param: {
      query?: any;
    } = {},
  ) {
    const userInfo = await authService.getUserInfo();
    user = userInfo?.UserName;
    const { query } = param;
    const res = await initProcessService().getTasks({
      query: {
        ...query,
        user,
      },
    });
    return res;
  },
  async claimTask(
    param: {
      path?: any;
    } = {},
  ) {
    const { path = {} } = param;
    const res = await initProcessService().claimTask({
      path: { ...path },
      body: {
        user,
      },
    });
    return res;
  },
  async getDestinationUrl(
    param: {
      path?: any;
    } = {},
  ) {
    const {
      path: { id },
    } = param;
    const res = await initProcessService().getDestinationUrl({
      path: { id },
      query: {
        user,
      },
    });
    return res;
  },
};
