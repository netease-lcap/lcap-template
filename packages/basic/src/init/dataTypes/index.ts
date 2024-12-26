import { processPorts } from "../process";

import Config from "../../config";
import Global from "../../global";

import { initApplicationConstructor, genInitData, isInstanceOf, genSortedTypeKey } from "./tools";
import * as Utils from "./utils";

function initDataTypes(options) {
  const dataTypesMap = options.dataTypesMap || {};
  const i18nInfo = options.i18nInfo || {};
  initApplicationConstructor(dataTypesMap, genInitFromSchema);

  // 一定要放在getFrontendVariables之前，因为Vue应用翻译的代码会用到这个
  window.$genInitFromSchema = genInitFromSchema;
  Global.prototype.$genInitFromSchema = genInitFromSchema;
  const { frontendVariables, localCacheVariableSet } = getFrontendVariables(options);

  const $global = {
    // 用户信息
    userInfo: {},
    // 国际化信息
    i18nInfo: i18nInfo,
    // 前端全局变量
    frontendVariables,

    ...Utils,
    ...(Config.utils || {}),
  };

  Object.keys(processPorts).forEach((service) => {
    $global[service] = processPorts[service];
  });

  // Vue版本需要响应式
  try {
    new Global({
      data: {
        $global,
      },
    });
  } catch (error) {
    console.error("Vue版本给$global创建响应式失败", error);
  }

  window.$global = $global;

  Global.prototype.$global = $global;
  Global.prototype.$localCacheVariableSet = localCacheVariableSet;
  window.$isInstanceOf = isInstanceOf;
  Global.prototype.$isInstanceOf = isInstanceOf;
  // 判断两个对象是否相等，不需要引用完全一致
  Global.prototype.$isLooseEqualFn = isLooseEqualFn;
  Global.prototype.$resolveRequestData = resolveRequestData;

  const enumsMap = options.enumsMap || {};
  Global.prototype.$enums = (key, value) => {
    if (!key || !value) return "";
    if (enumsMap[key]) {
      return enumsMap[key][value];
    } else {
      return "";
    }
  };

  return {
    $global,
  };
}

/**
 * 根据typeKey寻找对应类型的定义，并生成此类型的初始值
 * @param typeKey 类型标识符
 * @param defaultValue 可选的默认值
 * @param level 当前深度。用于递归初始化时截断递归。
 * @returns 此类型的初始值。若找不到此类型则返回undefined。
 */
function genInitFromSchema(typeKey, defaultValue?, level?) {
  return genInitData(typeKey, defaultValue, level);
}

function getFrontendVariables(options) {
  const frontendVariables = {};
  const localCacheVariableSet = new Set();
  if (Array.isArray(options && options.frontendVariables)) {
    options.frontendVariables.forEach((frontendVariable) => {
      const { name, typeAnnotation, defaultValueFn, defaultCode, localCache } = frontendVariable;
      localCache && localCacheVariableSet.add(name); // 本地存储的全局变量集合
      let defaultValue = defaultCode?.code;
      if (Object.prototype.toString.call(defaultValueFn) === "[object Function]") {
        defaultValue = defaultValueFn(Global);
      }
      frontendVariables[name] = genInitFromSchema(genSortedTypeKey(typeAnnotation), defaultValue);
    });
  }
  return {
    frontendVariables,
    localCacheVariableSet,
  };
}

function isLooseEqualFn(obj1, obj2, cache = new Map()) {
  // 检查对象是否相同
  if (obj1 === obj2) {
    return true;
  }
  // 对象是否已经比较过，解决循环依赖的问题
  if (cache.has(obj1) && cache.get(obj1) === obj2) {
    return true;
  }
  // 判断类型相等
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  // 判断数组长度或者对象属性数量一致
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  // 加入缓存中
  cache.set(obj1, obj2);
  // 比较属性中的每个值是否一致
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    // 递归
    if (typeof val1 === "object" && typeof val2 === "object") {
      if (!isLooseEqualFn(val1, val2, cache)) {
        return false;
      }
    } else {
      // 判断非对象的值是否一致
      if (val1 !== val2) {
        return false;
      }
    }
  }
  return true;
}

// 实体的 updateBy 和 deleteBy 需要提前处理请求参数
function resolveRequestData(root) {
  if (!root) return;
  // console.log(root.concept)
  delete root.folded;

  if (root.concept === "NumericLiteral") {
    // eslint-disable-next-line no-self-assign
    root.value = root.value;
  } else if (root.concept === "StringLiteral") {
    // eslint-disable-next-line no-self-assign
    root.value = root.value;
  } else if (root.concept === "NullLiteral") {
    delete root.value;
  } else if (root.concept === "BooleanLiteral") {
    root.value = root.value === "true";
  } else if (root.concept === "Identifier") {
    parseRequestDataType.call(this, root, "expression");
  } else if (root.concept === "MemberExpression") {
    if (root.expression) {
      parseRequestDataType.call(this, root, "expression");
    }
  }
  resolveRequestData.call(this, root.left);
  resolveRequestData.call(this, root.right);
  return root;
}

// 实体的 updateBy 和 deleteBy 需要提前处理请求参数
function parseRequestDataType(root, _prop) {
  let value;
  try {
    // eslint-disable-next-line no-eval
    value = eval(root[_prop]);
  } catch (err) {
    value = root.value;
  }
  const type = typeof value;
  // console.log('type:', type, value)
  if (type === "number") {
    root.concept = "NumericLiteral";
    root.value = value + "";
  } else if (type === "string") {
    root.concept = "StringLiteral";
    root.value = value;
  } else if (type === "boolean") {
    root.concept = "BooleanLiteral";
    root.value = value;
  } else if (type === "object") {
    if (Array.isArray(value)) {
      const itemValue = value[0];
      if (itemValue !== undefined) {
        const itemType = typeof itemValue;
        root.concept = "ListLiteral";
        if (itemType === "number") {
          root.value = value.map((v) => v + "").join(",");
        } else if (itemType === "string") {
          root.value = value.map((v) => "'" + v + "'").join(",");
        } else if (itemType === "boolean") {
          root.value = value.join(",");
        }
      }
    }
  }
}

export {
  initDataTypes,
  genInitFromSchema,
  getFrontendVariables,
  isLooseEqualFn,
  resolveRequestData,
  parseRequestDataType,
  Utils,
};

export * as Tools from "./tools";

export * as wx from "./wx";
