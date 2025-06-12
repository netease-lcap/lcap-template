export type IOptions = {
  typeDefinitionMap: Map<string, TypeDefinition>;
  enumsMap: Record<string, any>;
  dataTypesMap: Record<string, any>;

  toString: (typekey: string, value: any, tz?: string) => any;
  fromString: (value: string, typekey: string) => any;
  throwError: (message: string) => void;

  // 其他选项...
  set?: (arr: any[], index: number, item: any) => any[];
  put?: (map, key, value) => any;
  delete?: (map, key) => any;
};

export type TypeDefinition = {
  typeKind: string;
  typeNamespace: string;
  typeName: string;
};
