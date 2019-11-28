# http请求监控http-listeners

- 可全局监控XMLHttpRequest(Ajax)和fetch的请求的请求参数，响应体，响应时间。用于日后的日志分析

## 使用

- 安装

```javascript
npm i --save http-listeners
```

或者

```javascript
cnpm i --save http-listeners
```

- 全局调用即可

```javascript
import ajaxListener from 'http-listeners'

// 初始化
ajaxListener.init({
  sysApiPrefix: 'api', // 要监控的API前缀，为了去除掉不必要的请求
  filterApiPrefix: '/api/fly' // 要去除的api前缀，主要是为了防止上报接口
})
// 监听
ajaxListener.intercept = (data) => {
  console.log(data)
}
```

## API

### ajaxListener.init

- 方法    监听初始化
- Params   obj

| 字段            | 说明            | 必须 |
| --------------- | --------------- | ---- |
| sysApiPrefix    | 要监控的API前缀 | N    |
| filterApiPrefix | 要去除的api前缀 | N    |

- 示例

```javascript
ajaxListener.init({
  sysApiPrefix: 'api', // 要监控的API前缀，为了去除掉不必要的请求
  filterApiPrefix: '/api/fly' // 要去除的api前缀，主要是为了防止上报接口
})
```

### ajaxListener.intercept

- 方法的定义（回调函数）   监听
- data  obj
- data说明

| 字段         | 说明               | 示例值                                                 |
| ------------ | ------------------ | ------------------------------------------------------ |
| querys       | 路径参数           | {name:'zhao', age: 11}                                 |
| url          | url                | https://github.com/zhaodeezhu/http-listeners           |
| path         | 包含query参数的url | https://github.com/zhaodeezhu/http-listeners?name=zhao |
| os           | 操作系统           | win7                                                   |
| browser      | 浏览器版本         | Chrome 78.0.3904.108                                   |
| responseText | 响应体             |                                                        |
| resTime      | 接口响应时间ms     | 235                                                    |

- 示例

```javascript
// 监听
ajaxListener.intercept = (data) => {
  console.log(data)
}
```

