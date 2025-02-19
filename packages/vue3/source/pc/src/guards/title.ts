import { getComponentOption } from "@/common";

export const getTitleGuard = (appConfig) => (to, from, next) => {
  const metaTitle = to.matched
    .concat()
    .reverse()
    .map((item) => {
      const componentOptions = getComponentOption(item);
      return componentOptions?.meta?.title || item.path.slice(1) || item.meta?.title;
    })
    .filter((i) => i)[0];
  if (metaTitle) {
    if (typeof metaTitle === "function") {
      document.title = metaTitle(to, from);
    } else {
      if (appConfig.documentTitle) {
        document.title = appConfig.documentTitle
          .replace(/\$页面标题/g, metaTitle)
          .replace(/\$应用名称/g, appConfig.project);
      } else {
        document.title = `${metaTitle}-${appConfig.project}`;
      }
    }
  }
  next();
};
