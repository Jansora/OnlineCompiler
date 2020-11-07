sudo docker run -d -p 9002:80 --name onlinecompiler --restart=always \
-v /root/g/OnlineCompiler/frontend/build:/app/dist \
-v /docker/OnlineCompiler/data:/app/data \
jansora/onlinecompiler:v2
