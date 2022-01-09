### Neting-Web

开发调试：

```
yarn run start
```

编译发布：

```
npm run build
```



在 Constants.js 中，可以配置后端地址。

```
export const Options = {
    host: "http://127.0.0.1:80"  // 开发配置
    // host: ""                  // 部署配置
}
```



如果是在开发中，请使用第一种配置方式，此时前后端服务分开启动。

如果是 使用 ASP.NET Core 托管 静态页面，请使用第二种方式，让 `host=""`。
