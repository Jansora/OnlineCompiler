sudo docker run -d -p 9002:9003 --name onlinecompiler -v /home/ubuntu/docker/github/OnlineCompiler/frontend/build:/app/frontend.build -v /home/ubuntu/docker/OnlineCompiler/data:/app/data jansora/onlinecompiler:v4


# sudo docker run -d -p 9002:9003 --name onlinecompiler
# -v /home/ubuntu/docker/github/OnlineCompiler/frontend/build:/app/frontend.build
# -v /home/ubuntu/docker/OnlineCompiler/data:/app/data jansora/onlinecompiler:v4