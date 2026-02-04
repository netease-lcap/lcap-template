# Basic 包使用指南

## 基本使用

### 导入方式

```typescript
// 导入整个库
import * as BasicTemplate from '@lcap/basic-template';

// 或按需导入
import { Config, setConfig, Global, global } from '@lcap/basic-template';

// 导入特定模块
import { authAPI } from '@lcap/basic-template';
import { initAuth } from '@lcap/basic-template';
```

### 模块化导入建议

```typescript
// ✅ 推荐：按需导入
import { authAPI, Config } from '@lcap/basic-template';

// ❌ 不推荐：导入整个库
import * as BasicTemplate from '@lcap/basic-template';
```

## 配置应用

### 基本配置

```typescript
import { setConfig } from '@lcap/basic-template';

// 设置应用配置
setConfig({
  toast: {
    show: (message) => console.log(message),
    error: (message) => console.error(message)
  },
  router: {
    destination: (url, target) => window.open(url, target),
    back: () => window.history.back(),
    go: (delta) => window.history.go(delta)
  },
  globalProperties: {
    set: (key, value) => window[key] = value,
    get: (key) => window[key]
  }
});
```

### 配置管理最佳实践

```typescript
// ✅ 推荐：集中配置
const config = {
  toast: { 
    show: (message, stack) => {
      // 自定义提示实现
      console.log('Toast:', message);
      if (stack) console.error('Stack:', stack);
    },
    error: (message, stack) => {
      // 自定义错误提示实现
      console.error('Error:', message);
      if (stack) console.error('Stack:', stack);
    }
  },
  router: { 
    destination: (url, target) => {
      if (target === '_blank') {
        window.open(url, target);
      } else {
        window.location.href = url;
      }
    },
    back: () => window.history.back(),
    go: (delta) => window.history.go(delta)
  },
  globalProperties: {
    set: (key, value) => {
      window[key] = value;
    },
    get: (key) => window[key]
  }
};
setConfig(config);

// ❌ 不推荐：分散配置
setConfig({ toast: { /* ... */ } });
setConfig({ router: { /* ... */ } });
```

## 初始化应用

### 完整初始化流程

```typescript
import { 
  initAuth, 
  initDataTypes, 
  initService, 
  initRouter,
  initLogic,
  initProcess,
  initUtils
} from '@lcap/basic-template';

async function initApp() {
  try {
    // 按顺序初始化各模块
    await initAuth();
    console.log('✅ 认证模块初始化完成');
    
    await initDataTypes();
    console.log('✅ 数据类型初始化完成');
    
    await initService();
    console.log('✅ 服务初始化完成');
    
    await initRouter();
    console.log('✅ 路由初始化完成');
    
    await initLogic();
    console.log('✅ 逻辑初始化完成');
    
    await initProcess();
    console.log('✅ 流程初始化完成');
    
    await initUtils();
    console.log('✅ 工具初始化完成');
    
    console.log('🎉 应用初始化完成');
  } catch (error) {
    console.error('❌ 应用初始化失败:', error);
    throw error;
  }
}

// 执行初始化
initApp();
```

### 条件初始化

```typescript
import { initAuth, initDataTypes } from '@lcap/basic-template';

// 根据环境条件进行初始化
async function conditionalInit() {
  const needsAuth = checkAuthRequirement();
  const needsDataTypes = checkDataTypesRequirement();
  
  if (needsAuth) {
    await initAuth();
  }
  
  if (needsDataTypes) {
    await initDataTypes();
  }
}
```

## API 使用示例

### 认证 API

```typescript
import { authAPI } from '@lcap/basic-template';

// 用户登录
async function login(username: string, password: string) {
  try {
    const result = await authAPI.login({
      username,
      password
    });
    
    if (result.success) {
      console.log('登录成功:', result.data);
      return result.data;
    } else {
      console.error('登录失败:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('登录异常:', error);
    throw error;
  }
}

// 用户登出
async function logout() {
  try {
    await authAPI.logout();
    console.log('登出成功');
  } catch (error) {
    console.error('登出失败:', error);
  }
}

// 获取当前用户信息
async function getCurrentUser() {
  try {
    const userInfo = await authAPI.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}
```

