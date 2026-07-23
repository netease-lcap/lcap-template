<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <meta name="renderer" content="webkit" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0,viewport-fit=cover">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <style>
    html,
    body {
      width: 100%;
      height: 100%;
    }
  </style>
</head>

<body>
<div id="app"></div>
<script>
  var LazyLoad = (function (doc) {
    var env,
            head,
            pending = {},
            pollCount = 0,
            queue = {
              css: [],
              js: []
            },
            styleSheets = doc.styleSheets;

    function createNode(name, attrs) {
      var node = doc.createElement(name),
              attr;
      for (attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          node.setAttribute(attr, attrs[attr]);
        }
      }
      return node;
    }

    function finish(type) {
      var p = pending[type],
              callback,
              urls;
      if (p) {
        callback = p.callback;
        urls = p.urls;
        urls.shift();
        pollCount = 0;
        if (!urls.length) {
          callback && callback.call(p.context, p.obj);
          pending[type] = null;
          queue[type].length && load(type);
        }
      }
    }

    function getEnv() {
      var ua = navigator.userAgent;
      env = {
        async: doc.createElement('script').async === true
      };
      (env.webkit = /AppleWebKit\//.test(ua)) || (env.ie = /MSIE|Trident/.test(ua)) || (env.opera = /Opera/.test(ua)) || (env.gecko = /Gecko\//.test(ua)) || (env.unknown = true);
    }

    function load(type, urls, callback, obj, context) {
      var _finish = function () {
                finish(type);
              },
              isCSS = type === 'css',
              nodes = [],
              i,
              len,
              node,
              p,
              pendingUrls,
              url;
      env || getEnv();
      if (urls) {
        urls = typeof urls === 'string' ? [urls] : urls.concat();
        if (isCSS || env.async || env.gecko || env.opera) {
          queue[type].push({
            urls: urls,
            callback: callback,
            obj: obj,
            context: context
          });
        } else {
          for (i = 0, len = urls.length; i < len; ++i) {
            queue[type].push({
              urls: [urls[i]],
              callback: i === len - 1 ? callback : null,
              obj: obj,
              context: context
            });
          }
        }
      }
      if (pending[type] || !(p = pending[type] = queue[type].shift())) {
        return;
      }
      head || (head = doc.head || doc.getElementsByTagName('head')[0]);
      pendingUrls = p.urls.concat();
      for (i = 0, len = pendingUrls.length; i < len; ++i) {
        url = pendingUrls[i];
        if (isCSS) {
          node = env.gecko
                  ? createNode('style')
                  : createNode('link', {
                    href: url,
                    rel: 'stylesheet'
                  });
        } else {
          node = createNode('script', {
            src: url
          });
          node.async = false;
        }
        node.className = 'lazyload';
        node.setAttribute('charset', 'utf-8');
        if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
          node.onreadystatechange = function () {
            if (/loaded|complete/.test(node.readyState)) {
              node.onreadystatechange = null;
              _finish();
            }
          };
        } else if (isCSS && (env.gecko || env.webkit)) {
          if (env.webkit) {
            p.urls[i] = node.href;
            pollWebKit();
          } else {
            node.innerHTML = '@import "' + url + '";';
            pollGecko(node);
          }
        } else {
          node.onload = node.onerror = _finish;
        }
        nodes.push(node);
      }
      for (i = 0, len = nodes.length; i < len; ++i) {
        head.appendChild(nodes[i]);
      }
    }

    function pollGecko(node) {
      var hasRules;
      try {
        hasRules = !!node.sheet.cssRules;
      } catch (ex) {
        pollCount += 1;
        if (pollCount < 200) {
          setTimeout(function () {
            pollGecko(node);
          }, 50);
        } else {
          hasRules && finish('css');
        }
        return;
      }
      finish('css');
    }

    function pollWebKit() {
      var css = pending.css,
              i;
      if (css) {
        i = styleSheets.length;
        while (--i >= 0) {
          if (styleSheets[i].href === css.urls[0]) {
            finish('css');
            break;
          }
        }
        pollCount += 1;
        if (css) {
          if (pollCount < 200) {
            setTimeout(pollWebKit, 50);
          } else {
            finish('css');
          }
        }
      }
    }
    function preload(url) {
      var asAttr = '';
      if (/\.js$/.test(url)) {
        asAttr = 'script';
      } else if (/\.css$/.test(url)) {
        asAttr = 'style';
      }
      var node = createNode('link', {
        href: url,
        as: asAttr,
        rel: 'preload'
      });
      head.appendChild(node);
    }
    return {
      css: function (urls, callback, obj, context) {
        load('css', urls, callback, obj, context);
      },
      js: function (urls, callback, obj, context) {
        load('js', urls, callback, obj, context);
      },
      preload: function (urls) {
        if (Object.prototype.toString.call(urls) === '[object Array]') {
          for (var i = 0; i < urls.length; i++) {
            urls[i] && preload(urls[i]);
          }
        } else {
          urls && preload(urls);
        }
      },
      reset: function () {
        env = undefined;
        head = undefined;
        pending = {};
        pollCount = 0;
        queue = {
          css: [],
          js: []
        };
        styleSheets = doc.styleSheets;
      }
    };
  })(this.document);

  var getPageName = function () {
    var pathname = location.pathname;
    pathname = pathname.split('/');
    window.pageName = pathname[1];
  };
  getPageName();

  var traverse = function (node, func, parent, index) {
    func(node, parent, index);
    Object.values(node).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((child, index) => child && traverse(child, func, node, index));
      } else if (typeof value === 'object') value && traverse(value, func, node, index);
    });
  };
  var parseScript = function (source) {
    if (!source) return;
    var content = source.trim().replace(/export default |module\.exports +=/, 'return ');
    try {
      /* eslint-disable no-eval */
      return eval(`(function(){ ${'$'}{content} })()`);
    } catch (e) {
      console.error(e);
      return {};
    }
  };
  var parseComponent = function (options) {
    if (!options) return;
    var componentOptions = options.script ? parseScript(options.script) : {};
    Object.assign(componentOptions, {
      template: options.template
    });
    console.log(componentOptions);
    window.Vue.config.errorHandler = (err) => {
      console.log(err);
    };
    return window.Vue.extend(componentOptions);
  };

  var compileComponent = function (rootRoute) {
    traverse(rootRoute, function (node, parent, index) {
      node.component = parseComponent(node.component);
    });
  };
  var noLogin = function () {
    window.location.href = '/login';
  };
  var kebab2Camel = function (name) {
    return name.replace(/(?:^|-)([a-zA-Z0-9])/g, (m, $1) => $1.toUpperCase());
  };

  Object.assign(window, {
    LazyLoad, kebab2Camel,
  });
