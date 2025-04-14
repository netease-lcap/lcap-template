import { genInitFromSchema, global, initDataTypes } from '../../../src';
import { typeDefinitionMap } from '../../../src/init/dataTypes/tools';

describe('genInitFromSchema支持tagged-union', () => {
  let sandbox: { singlyTypedDatabaseError: any; unionTypedDatabaseError: any };

  const unionTypeKey = 'nasl.error.InterfaceError | nasl.error.DatabaseError | nasl.core.String';
  beforeAll(() => {
    jest.resetModules();
    initDataTypes({
      dataTypesMap: {
        'nasl.error.InterfaceError | nasl.error.DatabaseError | nasl.core.String': {
          concept: 'TypeAnnotation',
          typeKind: 'union',
          typeArguments: [
            {
              concept: 'TypeAnnotation',
              typeKind: 'reference',
              typeName: 'InterfaceError',
              typeNamespace: 'nasl.error',
            },
            {
              concept: 'TypeAnnotation',
              typeKind: 'reference',
              typeName: 'DatabaseError',
              typeNamespace: 'nasl.error',
            },
            {
              concept: 'TypeAnnotation',
              typeKind: 'primitive',
              typeName: 'String',
              typeNamespace: 'nasl.core',
            },
          ],
        },
        'nasl.error.DatabaseError': {
          concept: 'Structure',
          name: 'DatabaseError',
          properties: [
            {
              concept: 'StructureProperty',
              name: 'errorMsg',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
            },
            {
              concept: 'StructureProperty',
              name: 'errorType',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              defaultValue: {
                concept: 'DefaultValue',
                expression: {
                  concept: 'StringLiteral',
                  value: 'nasl.error.DatabaseError',
                  folded: false,
                },
                playground: [],
              },
              defaultCode: {
                code: '`nasl.error.DatabaseError`',
                executeCode: true,
              },
            },
          ],
        },
        'nasl.error.InterfaceError': {
          concept: 'Structure',
          name: 'InterfaceError',
          properties: [
            {
              concept: 'StructureProperty',
              name: 'errorType',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              defaultValue: {
                concept: 'DefaultValue',
                expression: {
                  concept: 'StringLiteral',
                  value: 'nasl.error.InterfaceError',
                  folded: false,
                },
                playground: [],
              },
              defaultCode: {
                code: '`nasl.error.InterfaceError`',
                executeCode: true,
              },
            },
            {
              concept: 'StructureProperty',
              name: 'errorMsg',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
            },
            {
              concept: 'StructureProperty',
              name: 'responseBody',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
            },
            {
              concept: 'StructureProperty',
              name: 'statusCode',
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
            },
          ],
        },
      },
    });
    sandbox = {
      singlyTypedDatabaseError: genInitFromSchema('nasl.error.DatabaseError', {
        errorType: 'nasl.error.DatabaseError',
        errorMsg: '测试',
      }),
      unionTypedDatabaseError: genInitFromSchema(unionTypeKey, {
        errorType: 'nasl.error.DatabaseError',
        errorMsg: '测试',
      }),
    };
  });
  describe('测试genInitFromSchema返回的值符合预期', () => {
    test('union类型的实例对象形状正确', () => {
      expect(sandbox.unionTypedDatabaseError).toEqual({
        errorType: 'nasl.error.DatabaseError',
        errorMsg: '测试',
      });
    });
    test('单类型的实例对象形状正确', () => {
      expect(sandbox.singlyTypedDatabaseError).toEqual({
        errorType: 'nasl.error.DatabaseError',
        errorMsg: '测试',
      });
    });
    test('单类型的实例和Union类型的实例的TypeConstructor一致，Union类型没有自己的TypeConstructor', () => {
      expect(sandbox.singlyTypedDatabaseError.constructor.toString()).toBe(
        sandbox.unionTypedDatabaseError.constructor.toString(),
      );
    });
  });
  describe('测试typeDefinitionMap能够包含union类型的定义', () => {
    test('支持union类型的typeKey', () => {
      const def = typeDefinitionMap[unionTypeKey];
      expect(def).toEqual({
        concept: 'TypeAnnotation',
        typeKind: 'union',
        typeArguments: [
          {
            concept: 'TypeAnnotation',
            typeKind: 'reference',
            typeName: 'InterfaceError',
            typeNamespace: 'nasl.error',
          },
          {
            concept: 'TypeAnnotation',
            typeKind: 'reference',
            typeName: 'DatabaseError',
            typeNamespace: 'nasl.error',
          },
          {
            concept: 'TypeAnnotation',
            typeKind: 'primitive',
            typeName: 'String',
            typeNamespace: 'nasl.core',
          },
        ],
      });
    });
  });
  describe('子类型性质', () => {
    test('单类型的项的子类型性质', () => {
      expect(global.$isInstanceOf(sandbox.singlyTypedDatabaseError, unionTypeKey)).toBe(true);
      expect(global.$isInstanceOf(sandbox.singlyTypedDatabaseError, 'nasl.error.DatabaseError')).toBe(true);
    });
    test('Union类型的项的子类型性质', () => {
      expect(global.$isInstanceOf(sandbox.unionTypedDatabaseError, 'nasl.error.DatabaseError')).toBe(true);
      expect(global.$isInstanceOf(sandbox.unionTypedDatabaseError, unionTypeKey)).toBe(true);
      expect(global.$isInstanceOf(sandbox.unionTypedDatabaseError, 'nasl.core.String')).toBe(false);
      expect(global.$isInstanceOf(sandbox.unionTypedDatabaseError, 'nasl.error.InterfaceError')).toBe(false);
    });
  });

  describe('字段为空的情形', () => {
    test('字段为null时，所属的构造器仍然正确', () => {
      const unionTypedDatabaseErrorWithNull = genInitFromSchema(unionTypeKey, {
        errorType: 'nasl.error.DatabaseError',
        errorMsg: null,
      });
      expect(global.$isInstanceOf(unionTypedDatabaseErrorWithNull, 'nasl.error.DatabaseError')).toBe(true);
      expect(global.$isInstanceOf(unionTypedDatabaseErrorWithNull, unionTypeKey)).toBe(true);
    });
  });

  describe('形状和union的第一个分支无法完全match', () => {
    test('如存在tag，则不需要考虑形状', () => {
      const unionTypedInterfaceErrorWithNull = genInitFromSchema(unionTypeKey, {
        errorType: 'nasl.error.DatabaseError',
        errorMsg: null,
        responseBody: null,
        statusCode: null,
      });
      expect(global.$isInstanceOf(unionTypedInterfaceErrorWithNull, 'nasl.error.DatabaseError')).toBe(true);
      expect(global.$isInstanceOf(unionTypedInterfaceErrorWithNull, 'nasl.error.InterfaceError')).toBe(false);
      expect(global.$isInstanceOf(unionTypedInterfaceErrorWithNull, unionTypeKey)).toBe(true);
    });
  });
});