### 系统 API

```typescript
import { systemAPI } from '@lcap/basic-template';

// 获取系统信息
async function getSystemInfo() {
  try {
    const systemInfo = await systemAPI.getSystemInfo();
    console.log('系统信息:', systemInfo);
    return systemInfo;
  } catch (error) {
    console.error('获取系统信息失败:', error);
    return null;
  }
}

// 获取系统配置
async function getSystemConfig() {
  try {
    const config = await systemAPI.getSystemConfig();
    return config;
  } catch (error) {
    console.error('获取系统配置失败:', error);
    return {};
  }
}
```

### 配置 API

```typescript
import { configurationAPI } from '@lcap/basic-template';

// 获取配置项
async function getConfigValue(key: string) {
  try {
    const value = await configurationAPI.getConfig(key);
    return value;
  } catch (error) {
    console.error(`获取配置 ${key} 失败:`, error);
    return null;
  }
}

// 设置配置项
async function setConfigValue(key: string, value: any) {
  try {
    await configurationAPI.setConfig(key, value);
    console.log(`配置 ${key} 设置成功`);
  } catch (error) {
    console.error(`设置配置 ${key} 失败:`, error);
  }
}
```

### IO API

```typescript
import { ioAPI } from '@lcap/basic-template';

// 文件上传
async function uploadFile(file: File) {
  try {
    const result = await ioAPI.uploadFile(file);
    console.log('文件上传成功:', result);
    return result;
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
}

// 文件下载
async function downloadFile(fileId: string) {
  try {
    const blob = await ioAPI.downloadFile(fileId);
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file-${fileId}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('文件下载成功');
  } catch (error) {
    console.error('文件下载失败:', error);
    throw error;
  }
}
```

## 工具函数使用

### Cookie 工具

```typescript
import { cookie } from '@lcap/basic-template';

// 设置 Cookie
cookie.set('token', 'abc123', {
  expires: 7, // 7天过期
  path: '/',
  secure: true,
  sameSite: 'Strict'
});

// 获取 Cookie
const token = cookie.get('token');
console.log('Token:', token);

// 删除 Cookie
cookie.remove('token', { path: '/' });

// 检查 Cookie 是否存在
const hasToken = cookie.has('token');
console.log('Has token:', hasToken);

// 获取所有 Cookie
const allCookies = cookie.getAll();
console.log('All cookies:', allCookies);
```

### 本地存储工具

```typescript
import { localStorage, sessionStorage } from '@lcap/basic-template';

// localStorage 操作
localStorage.setItem('userInfo', { 
  name: 'admin', 
  email: 'admin@example.com',
  lastLogin: new Date().toISOString()
});

const userInfo = localStorage.getItem('userInfo');
console.log('用户信息:', userInfo);

// 设置过期时间的存储
localStorage.setItemWithExpiry('tempData', { data: 'test' }, 60000); // 60秒过期

const tempData = localStorage.getItemWithExpiry('tempData');
console.log('临时数据:', tempData);

// 清除过期数据
localStorage.clearExpired();

// sessionStorage 操作
sessionStorage.setItem('currentPage', '/dashboard');
const currentPage = sessionStorage.getItem('currentPage');
console.log('当前页面:', currentPage);
```

### 路由工具

```typescript
import { routeUtils } from '@lcap/basic-template';

// 构建 URL
const url = routeUtils.buildUrl('/api/users', { 
  page: 1, 
  limit: 20,
  sort: 'createdAt'
});
console.log('构建的 URL:', url); // /api/users?page=1&limit=20&sort=createdAt

// 解析 URL 参数
const params = routeUtils.parseUrlParams('/api/users?page=1&limit=20');
console.log('解析的参数:', params); // { page: '1', limit: '20' }

// 添加查询参数
const newUrl = routeUtils.addQueryParam('/api/users', 'active', 'true');
console.log('新 URL:', newUrl); // /api/users?active=true

// 移除查询参数
const cleanUrl = routeUtils.removeQueryParam('/api/users?page=1&active=true', 'page');
console.log('清理后的 URL:', cleanUrl); // /api/users?active=true
```

