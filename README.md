# OnlineCompiler
在线编译,运行Java, Golang, Python等..

## 手动打包 docker 镜像

1. 创建应用数据目录 `mkdir /app && cd /app`

2. 手动下载本仓库docker镜像 `git clone https://github.com/Jansora/OnlineCompiler.git`

3. 进入git目录 `cd OnlineCompiler`

4. 构建镜像 `docker build -t jansora/onlinecompiler:v5 .`




## 从 docker 镜像

1. 创建应用数据目录 `mkdir /app && cd /app`
2. 拉取镜像 `docker pull jansora/onlinecompiler:v5`

> 国内请使用 [阿里云容器镜像](https://cr.console.aliyun.com/) 提速
> `docker pull registry.cn-shanghai.aliyuncs.com/jansora/onlinecompiler:5.0`


# 验证安装成功




启动镜像 `sudo docker run -d -p 9003:9003 --name onlinecompiler -v /app/data:/app/data jansora/onlinecompiler:v5`

> 使用 阿里云容器镜像 请把上述命令的 `jansora/onlinecompiler:v5` 替换为 `registry.cn-shanghai.aliyuncs.com/jansora/onlinecompiler:5.0`


> /app/data 为临时数据存放, 去掉也无妨

浏览器输入 localhost:9003 即可看到启动成功

# 在线 demo
https://onlinecompiler.github.jansora.com


> 安装教程以linux下操作为准, 但windows也支持安装, windows用户请根据以上步骤自行搭建安装教程
> 非docker安装请参考 `Dockerfile` 具体操作

