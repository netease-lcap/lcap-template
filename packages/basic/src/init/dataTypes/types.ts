export type TypeAnnotation =
  | {
      typeKind: "primitive";
      typeNamespace: string;
      typeName: string;
      concept: "TypeAnnotation";
    }
  | { typeKind: "reference"; typeName: string; typeNamespace: string; concept: "TypeAnnotation" }
  | {
      typeKind: "union";
      typeArguments: TypeAnnotation[];
      typeName: string;
      typeNamespace: string;
      concept: "TypeAnnotation";
    }
  | {
      typeKind: "anonymousStructure";
      properties: TypeAnnotation[];
      typeName: undefined;
      typeNamespace: undefined;
      concept: "TypeAnnotation";
    }
  | {
      typeKind: "generic";
      typeArguments: TypeAnnotation[];
      typeName: string;
      typeNamespace: string;
      concept: "TypeAnnotation";
    };
type DefaultValue = {
  expression: { concept: "StringLiteral"; value: string | null | undefined } | {} | null;
};
