#docker build  -f ./Dockerfile_dependencies -t onlinecompiler_dependencies .
#docker tag onlinecompiler_dependencies ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0
#docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0


#docker build -t ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1 .

cd frontend && yarn && yarn build && cd ..


cp -r frontend/build/* quarkus/src/main/resources/META-INF/resources

#cd quarkus && quarkus build --native  -Dquarkus.container-image.build=true
cd quarkus && quarkus build --native -Dquarkus.native.container-build=true -Dquarkus.native.container-runtime=docker

docker build -t onlinecompiler .

docker tag onlinecompiler ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1
docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1

#docker push ccr.ccs.tencentyun.com/jansora/onlinecompiler:v5 .


#docker run --rm -it --entrypoint bash ccr.ccs.tencentyun.com/jansora/onlinecompiler:7.1