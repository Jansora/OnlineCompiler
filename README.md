# OnlineCompiler
支持在线运行的代码演练场(Playground), 基于React + Quarkus (Grallvm) 构建, 目前已支持Java, Golang, Python, Nodejs, Javascript等.

# 在线 demo
https://onlinecompiler.github.jansora.com

部署方案分为三种
1. 物理机部署
2. Docker 部署
3. Kubernetes 部署
# 物理机部署
需要自备 `java jdk 17`(jdk17+) `python3`(3.6+) `golang` `nodejs` (14+) 可执行环境
请通过 `java -version` `python3` `go version` `node -v`
需要提供足够的权限来创建临时文件以及运行权限

从 release 下载


# Docker 部署

## 获取镜像
1. 创建应用数据目录 `mkdir /app && cd /app`
2. 拉取镜像 `docker pull ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1`

## 部署到 docker
启动镜像 `sudo docker run -d -p 9003:8080 --name onlinecompiler -v /app/data:/app/data ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1`

> /app/data 为临时数据存放, 去掉也无妨
> 
浏览器输入 localhost:9003 即可看到启动成功

监测日志 `docker logs -f onlinecompiler`

## kubernetes 部署
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





> 安装教程以linux下操作为准, 但windows也支持安装, windows用户请根据以上步骤自行搭建安装教程


