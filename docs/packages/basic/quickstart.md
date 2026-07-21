# 快速开始

本指南将帮助您在 5 分钟内开始使用 `@lcap/basic-template`。

## 安装

### 方式一：在 LCAP 项目中使用（推荐）

如果您使用 `@lcap/vue-template`、`@lcap/vue3-template` 或 `@lcap/react-template`，`basic` 包已作为依赖自动安装：

```json
{
  "dependencies": {
    "@lcap/vue-template": "workspace:*"
    // basic 包已包含在内
  }
}
```

### 方式二：单独安装

```bash
# npm
npm install @lcap/basic-template

# yarn
yarn add @lcap/basic-template

# pnpm
pnpm add @lcap/basic-template
```

## 基础配置

在使用任何功能前，需要先进行基础配置：

```typescript
import { setConfig } from '@lcap/basic-template';

setConfig({
  // 消息提示配置
  toast: {
    show: (message: string, stack?: string) => {
      console.log(message);
    },
    error: (message: string, stack?: string) => {
      console.error(message);
    }
  },
  
  // 路由配置
  router: {
    destination: (url: string, target: string) => {
      window.open(url, target);
    },
    back: () => {
      window.history.back();
    },
    go: (delta?: number) => {
      window.history.go(delta);
    }
  },
  
  // 全局属性配置
  globalProperties: {
    set: (key: string, value: any) => {
      window[key] = value;
    },
    get: (key: string) => {
      return window[key];
    }
  }
});
```

## 第一个示例：用户登录

```typescript
import { setConfig, authAPI, Config } from '@lcap/basic-template';

// 1. 配置（只需一次）
setConfig({
  toast: {
    show: (msg) => alert(msg),
    error: (msg) => alert('错误：' + msg)
  },
  router: {
    destination: (url) => window.location.href = url,
    back: () => window.history.back()
  },
  globalProperties: {
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: (key) => JSON.parse(localStorage.getItem(key) || 'null')
  }
});

// 2. 登录
async function login() {
  try {
    const result = await authAPI.login({
      username: 'admin',
      password: '123456'
    });
    
    console.log('登录成功', result);
    
    // 保存用户信息
    Config.globalProperties.set('userInfo', result.user);
    
    // 跳转到首页
    Config.router?.destination('/home', '_self');
    
  } catch (error) {
    console.error('登录失败', error);
    Config.toast.error('登录失败，请检查用户名和密码');
  }
}

// 3. 执行登录
login();
```

## 常用功能速览

### 1. 认证相关

```typescript
import { authAPI } from '@lcap/basic-template';

// 登录
await authAPI.login({ username: 'admin', password: '123' });

// 登出
await authAPI.logout();

// 获取用户信息
const user = await authAPI.getUserInfo();

// 检查是否登录
const isLogin = await authAPI.isLogin();
```

### 2. 数据存储

```typescript
import { cookie, localStorage } from '@lcap/basic-template';

// Cookie
cookie.set('token', 'abc123', { expires: 7 });
cookie.get('token');
cookie.remove('token');

// LocalStorage
localStorage.setItem('user', { name: 'admin' });
localStorage.getItem('user');
localStorage.removeItem('user');
```

### 3. 系统配置

```typescript
import { configurationAPI } from '@lcap/basic-template';

// 获取系统配置
const config = await configurationAPI.getConfig();

// 获取特定配置项
const theme = await configurationAPI.getConfigItem('theme');
```

### 4. 流程操作

```typescript
import { processAPI } from '@lcap/basic-template';

// 启动流程
await processAPI.startProcess('leaveApproval', {
  days: 3,
  reason: '休假'
});

// 获取待办任务
const tasks = await processAPI.getTodoList();
```

## 初始化流程

对于完整的应用，建议按顺序初始化：

```typescript
import {
  setConfig,
  initAuth,
  initDataTypes,
  initService,
  initRouter,
  initLogic,
  initProcess,
  initUtils
} from '@lcap/basic-template';

async function bootstrap() {
  // 1. 基础配置
  setConfig({
    toast: { show: alert, error: alert },
    router: { destination: (url) => location.href = url, back: () => history.back() },
    globalProperties: {
      set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
      get: (k) => JSON.parse(localStorage.getItem(k) || 'null')
    }
  });
  
  // 2. 按顺序初始化
  await initAuth();      // 认证初始化
  await initDataTypes(); // 数据类型初始化
  await initService();   // 服务初始化
  await initRouter();    // 路由初始化
  await initLogic();     // 逻辑初始化
  await initProcess();   // 流程初始化
  await initUtils();     // 工具初始化
  
  console.log('应用初始化完成');
}

bootstrap();
```

## 在 Vue 中使用

```vue
<script setup>
import { onMounted } from 'vue';
import { authAPI, systemAPI } from '@lcap/basic-template';

const userInfo = ref(null);
const systemConfig = ref(null);

onMounted(async () => {
  // 获取用户信息
  userInfo.value = await authAPI.getUserInfo();
  
  // 获取系统配置
  systemConfig.value = await systemAPI.getSystemInfo();
});

async function handleLogout() {
  await authAPI.logout();
  window.location.href = '/login';
}
</script>
```

## 在 React 中使用

```tsx
import { useEffect, useState } from 'react';
import { authAPI, systemAPI } from '@lcap/basic-template';

function UserProfile() {
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    authAPI.getUserInfo().then(data => {
      setUserInfo(data);
    });
  }, []);
  
  const handleLogout = async () => {
    await authAPI.logout();
    window.location.href = '/login';
  };
  
  return (
    <div>
      <h1>欢迎, {userInfo?.name}</h1>
      <button onClick={handleLogout}>退出登录</button>
    </div>
  );
}
```

## 下一步

- [配置系统](./config) - 深入了解配置机制
- [API 模块](./apis) - 学习各 API 模块详细使用
- [工具函数](./utils) - 掌握工具函数使用
- [详细示例](./examples) - 查看完整使用场景