</script>
<script>
  window.UIBasePath = "${uiBasePath}";
</script>
<script src="${uiResourceAddress}?t=${timestamp}" charset="utf-8"></script>
<script>
  var reportSwitch = ${reportSwitch};

  /******/ (function() { // webpackBootstrap
  /******/ 	"use strict";
  if (!reportSwitch) return;
  var __webpack_exports__ = {};

  ;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  ;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  ;// CONCATENATED MODULE: ./src/inject.js


  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  var REQUEST_URL = '//${reportAddress}'; // 请求接口地址占位符
  var STATIC_URL = '//${staticReportAddress}/packages'; // 静态资源地址占位符
  var src = STATIC_URL + "/@lcap/collection-client@1.0.0/dist/index.js";
  var img;
  var script = document.createElement('script');
  var collect = function collect(data) {
    if (data === void 0) {
      data = {};
    }
    if (!window.encodeURIComponent) {
      return;
    }
    var json = JSON.stringify(data);
    var encoded = window.encodeURIComponent(json);
    var prefix = REQUEST_URL + "?data=";
    var link = "" + prefix + encoded;
    img = img || new Image();
    img.src = link;
  };
  var callback = function callback(context, attributes) {
    if (context === void 0) {
      context = {};
    }
    if (attributes === void 0) {
      attributes = {};
    }
    var _context = context,
      deviceKey = _context.deviceKey,
      userId = _context.userId;
    var keys = Object.keys(attributes);
    var others = keys.reduce(function (result, key) {
      if (result === void 0) {
        result = {};
      }
      var _result = result,
        value = _result[key],
        rest = _objectWithoutPropertiesLoose(_result, [key].map(_toPropertyKey));
      return rest;
    }, context);
    collect(_extends({}, others, {
      attributes: attributes,
      deviceUdid: deviceKey,
      deviceUuid: deviceKey,
      userId: userId || deviceKey
    }));
  };
  script.src = src;
  script.onload = function () {
    if (!window.$collection) {
      return;
    }
    window.$collection.subscribe(callback);
    var loop = function loop() {
      if (!window.appInfo) {
        return setTimeout(loop, 1000);
      }
      if (!window.$auth) {
        return setTimeout(loop, 1000);
      }
      (function () {
        var appInfo = window.appInfo || {};
        var appId = appInfo.id;
        window.$collection.init(appId);
      })();
      (function () {
        var $auth = window.$auth || {};
        if (typeof $auth.getUserInfo === 'undefined') {
          return;
        }
        var promise = $auth.getUserInfo();
        var promiseThen = function promiseThen(user) {
          if (user === void 0) {
            user = {};
          }
          var _user = user,
            UserId = _user.UserId;
          window.$collection.login(UserId);
        };
        var promiseCatch = function promiseCatch() {
          window.$collection.login();
        };
        if (!promise) {
          return;
        }
        promise.then(promiseThen)["catch"](promiseCatch);
      })();
    };
    loop();
  };
  document.head.appendChild(script);
  /******/ })()
  ;
</script>

</body>
<!-- 前端模板 -->

</html>