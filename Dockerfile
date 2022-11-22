FROM ccr.ccs.tencentyun.com/jansora/onlinecompiler_dependencies:1.0

ENV ONLINE_COMPILER_PWD /app

RUN mkdir -p /app

WORKDIR /app

COPY ./quarkus/target/onlinecompiler-7.3-runner ./quarkus-onlinecompiler

RUN chmod 755 ./quarkus-onlinecompiler
#COPY ./frontend ./frontend


#COPY ./nginx.conf /etc/nginx/nginx.conf


CMD ["./quarkus-onlinecompiler"]





