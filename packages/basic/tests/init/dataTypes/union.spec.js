// @ts-check
import { genInitFromSchema, global, initDataTypes } from "../../../src";
import { typeDefinitionMap } from "../../../src/init/dataTypes/tools";

describe("genInitFromSchema支持tagged-union", () => {
  let sandbox = {};

  const unionTypeKey =
    "nasl.error.InterfaceError | nasl.error.DatabaseError | nasl.core.String";
  beforeAll(() => {
    jest.resetModules();
    initDataTypes({
      dataTypesMap: {
        "nasl.error.InterfaceError | nasl.error.DatabaseError | nasl.core.String":
          {
            concept: "TypeAnnotation",
            typeKind: "union",
            typeArguments: [
              {
                concept: "TypeAnnotation",
                typeKind: "reference",
                typeName: "InterfaceError",
                typeNamespace: "nasl.error",
              },
              {
                concept: "TypeAnnotation",
                typeKind: "reference",
                typeName: "DatabaseError",
                typeNamespace: "nasl.error",
              },
              {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeName: "String",
                typeNamespace: "nasl.core",
              },
            ],
          },
        "nasl.error.DatabaseError": {
          concept: "Structure",
          name: "DatabaseError",
          properties: [
            {
              concept: "StructureProperty",
              name: "errorMsg",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
            },
            {
              concept: "StructureProperty",
              name: "errorType",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
              defaultValue: {
                concept: "DefaultValue",
                expression: {
                  concept: "StringLiteral",
                  value: "nasl.error.DatabaseError",
                  folded: false,
                },
                playground: [],
              },
              defaultCode: {
                code: "`nasl.error.DatabaseError`",
                executeCode: true,
              },
            },
          ],
        },
        "nasl.error.InterfaceError": {
          concept: "Structure",
          name: "InterfaceError",
          properties: [
            {
              concept: "StructureProperty",
              name: "errorType",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
              defaultValue: {
                concept: "DefaultValue",
                expression: {
                  concept: "StringLiteral",
                  value: "nasl.error.InterfaceError",
                  folded: false,
                },
                playground: [],
              },
              defaultCode: {
                code: "`nasl.error.InterfaceError`",
                executeCode: true,
              },
            },
            {
              concept: "StructureProperty",
              name: "errorMsg",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
            },
            {
              concept: "StructureProperty",
              name: "responseBody",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
            },
            {
              concept: "StructureProperty",
              name: "statusCode",
              typeAnnotation: {
                concept: "TypeAnnotation",
                typeKind: "primitive",
                typeNamespace: "nasl.core",
                typeName: "String",
              },
            },
          ],
        },
      },
    });
    sandbox = {
      singlyTypedDatabaseError: genInitFromSchema("nasl.error.DatabaseError", {
        errorType: "nasl.error.DatabaseError",
        errorMsg: "测试",
      }),
      unionTypedDatabaseError: genInitFromSchema(unionTypeKey, {
        errorType: "nasl.error.DatabaseError",
        errorMsg: "测试",
      }),
    };
  });
  describe("测试genInitFromSchema返回的值符合预期", () => {
    test("union类型的实例对象形状正确", () => {
      expect(sandbox.unionTypedDatabaseError).toEqual({
        errorType: "nasl.error.DatabaseError",
        errorMsg: "测试",
      });
    });
    test("单类型的实例对象形状正确", () => {
      expect(sandbox.singlyTypedDatabaseError).toEqual({
        errorType: "nasl.error.DatabaseError",
        errorMsg: "测试",
      });
    });
    test("单类型的实例和Union类型的实例的TypeConstructor一致，Union类型没有自己的TypeConstructor", () => {
      expect(sandbox.singlyTypedDatabaseError.constructor.toString()).toBe(
        sandbox.unionTypedDatabaseError.constructor.toString()
      );
    });
  });
  describe("测试typeDefinitionMap能够包含union类型的定义", () => {
    test("支持union类型的typeKey", () => {
      const def = typeDefinitionMap[unionTypeKey];
      expect(def).toEqual({
        concept: "TypeAnnotation",
        typeKind: "union",
        typeArguments: [
          {
            concept: "TypeAnnotation",
            typeKind: "reference",
            typeName: "InterfaceError",
            typeNamespace: "nasl.error",
          },
          {
            concept: "TypeAnnotation",
            typeKind: "reference",
            typeName: "DatabaseError",
            typeNamespace: "nasl.error",
          },
          {
            concept: "TypeAnnotation",
            typeKind: "primitive",
            typeName: "String",
            typeNamespace: "nasl.core",
          },
        ],
      });
    });
  });
  describe("子类型性质", () => {
    test("单类型的项的子类型性质", () => {
      expect(
        global.$isInstanceOf(sandbox.singlyTypedDatabaseError, unionTypeKey)
      ).toBe(true);
      expect(
        global.$isInstanceOf(
          sandbox.singlyTypedDatabaseError,
          "nasl.error.DatabaseError"
        )
      ).toBe(true);
    });
    test("Union类型的项的子类型性质", () => {
      expect(
        global.$isInstanceOf(
          sandbox.unionTypedDatabaseError,
          "nasl.error.DatabaseError"
        )
      ).toBe(true);
      expect(
        global.$isInstanceOf(sandbox.unionTypedDatabaseError, unionTypeKey)
      ).toBe(true);
      expect(
        global.$isInstanceOf(
          sandbox.unionTypedDatabaseError,
          "nasl.core.String"
        )
      ).toBe(false);
      expect(
        global.$isInstanceOf(
          sandbox.unionTypedDatabaseError,
          "nasl.error.InterfaceError"
        )
      ).toBe(false);
    });
  });

  describe("字段为空的情形", () => {
    test("字段为null时，所属的构造器仍然正确", () => {
      const unionTypedDatabaseErrorWithNull = genInitFromSchema(unionTypeKey, {
        errorType: "nasl.error.DatabaseError",
        errorMsg: null,
      });
      expect(
        global.$isInstanceOf(
          unionTypedDatabaseErrorWithNull,
          "nasl.error.DatabaseError"
        )
      ).toBe(true);
      expect(
        global.$isInstanceOf(unionTypedDatabaseErrorWithNull, unionTypeKey)
      ).toBe(true);
    });
  });

  describe("形状和union的第一个分支无法完全match", () => {
    test("尊重tag", () => {
      const unionTypedInterfaceErrorWithNull = genInitFromSchema(unionTypeKey, {
        errorType: "nasl.error.DatabaseError",
        errorMsg: null,
        responseBody: null,
        statusCode: null,
      });
      expect(
        global.$isInstanceOf(
          unionTypedInterfaceErrorWithNull,
          "nasl.error.DatabaseError"
        )
      ).toBe(true);
      expect(
        global.$isInstanceOf(unionTypedInterfaceErrorWithNull, unionTypeKey)
      ).toBe(true);
    });
  });
});

describe("genInitFromSchema支持形状推断算法", () => {
  describe("同构推断，优先返回第一个", () => {
    test.todo(
      "Entity1{a: String} | Entity2{a: String} | Entity3{a: String} | String"
    );
    test.todo(
      "Entity2{a: String} | Entity1{a: String} | Entity3{a: String} | String"
    );
  });
  describe("非同构推断", () => {
    test.todo("Entity1 | Entity2 | String | Boolean");
    test.todo("Entity1 | Boolean");
  });
  describe("复杂形状的同构推断", () => {
    test.todo(
      "Entity1{list: List<Entity1>} | Entity2{list: List<Entity2>} | Boolean"
    );
  });
});