describe('genInitFromSchema支持形状推断算法', () => {
  let sandbox = {};

  beforeAll(() => {
    jest.resetModules();
    initDataTypes({
      dataTypesMap: {
        'app.dataSources.defaultDS.entities.StudentInfo': {
          concept: 'Entity',
          name: 'StudentInfo',
          uuid: '0074ac52b5144deaadcf98944e087e89',
          tableName: 'student_info',
          description: null,
          origin: 'ide',
          composedBy: null,
          properties: [
            {
              concept: 'EntityProperty',
              name: 'id',
              uuid: '2224e0401ae04ede9be7bf8eca4a4658',
              columnName: 'id',
              label: '主键',
              description: '主键',
              required: true,
              primaryKey: true,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: false,
                inFilter: false,
                inForm: false,
                inDetail: false,
              },
              rules: [],
              generationRule: 'auto',
              sequence: 'Entity13142650646',
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'Long',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'createdTime',
              uuid: '0386606752e849ff81dd3c371a764f3d',
              columnName: 'created_time',
              label: '创建时间',
              description: '创建时间',
              required: false,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: false,
                inForm: false,
                inDetail: false,
              },
              rules: [],
              generationRule: 'auto',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'DateTime',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'updatedTime',
              uuid: '1ed0260d7a5e4508ad68537f5d3030bd',
              columnName: 'updated_time',
              label: '更新时间',
              description: '更新时间',
              required: false,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: false,
                inForm: false,
                inDetail: false,
              },
              rules: [],
              generationRule: 'auto',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'DateTime',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'createdBy',
              uuid: '5e859762a0de4db983c2cca95d31ba3b',
              columnName: 'created_by',
              label: '创建者',
              description: '创建者',
              required: false,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: false,
                inFilter: false,
                inForm: false,
                inDetail: false,
              },
              rules: [],
              generationRule: 'auto',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'updatedBy',
              uuid: 'c39568c9b3e943aeb079907234e3ec0e',
              columnName: 'updated_by',
              label: '更新者',
              description: '更新者',
              required: false,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: false,
                inFilter: false,
                inForm: false,
                inDetail: false,
              },
              rules: [],
              generationRule: 'auto',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'num',
              uuid: 'e2bd81e4cf3446eabf8dbfc3deb29c05',
              columnName: 'num',
              label: '学号',
              description: null,
              required: true,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: true,
                inForm: true,
                inDetail: true,
              },
              rules: [],
              generationRule: 'manual',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'name',
              uuid: '3dcafc54c17c4710a288b2ff1a6d5462',
              columnName: 'name',
              label: '姓名',
              description: null,
              required: true,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: true,
                inForm: true,
                inDetail: true,
              },
              rules: [],
              generationRule: 'manual',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'age',
              uuid: 'f6ad1a05d9e843779710d6911ed1cb92',
              columnName: 'age',
              label: '年龄',
              description: null,
              required: true,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: true,
                inForm: true,
                inDetail: true,
              },
              rules: [],
              generationRule: 'manual',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'Long',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'EntityProperty',
              name: 'classId',
              uuid: '02b9db06b48e4b529c256469ad0d8318',
              columnName: 'class_id',
              label: '班级',
              description: null,
              required: true,
              primaryKey: false,
              relationNamespace: null,
              relationEntity: null,
              relationProperty: null,
              deleteRule: null,
              display: {
                inTable: true,
                inFilter: true,
                inForm: true,
                inDetail: true,
              },
              rules: [],
              generationRule: 'manual',
              sequence: null,
              composedBy: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'Long',
              },
              databaseTypeAnnotation: null,
              defaultValue: null,
              defaultCode: {},
            },
          ],
          indexes: [],
          applyAnnotations: [
            {
              concept: 'ApplyAnnotation',
              annotationNamespace: '',
              annotationName: 'EntityPermissionAnnotation',
              arguments: [
                {
                  concept: 'Argument',
                  keyword: 'useAnno',
                  spread: false,
                  folded: false,
                  name: 'useAnno',
                  expression: {
                    concept: 'BooleanLiteral',
                    value: 'true',
                    label: null,
                    description: null,
                    folded: false,
                    offsetX: null,
                    offsetY: null,
                    name: null,
                    typeAnnotation: null,
                  },
                },
              ],
            },
          ],
        },
        'app.structures.Structure1': {
          concept: 'Structure',
          name: 'Structure1',
          description: null,
          typeParams: [],
          properties: [
            {
              concept: 'StructureProperty',
              name: 'name',
              label: '姓名',
              description: null,
              jsonName: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'String',
              },
              defaultValue: null,
              defaultCode: {},
            },
            {
              concept: 'StructureProperty',
              name: 'age',
              label: '年龄',
              description: null,
              jsonName: null,
              typeAnnotation: {
                concept: 'TypeAnnotation',
                typeKind: 'primitive',
                typeNamespace: 'nasl.core',
                typeName: 'Long',
              },
              defaultValue: null,
              defaultCode: {},
            },
          ],
        },
        'app.structures.Structure1 | app.dataSources.defaultDS.entities.StudentInfo': {
          typeKind: 'union',
          typeName: 'Union',
          typeNamespace: 'nasl.core',
          concept: 'TypeAnnotation',
          typeArguments: [
            {
              concept: 'TypeAnnotation',
              typeKind: 'reference',
              typeName: 'Structure1',
              typeNamespace: 'app.structures',
            },
            {
              concept: 'TypeAnnotation',
              typeKind: 'reference',
              typeName: 'StudentInfo',
              typeNamespace: 'app.dataSources.defaultDS.entities',
            },
          ],
        },
      },
    });
    sandbox = {};
  });

  describe('同构推断，优先返回第一个', () => {
    test.todo('Entity1{a: String} | Entity2{a: String} | Entity3{a: String} | String');
    test.todo('Entity2{a: String} | Entity1{a: String} | Entity3{a: String} | String');
  });
  describe('非同构推断', () => {
    describe('Structure1{name: String, age: Long} | StudentInfo{name: String, age: Long, id: Long, classId: Long, num: Long, createdTime: DateTime, updatedTime: DateTime, createdBy: String, updatedBy: String}', () => {
      test('StudentInfo形状正确寻找到构造器', () => {
        const studentInfo = genInitFromSchema(
          'app.structures.Structure1 | app.dataSources.defaultDS.entities.StudentInfo',
          {
            id: null,
            createdTime: null,
            updatedTime: null,
            createdBy: null,
            updatedBy: null,
            num: '1001',
            name: '小明',
            age: 15,
            classId: 501,
          },
        );
        expect(global.$isInstanceOf(studentInfo, 'app.dataSources.defaultDS.entities.StudentInfo')).toBe(true);
        expect(global.$isInstanceOf(studentInfo, 'app.structures.Structure1')).toBe(false);
      });

      test('Structure1形状正确寻找到构造器', () => {
        const structure1 = genInitFromSchema(
          'app.structures.Structure1 | app.dataSources.defaultDS.entities.StudentInfo',
          {
            name: '小明',
            age: 15,
          },
        );
        expect(global.$isInstanceOf(structure1, 'app.dataSources.defaultDS.entities.StudentInfo')).toBe(false);
        expect(global.$isInstanceOf(structure1, 'app.structures.Structure1')).toBe(true);
      });
    });
    test.todo('Entity1 | Boolean');
  });
  describe('复杂形状的同构推断', () => {
    test.todo('Entity1{list: List<Entity1>} | Entity2{list: List<Entity2>} | Boolean');
  });
});
