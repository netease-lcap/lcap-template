type Nil = null | undefined;
/**
 * 若有定义errorMessage为string，且data中包含errorMsg字段，则直接写入字段尝试替换错误信息
 * @param data
 * @param errorMessage
 */
export function overwriteErrorMsgFieldIfSpecified(
  data: (Record<string, unknown> & { errorMsg?: string | Nil }) | Nil,
  errorMessage: string | Nil,
) {
  if (typeof errorMessage === "string" && data) {
    if ("errorMsg" in data) {
      data.errorMsg = errorMessage;
    }
  }
}

/**
 * stringfy 过滤掉 function 和循环引用
 * */
export function stringifyWithLoopProtection(obj, replacer?, space?) {
  const seen = new WeakSet();
  let hasCircleProp = false;
  const result = JSON.stringify(
    obj,
    function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          hasCircleProp = true;
          // 如果已经见过该对象，则返回undefined;
          return undefined;
        }
        seen.add(value);
      }
      // 使用用户提供的replacer函数（如果有的话）
      if (replacer) {
        return replacer(key, value);
      } else {
        return value;
      }
    },
    space,
  );

  return {
    result,
    hasCircleProp,
  };
}
