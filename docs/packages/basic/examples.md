# 详细示例

本文档提供一个完整的用户登录 + 数据获取 + 页面跳转的综合示例。

## 场景描述

实现一个完整的用户认证流程：
1. 用户输入用户名密码登录
2. 保存登录凭证
3. 获取用户信息和权限
4. 获取系统配置
5. 根据权限跳转到对应页面

## 完整代码示例

```typescript
import {
  setConfig,
  Config,
  authAPI,
  configurationAPI,
  systemAPI,
  cookie,
  localStorage,
  initAuth,
  initService
} from '@lcap/basic-template';

// ============================================
// 1. 配置阶段
// ============================================
function setupConfig() {
  setConfig({
    // 消息提示
    toast: {
      show: (message: string) => {
        // 实际项目中可以使用组件库的消息提示
        console.log('[提示]', message);
      },
      error: (message: string, stack?: string) => {
        console.error('[错误]', message);
        if (stack) console.error(stack);
      }
    },
    
    // 路由操作
    router: {
      destination: (url: string, target: string = '_self') => {
        if (target === '_blank') {
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      },
      back: () => window.history.back(),
      go: (delta?: number) => window.history.go(delta)
    },
    
    // Axios 配置
    axios: {
      interceptors: [
        // 请求拦截器
        {
          request: {
            onFulfilled: (config) => {
              // 自动添加 Token
              const token = cookie.get('token');
              if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
            },
            onRejected: (error) => Promise.reject(error)
          }
        },
        // 响应拦截器
        {
          response: {
            onFulfilled: (response) => response,
            onRejected: (error) => {
              if (error.response?.status === 401) {
                Config.toast.error('登录已过期，请重新登录');
                Config.router?.destination('/login', '_self');
              }
              return Promise.reject(error);
            }
          }
        }
      ]
    },
    
    // 全局属性
    globalProperties: {
      set: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      get: (key: string) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    }
  });
}

// ============================================
// 2. 登录流程
// ============================================
interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

async function handleLogin(params: LoginParams) {
  try {
    // 参数验证
    if (!params.username || !params.password) {
      Config.toast.error('请输入用户名和密码');
      return { success: false, error: '参数错误' };
    }
    
    // 调用登录 API
    Config.toast.show('登录中...');
    const result = await authAPI.login({
      username: params.username,
      password: params.password
    });
    
    // 保存登录凭证
    if (result.token) {
      // 保存 Token 到 Cookie
      cookie.set('token', result.token, {
        expires: params.remember ? 30 : 1, // 记住我：30天，否则：1天
        path: '/',
        secure: window.location.protocol === 'https:'
      });
      
      // 保存用户信息
      Config.globalProperties.set('userInfo', result.user);
      Config.globalProperties.set('permissions', result.permissions);
      Config.globalProperties.set('loginTime', new Date().toISOString());
    }
    
    Config.toast.show('登录成功！');
    return { success: true, data: result };
    
  } catch (error: any) {
    const errorMsg = error.message || '登录失败，请检查用户名和密码';
    Config.toast.error(errorMsg);
    return { success: false, error: errorMsg };
  }
}

// ============================================
// 3. 获取用户数据
// ============================================
async function loadUserData() {
  try {
    // 并行获取多个数据
    const [userInfo, systemConfig, permissions] = await Promise.all([
      authAPI.getUserInfo(),
      configurationAPI.getConfig(),
      authAPI.getUserPermissions?.() || Promise.resolve([])
    ]);
    
    // 保存到全局
    Config.globalProperties.set('userInfo', userInfo);
    Config.globalProperties.set('systemConfig', systemConfig);
    Config.globalProperties.set('userPermissions', permissions);
    
    return {
      userInfo,
      systemConfig,
      permissions
    };
  } catch (error) {
    Config.toast.error('获取用户数据失败');
    throw error;
  }
}

// ============================================
// 4. 页面跳转逻辑
// ============================================
function redirectByRole(userInfo: any) {
  const role = userInfo?.role || 'user';
  
  switch (role) {
    case 'admin':
      Config.router?.destination('/admin/dashboard', '_self');
      break;
    case 'manager':
      Config.router?.destination('/manager/overview', '_self');
      break;
    case 'user':
    default:
      Config.router?.destination('/home', '_self');
      break;
  }
}

// ============================================
// 5. 完整的登录流程
// ============================================
export async function completeLoginFlow(params: LoginParams) {
  // 步骤 1：配置
  setupConfig();
  
  // 步骤 2：初始化认证模块
  await initAuth();
  await initService();
  
  // 步骤 3：登录
  const loginResult = await handleLogin(params);
  if (!loginResult.success) {
    return loginResult;
  }
  
  // 步骤 4：加载用户数据
  const userData = await loadUserData();
  
  // 步骤 5：根据角色跳转
  redirectByRole(userData.userInfo);
  
  return {
    success: true,
    data: userData
  };
}

// ============================================
// 6. 使用示例
// ============================================

// 在登录页面调用
async function onLoginFormSubmit(formData: LoginParams) {
  const result = await completeLoginFlow(formData);
  
  if (result.success) {
    console.log('登录流程完成，正在跳转...');
  } else {
    console.error('登录失败:', result.error);
  }
}

// 示例调用
onLoginFormSubmit({
  username: 'admin',
  password: '123456',
  remember: true
});
```

## 在 Vue 3 中使用

```vue
<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit">
      <input 
        v-model="form.username" 
        placeholder="用户名"
        required
      />
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="密码"
        required
      />
      <label>
        <input v-model="form.remember" type="checkbox" />
        记住我
      </label>
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { completeLoginFlow } from './auth';

const loading = ref(false);
const form = reactive({
  username: '',
  password: '',
  remember: false
});

async function handleSubmit() {
  loading.value = true;
  
  const result = await completeLoginFlow({
    username: form.username,
    password: form.password,
    remember: form.remember
  });
  
  loading.value = false;
  
  if (!result.success) {
    // 显示错误（实际使用组件库的消息组件）
    alert(result.error);
  }
}
</script>
```

## 在 React 中使用

```tsx
import { useState } from 'react';
import { completeLoginFlow } from './auth';

function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await completeLoginFlow(form);
    
    setLoading(false);
    
    if (!result.success) {
      alert(result.error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.username}
        onChange={e => setForm({...form, username: e.target.value})}
        placeholder="用户名"
        required
      />
      <input
        type="password"
        value={form.password}
        onChange={e => setForm({...form, password: e.target.value})}
        placeholder="密码"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={form.remember}
          onChange={e => setForm({...form, remember: e.target.checked})}
        />
        记住我
      </label>
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}
```

## 关键点说明

1. **配置分离**：将配置逻辑独立出来，便于复用和维护
2. **错误处理**：每个步骤都有完整的错误处理和用户提示
3. **数据持久化**：使用 Cookie 和 LocalStorage 保存关键数据
4. **权限控制**：根据用户角色动态跳转不同页面
5. **拦截器**：自动处理 Token 添加和过期跳转

## 扩展建议

- 添加表单验证（使用 yup 或 zod）
- 集成 UI 组件库的消息提示
- 添加登录状态持久化检查
- 实现刷新 Token 机制
