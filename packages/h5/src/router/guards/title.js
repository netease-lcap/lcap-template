import { getComponentOption } from "@lcap/core-template";

export const getTitleGuard = (appConfig) => (to, from, next) => {
  const basePath = appConfig.basePath;
  const appendTitle = (title) => title;
  const metaTitle = to.matched
    .concat()
    .reverse()
    .map((item) => {
      const componentOptions = getComponentOption(item);
      return componentOptions?.meta?.title || item.path.replace(basePath, "").slice(1) || item.meta?.title;
    })
    .filter((i) => i)[0];
  if (metaTitle) {
    document.title = appendTitle(typeof metaTitle === "function" ? metaTitle(to, from) : metaTitle);
  }
  next();
};
