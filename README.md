# OnlineCompiler
支持在线运行的代码演练场(Playground), 基于React + Quarkus (Grallvm) 构建, 目前已支持Java, Golang, Python, Nodejs, Javascript等.

# 物理机安装


## 手动打包 docker 镜像

1. 创建应用数据目录 `mkdir /app && cd /app`

2. 手动下载本仓库docker镜像 `git clone https://github.com/Jansora/OnlineCompiler.git`

3. 进入git目录 `cd OnlineCompiler`

4. 构建镜像 `docker build -t ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1 .`



## 从 docker 镜像拉取

1. 创建应用数据目录 `mkdir /app && cd /app`
2. 拉取镜像 `docker pull ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1`

# 部署

## 部署到 docker
启动镜像 `sudo docker run -d -p 9003:9003 --name onlinecompiler -v /app/data:/app/data ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1`


## 部署到 kubernetes
参考 kubernetes 子目录
deployment -> service -> yaml 部署
```
git clone https://github.com/Jansora/OnlineCompiler.git
cd OnlineCompiler/kubernetes

# 部署 deployment
kubectl -f onlinecompiler-deployment.yaml
# 部署 service
kubectl -f onlinecompiler-service.yaml

# 部署网关
kubectl -f nginx-ingress-controller.yaml

# 部署网关配置
# 需要调整域名配置以适配当前 k8s 集群
kubectl -f github-ingress.yaml
```

> /app/data 为临时数据存放, 去掉也无妨

浏览器输入 localhost:9003 即可看到启动成功

# 在线 demo
https://onlinecompiler.github.jansora.com


> 安装教程以linux下操作为准, 但windows也支持安装, windows用户请根据以上步骤自行搭建安装教程
> 非docker安装请参考 `Dockerfile` 具体操作

