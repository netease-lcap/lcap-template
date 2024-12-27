import { sortBy } from "lodash";
import { genSortedTypeKey } from "./tools";

// 类型的优先级如下：Enum Reference > Primitives > Tagged References > Entity > Structure > AnonymousStructure > Map > List
export function sortTypeArgumentsBasedOnTypePriority(typeArguments: TypeAnnotation[]): TypeAnnotation[] {
  // 先应用优先级排序规则 Primitives > Tagged References > Entity > Structure > AnonymousStructure > Map > List
  const firstPass = sortBy(typeArguments, (arg) => {
    const typeKindList = ["primitive", "reference", "anonymous", "generic"] as const;
    if (arg.typeKind === "union") {
      throw new Error("Union类型的typeArguments不能再为union");
    }
    const isNotTaggedReference =
      arg.typeKind !== "reference" ||
      !getTypeDefinition(genSortedTypeKey(arg))?.properties?.some((prop) => prop.name === "errorType");
    return typeKindList.indexOf(arg.typeKind);
  });
  const secondPass = sortBy(firstPass, (arg) => {
    // 应用优先级排序规则：Enum Reference > Others
    const argTypeDef = getTypeDefinition(genSortedTypeKey(arg));
    if (argTypeDef.concept === "Enum") {
      return 0;
    }
    return 1;
  });
  return secondPass;
}
