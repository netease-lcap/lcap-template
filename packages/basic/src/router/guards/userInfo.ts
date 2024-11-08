import Global from "../../global";

export const userInfoGuard = async (to, from, next) => {
  try {
    await Global.prototype.$auth.getUserInfo();
  } catch (err) {}
  next();
};
