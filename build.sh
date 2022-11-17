#
#docker build  -f ./Dockerfile_dependencies -t onlinecompiler_dependencies .
#docker tag onlinecompiler_dependencies ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0
#docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0


# 打包前端静态文件
echo 'cd frontend && yarn && yarn build && cd ..'
cd frontend && yarn && yarn build && cd ..
# 合并前端静态文件
cp -r frontend/build/* quarkus/src/main/resources/META-INF/resources


# 打包后端可执行文件
cd quarkus && quarkus build --native -Dquarkus.native.container-build=true -Dquarkus.native.container-runtime=docker && cd ..

docker build -t onlinecompiler .

docker tag onlinecompiler ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1
docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1

#docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler:v5 .


#docker run --rm -it --entrypoint bash ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1


#cp target/onlinecompiler-1.0.0-SNAPSHOT-runner /mnt/smb/