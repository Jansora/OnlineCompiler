# OnlineCompiler
在线编译,运行Java, Golang, Python等..

# 手动安装教程

1. 创建应用数据目录 `mkdir /app`

2. 手动下载本仓库docker镜像 `docker pull jansora/onlinecompiler:v2`

3. 启动镜像 `sudo docker run -d -p 9002:80 --name onlinecompiler -v /app/data:/app/data jansora/onlinecompiler:v2`

4. 浏览器输入 localhost:9002 即可看到启动成功
