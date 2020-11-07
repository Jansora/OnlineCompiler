# OnlineCompiler
在线编译,运行Java, Golang, Python等..

## 手动安装教程

1. 创建应用数据目录 `mkdir /app && cd /app`

2. 手动下载本仓库docker镜像 `git clone https://github.com/Jansora/OnlineCompiler.git`

3. 进入git目录 `cd OnlineCompiler/deploy`

4. 自动镜像 `bash auto.sh`


## 一键安装教程

1. 创建应用数据目录 `mkdir /app && cd /app`
2. 拉取镜像 `docker pull jansora/onlinecompiler:v2`
3. 启动镜像 `sudo docker run -d -p 9002:80 --name onlinecompiler -v /app/data:/app/data jansora/onlinecompiler:v2`


# 验证安装成功

浏览器输入 localhost:9002 即可看到启动成功


> 安装教程以linux下操作为准, 但windows也支持安装, windows用户请根据以上步骤自行搭建安装教程
> 非docker安装请参考 `Dockerfile` 具体操作
