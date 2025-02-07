import Global from "../../global";
import Config from "../../config";

export const userInfoGuard = async (to, from, next) => {
  try {
    const $auth = Config.globalProperties.get("$auth");
    await $auth.getUserInfo();
  } catch (err) {}
  next();
};
