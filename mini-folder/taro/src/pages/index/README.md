# H5 与 小程序通信规范

## data 结构

```json
{
  "data": {
    // 必须，调用方法
    "method": "requestSubscribeMessage", 
    // 可选
    "params": { 
      // 与method对应的参数
      "tmplIds": ["TEMPLATE_ID1", "TEMPLATE_ID2"] 
    },
  }
}
```
