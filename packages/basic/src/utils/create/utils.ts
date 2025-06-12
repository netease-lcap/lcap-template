import safeJSONStringify from "safe-json-stringify";

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
export function stringifyWithLoopProtection(obj: any, replacer?: any, space?: any) {
  let hasCircleProp = false;

  const result = safeJSONStringify(
    obj,
    (key, value) => {
      if (value === "[Circular]") {
        // 循环引用
        hasCircleProp = true;
        return undefined;
      }

      if (typeof replacer === 'function') {
        return replacer(key, value);
      }

      return value;
    },
    space,
  );

  return {
    result,
    hasCircleProp,
  };
}
