sudo docker run -d -p 9002:80 -p 9093:9002  --network app --ip 192.168.0.61 -h 192.168.0.61 --name onlinecompiler --restart=always \
-v /storage/g/OnlineCompiler/frontend/build:/app/dist \
-v /storage/docker/OnlineCompiler/data:/app/data \
jansora/onlinecompiler:v2
