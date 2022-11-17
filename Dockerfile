FROM ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0

RUN mkdir -p /app

WORKDIR /app

COPY ./quarkus/target/onlinecompiler-1.0.0-SNAPSHOT-runner ./quarkus-onlinecompiler

RUN chmod 755 ./quarkus-onlinecompiler
#COPY ./frontend ./frontend


#COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["bash", "quarkus-onlinecompiler"]





