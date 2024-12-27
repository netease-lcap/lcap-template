import { sortBy } from "lodash";
import { genSortedTypeKey, getTypeDefinition } from "./tools";

/**
 * 根据如下优先级排序类型：Enum Reference > Primitives > Tagged References > Entity > Structure > AnonymousStructure > Map > List
 * @param typeArguments 待排序的types
 * @returns
 */
export function sortTypeArgumentsBasedOnTypePriority(typeArguments: TypeAnnotation[]): TypeAnnotation[] {
  const firstPass = sortBy(typeArguments, (arg) => {
    // 应用优先级排序规则 Primitives > Tagged References > Entity > Structure > AnonymousStructure > Map > List
    const typeKindListOrderedByPriority = ["primitive", "reference", "anonymous", "generic"] as const;
    if (arg.typeKind === "union") {
      throw new Error("Union类型的typeArguments不能再为union");
    }
    const priority = typeKindListOrderedByPriority.indexOf(arg.typeKind);
    if (isTaggedReferenceType(arg)) {
      return [1, priority];
    } else {
      return [0, priority];
    }
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

  function isTaggedReferenceType(typeAnnotation: TypeAnnotation): boolean {
    return (
      typeAnnotation.typeKind === "reference" &&
      // @ts-expect-error
      getTypeDefinition(genSortedTypeKey(typeAnnotation))?.properties?.some((prop) => prop.name === "errorType")
    );
  }
}
