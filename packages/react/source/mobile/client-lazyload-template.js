export default function (templateParameters) {
  const { htmlWebpackPlugin } = templateParameters;
  const files = htmlWebpackPlugin.files;
  const jsAssets = files.js;
  const cssAssets = files.css;
  const lazyLoadCommand = `window.LazyLoad.js(${JSON.stringify(jsAssets)});\nwindow.LazyLoad.css(${JSON.stringify(cssAssets)})`;
  return `(function(){${lazyLoadCommand};})();`;
}
