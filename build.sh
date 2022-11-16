
docker build -t jansora/onlinecompiler:7.1 .

cd frontend && yarn && yarn build && cd ..

#docker build -t ccr.ccs.tencentyun.com/jansora/onlinecompiler:v5 .