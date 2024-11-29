type Nil = null | undefined;
/**
 * 若有定义errorMessage为string，且data中包含errorMsg字段，则直接写入字段尝试替换错误信息
 * @param data
 * @param errorMessage
 */
export function overwriteErrorMsgFieldIfSpecified(
  data: { errorMsg: string | Nil } | {} | Nil,
  errorMessage: string | Nil,
) {
  if (typeof errorMessage === "string" && data) {
    if ("errorMsg" in data) {
      data.errorMsg = errorMessage;
    }
  }
}