### URL 编码工具

```typescript
import { encodeUrl } from '@lcap/basic-template';

// URL 编码
const encodedUrl = encodeUrl.encode('/api/user', { id: 123, name: 'John Doe' });
console.log('编码后的 URL:', encodedUrl);

// URL 解码
const decoded = encodeUrl.decode(encodedUrl);
console.log('解码后的数据:', decoded);

// 路径参数编码
const encodedPath = encodeUrl.encodePath('/users/{id}', { id: 'user@123' });
console.log('编码后的路径:', encodedPath);
```

## 错误处理

### 统一错误处理

```typescript
import { Config } from '@lcap/basic-template';

// ✅ 推荐：统一错误处理
async function handleAsyncOperation() {
  try {
    const result = await someAPICall();
    return result;
  } catch (error) {
    const errorMessage = error.message || '操作失败';
    const errorStack = error.stack || '';
    
    // 使用配置的 toast 显示错误
    Config.toast.error(errorMessage, errorStack);
    
    // 记录日志
    console.error('操作失败:', error);
    
    throw error;
  }
}

// 包装 API 调用的错误处理
async function safeAPICall(apiFunction: Function, ...args: any[]) {
  try {
    return await apiFunction(...args);
  } catch (error) {
    Config.toast.error(`API 调用失败: ${error.message}`);
    throw error;
  }
}
```

## 类型安全

### 使用类型定义

```typescript
import type { ConfigType } from '@lcap/basic-template';

// ✅ 推荐：使用类型定义
const config: ConfigType = {
  toast: {
    show: (message: string, stack?: string) => {
      console.log(message);
    },
    error: (message: string, stack?: string) => {
      console.error(message);
    }
  },
  utils: {},
  router: {
    destination: (url: string, target: string) => {
      window.open(url, target);
    },
    back: () => window.history.back(),
    go: (delta?: number) => window.history.go(delta)
  },
  axios: {
    interceptors: []
  },
  globalProperties: {
    set: (key: string, value: any) => {
      window[key] = value;
    },
    get: (key: string) => window[key]
  }
};
```

## 最佳实践

### 1. 模块化使用

```typescript
// 按功能模块组织导入
import { 
  authAPI, 
  systemAPI 
} from '@lcap/basic-template/apis';

import { 
  initAuth, 
  initDataTypes 
} from '@lcap/basic-template/init';

import { 
  cookie, 
  localStorage 
} from '@lcap/basic-template/utils';
```

### 2. 配置集中管理

```typescript
// 创建配置工厂
function createAppConfig(environment: 'development' | 'production'): ConfigType {
  const baseConfig = {
    toast: { /* ... */ },
    router: { /* ... */ },
    globalProperties: { /* ... */ }
  };
  
  if (environment === 'production') {
    // 生产环境特定配置
  } else {
    // 开发环境特定配置
  }
  
  return baseConfig;
}

// 使用配置
const config = createAppConfig(process.env.NODE_ENV as any);
setConfig(config);
```

### 3. 错误边界处理

```typescript
// 创建错误边界
class AppErrorBoundary {
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      console.error('Operation failed:', error);
      Config.toast.error(`操作失败: ${error.message}`);
      return fallback;
    }
  }
}

// 使用错误边界
const result = await AppErrorBoundary.withErrorHandling(
  () => authAPI.login(credentials),
  null // 失败时返回 null
);
```

---

**使用指南**为 AI 代理提供详细的代码示例和最佳实践，帮助正确使用 Basic 包的各个功能模块。