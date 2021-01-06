sudo docker run -d  --name onlinecompiler  --net=host  --restart=always \
-v /storage/g/OnlineCompiler/frontend/build:/app/dist \
-v /storage/docker/OnlineCompiler/data:/app/data \
jansora/onlinecompiler:v2

