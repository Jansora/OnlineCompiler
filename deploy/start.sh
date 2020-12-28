sudo docker run -d -p 9002:80 --network app --ip 192.168.0.61 -h 192.168.0.61 --name onlinecompiler --restart=always \
-v /root/g/OnlineCompiler/frontend/build:/app/dist \
-v /storage/docker/OnlineCompiler/data:/app/data \
jansora/onlinecompiler:v2
