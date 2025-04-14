let mockUser = {
  UserId: 'f4519f848aab479e8bb9dd7c8506e86a',
  UserName: '预览用户',
  LastLoginTime: 1665970625290,
  LoginCount: 2,
  Status: 'normal',
  CreateTime: 1665629607385,
  UpdateTime: 1665970625290,
  Source: 'Normal',
  Env: 'dev',
  ThirdUserId: '',
};
export const createMockServiceByData = (api, data, allLogics = {}) => {
  if (api === 'GetUser') {
    data = { Data: mockUser };
  } else if (api === 'GetUserResources') {
    let roles = JSON.parse(window?.allMockData?.roles);
    let currRole = roles?.currentRole || 'DEV-AdminRole';
    let PList = roles.roleResourceMappingList || [
      { resourceType: 'ui', resourcePath: '/permission_center/resourceManagement', roleName: 'DEV-AdminRole' },
      { resourceType: 'ui', resourcePath: '/permission_center/addRoleUser', roleName: 'DEV-AdminRole' },
      { resourceType: 'ui', resourcePath: '/permission_center/roleManagement', roleName: 'DEV-AdminRole' },
      { resourceType: 'ui', resourcePath: '/permission_center/userManagement', roleName: 'DEV-AdminRole' },
      { resourceType: 'ui', resourcePath: '/permission_center', roleName: 'DEV-AdminRole' },
    ];
    data = PList.filter((it) => it.roleName === currRole).map((it) => {
      return {
        resourceValue: it.resourcePath,
        resourceType: 'ui',
      };
    });
  }
  async function mockRequest(...args) {
    console.log('请求了mock接口: ', api, args, data);
    return Promise.resolve(data);
  }
  !allLogics[api] && (allLogics[api] = mockRequest);
  return allLogics;
};
