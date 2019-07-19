jiacrontab-frontend 前端代码
## 安装包管理工具
[安装yarn](https://yarnpkg.com)
## 安装依赖

```
yarn
```

## 配置代理

修改 package.json 代理使接口指向 jiacrontab 服务

```json
"proxy": {
        "/v1": {
            "target": "http://localhost:20000",
            "changeOrigin": true
        },
        "/v2": {
            "target": "http://localhost:20000",
            "changeOrigin": true
        }
    }
```

## 开发环境运行

```
yarn start
```

## 生产环境编译

```
yarn build
```

## 打包jiacrontab
```sh
go get -u github.com/kataras/bindata/cmd/bindata
cd jiacrontab/jiacrontab_admin
// 生成bindata_gzip.go
bindata -pkg admin ./assets/...

cd ..
make build
```
